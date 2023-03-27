# coding=utf-8
"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import Flask, render_template, redirect, flash, url_for, request
from HrnestBoss import app, login, db
from HrnestBoss.DbModel.models import user, default_privileges
import HrnestBoss.controlers.mail as mail_client
import HrnestBoss.controlers.helpers as helpers
from flask_login import current_user, login_user, login_required, logout_user
from HrnestBoss.DbModel.forms import LoginForm, RegistrationForm, Forgotten_Credentials, Lost_Activation_email, RenewCredentials
from flask import send_from_directory, session
import msal
import uuid
import os

ENABLE_MSAL = app.config['ENABLE_MSAL']
ENABLE_ANYMOUS_USERS = app.config['ENABLE_ANYMOUS_USERS']

@login.user_loader
def load_user(id):
    return user.query.get(int(id))

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route(app.config['REDIRECT_PATH'])  # Its absolute URL must match your app's redirect_uri set in AAD
def authorized():    
    try:
        if ENABLE_MSAL:
            cache = _load_cache()
            result = _build_msal_app(cache=cache).acquire_token_by_auth_code_flow(
                session.get("flow", {}), request.args)
            if "error" in result:
                return render_template("auth_error.html", result=result)
            session["user"] = result.get("id_token_claims")
            _save_cache(cache)
            _user = user.query.filter_by(federated=session["user"]["oid"]).first()
            if _user is None:
                flash('Your account is not linked, Please register to app')
                return redirect(url_for('login'))
            login_user(_user)
    except ValueError:  # Usually caused by CSRF
        pass  # Simply ignore them    
    return redirect(url_for('home'))

@app.route('/', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated or (current_user.is_anonymous and ENABLE_ANYMOUS_USERS):
        if current_user.is_active:
            return redirect(url_for('home'))
        if current_user.is_authenticated:
            flash('Account is not active => please check your email for activation link')
        
        session["state"] = str(uuid.uuid4())    
        session["flow"] = _build_auth_code_flow(scopes=app.config['SCOPE'])
    form = LoginForm()
    if form.validate_on_submit():
        _user = user.query.filter_by(login=form.username.data).first()
        if _user is None or not _user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(_user, remember=form.remember_me.data)
        if "user" in session:
            print(session["user"]["oid"])
            chk = False
            if _user.federated is None:
                _tmp=user.query.filter_by(federated=session["user"]["oid"]).first()
                if _tmp is None:
                    chk=True
                    _user.federated = session["user"]["oid"]
            if _user.uid is None:
                chk=True
                _user.uid = str(uuid.uuid4())
            if chk:
                db.session.commit()
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('register')
        return redirect(next_page)
        
    return render_template('login.html', title='Sign In', form=form, anymous=ENABLE_ANYMOUS_USERS, m_identity= ENABLE_MSAL, auth_url=session["flow"]["auth_uri"])

@app.route('/logout')
@login_required
def logout():
    logout_user() 
    if "user" in session and ENABLE_MSAL:
        return redirect(app.config['AUTHORITY'] + "/oauth2/v2.0/logout" +
        "?post_logout_redirect_uri=" + url_for('login', _external=True))
    else:
        return redirect(url_for('login'))

@app.route('/new_credentials/<email>/<guid>', methods=['GET', 'POST'])
def new_credentials(email,guid):
    message ='Link Error'
    if helpers.is_valid_uuid(guid):        
        form = RenewCredentials()
        if form.validate_on_submit():
            _user = user.query.filter_by(email=email,uid=guid).first()
            if form.change_userName.data:
                _user.login=form.username.data
            if form.change_userName.data:
                _user.set_password(form.password.data)
            db.session.commit()
            flash('Congratulations, credentials changed')
            return redirect(url_for('login'))
    return render_template('change_account.html', title='Change Acount', form=form)

@app.route('/forview')
def set_userAsForView():
    if ENABLE_ANYMOUS_USERS:
        _user = user.query.filter_by(email='no_email@none.com',login='anymous').first()
        if _user is None:
            _user = user(login='anymous', email='no_email@none.com', uid=str(uuid.uuid4()),active=True, is_admin=False, hrnest_access=False )
            _user.set_password('None')
            db.session.add(_user)
            db.session.commit()

        login_user(_user, remember=False)
        return redirect(url_for('home'))
    return redirect(url_for('login'))


@app.route('/activateAccount/<email>/<guid>', methods=['GET', 'POST'])
def activateAccount(email,guid):
    message ='Link Error'
    if helpers.is_valid_uuid(guid):
        _user = user.query.filter_by(email=email,uid=guid).first()
        message =''
        if _user is None:
            message =  'Activation error => selected user dont exist'
        elif _user.active:
            message =  'Activation error => selected user has previously been activated'
        else :
            _user.active = True
            db.session.commit()
            message =  'Account Activated'
    return render_template('account_activation.html',message=message)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('login'))
    form = RegistrationForm()
    if form.validate_on_submit():
        _default_privileges = default_privileges.query.filter_by(email=form.email.data).first()
        if "user" in session:
            if _default_privileges is None:
                _user = user(login=form.username.data, email=form.email.data, federated=session["user"]["oid"], uid=str(uuid.uuid4()),active=False, is_admin=False, hrnest_access=False )
            else :
                _user = user(login=form.username.data, email=form.email.data, federated=session["user"]["oid"], uid=str(uuid.uuid4()),active=False, is_admin=_default_privileges.is_admin, hrnest_access=_default_privileges.hrnest_access )
        else :
            if _default_privileges is None:
                _user = user(login=form.username.data, email=form.email.data, uid=str(uuid.uuid4()),active=False, is_admin=False, hrnest_access=False )
            else :
                _user = user(login=form.username.data, email=form.email.data, uid=str(uuid.uuid4()),active=False, is_admin=_default_privileges.is_admin, hrnest_access=_default_privileges.hrnest_access )
                
        _user.set_password(form.password.data)
        db.session.add(_user)
        db.session.commit()
        mail_client.send_activation_email(_user.login,_user.email,_user.uid)
        flash('Congratulations, you are now a registered user! An activation e-mail has been sent to your mailbox')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route('/mail_reset', methods=['GET', 'POST'])
def mail_reset():    
    form = Forgotten_Credentials()
    if form.validate_on_submit():
        _user = user.query.filter_by(email=form.email.data).first()
        mail_client.send_resetAccount_email(_user.login,_user.email,_user.uid)
        flash('Restore mail has been sent to your mailbox !')
        return redirect(url_for('login'))
    return render_template('restore_selectMail.html', message='Restore Account', form=form)

@app.route('/mail_activation', methods=['GET', 'POST'])
def mail_activation():    
    form = Lost_Activation_email()
    if form.validate_on_submit():
        _user = user.query.filter_by(email=form.email.data).first()
        mail_client.send_activation_email(_user.login, _user.email, _user.uid)
        flash('Activation mail has been sent to your mailbox !')
        return redirect(url_for('login'))
    return render_template('restore_selectMail.html', message='Activate Account', form=form)

@app.route('/home')
@login_required
def home():
    """Renders the home page."""
    return render_template(
        'index.jade',
        title='HRnestBOSS',
        year=datetime.now().year,
    )

@app.route('/contact')
@login_required
def contact():
    """Renders the contact page."""
    return render_template(
        'contact.jade',
        title='Contact',
        year=datetime.now().year,
        message='Your contact page.'
    )

@app.route('/about')
@login_required
def about():
    """Renders the about page."""
    return render_template(
        'about.jade',
        title='About',
        year=datetime.now().year,
        message='Your application description page.'
    )



def _load_cache():
    cache = msal.SerializableTokenCache()
    if session.get("token_cache"):
        cache.deserialize(session["token_cache"])
    return cache

def _save_cache(cache):
    if cache.has_state_changed:
        session["token_cache"] = cache.serialize()

def _build_msal_app(cache=None, authority=None):
    try:
        return msal.ConfidentialClientApplication(
            app.config['CLIENT_ID'], authority=authority or app.config['AUTHORITY'],
            client_credential=app.config['CLIENT_SECRET'], token_cache=cache)
    except(e):
        return {message_err: 'msal error' + str(e)}

def _build_auth_code_flow(authority=None, scopes=None):
    return _build_msal_app(authority=authority).initiate_auth_code_flow(
        scopes or [],
        redirect_uri=url_for("authorized", _external=True))

def _get_token_from_cache(scope=None):
    cache = _load_cache()  # This web app maintains one cache per session
    cca = _build_msal_app(cache=cache)
    accounts = cca.get_accounts()
    if accounts:  # So all account(s) belong to the current signed-in user
        result = cca.acquire_token_silent(scope, account=accounts[0])
        _save_cache(cache)
        return result
