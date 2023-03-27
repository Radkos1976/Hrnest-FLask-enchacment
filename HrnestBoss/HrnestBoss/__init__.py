"""
The flask application package.
"""
# newest 1.4 version of sqlalchemy not working please install 1.3.24
#pip install SQLAlchemy==1.3.24 
async_mode = None

if async_mode is None:
    try:
        import gevent  
        async_mode = 'gevent'        
    except ImportError:
        pass

    if async_mode is None:
        try:
            import eventlet
            async_mode = 'eventlet'  
        except ImportError:
            pass
    if async_mode is None:
        async_mode = 'threading'

    print('async_mode is ' + async_mode)

if __name__ == '__main__':
    if async_mode == 'eventlet':
        import eventlet
        eventlet.monkey_patch()

if async_mode == 'gevent':        
        from gevent import monkey
        monkey.patch_all()

from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_login import LoginManager,current_user
import HrnestBoss.app_config
from flask_session import Session
import sqlalchemy_utils
import os
import flask_admin as admin
from flask_admin import Admin, helpers, expose
from flask_admin.contrib.sqla import ModelView
#from flask_talisman import Talisman
import functools



#Set Main Configuration Type
#Conf_type='Development'
Conf_type='Production'

#Configuration Of working enviroment
#Developer_SQLALCHEMY_DATABASE_URI ='postgresql://TestAdmin:test@localhost/HrnestBoss_dev'

Production_SQLALCHEMY_DATABASE_URI = 'NEWDATABASE'

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'Hrnest!'
app.config.from_object(HrnestBoss.app_config)
Developer_SQLALCHEMY_DATABASE_URI =app.config['DATABASE_URL']
Session(app)
#Talisman(app)
#app.logger.level=logging.INFO
# Set enviromets from 

if Conf_type=='Development':
     app.config.update(       
       TESTING=False,
       ENV='development',
       DEBUG=True)
     app.config['SQLALCHEMY_DATABASE_URI']=Developer_SQLALCHEMY_DATABASE_URI
else:
    app.config.update(
       TESTING=False,
       ENV='production',
       DEBUG=False)

    app.config['SQLALCHEMY_DATABASE_URI']=Developer_SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_ENGINE_OPTIONS']={"connect_args": {"timeout": 100}}

app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')

socket_ = SocketIO(app, async_mode=async_mode)    
db = SQLAlchemy(app)
login = LoginManager(app)

def hrnestAccess(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if not current_user.is_hrnest_access:
            return {'message': 'Access Denied'}
        else:
            return f(*args, **kwargs)
    return wrapped

import HrnestBoss.DbModel.populateTypesOfWork as check
# Check table Shift_typesfor presets data
check.check_Values()
import HrnestBoss.routes.views
import HrnestBoss.routes.user_routing
import HrnestBoss.routes.timetable_routing
import HrnestBoss.routes.request_routing
from HrnestBoss.DbModel.models import default_privileges, user, shift_type, work_group, user_request ,users , timetable
import uuid

class MyAdminIndexView(admin.AdminIndexView):
    @expose('/')
    def index(self):
        if not current_user.is_authenticated:
            return redirect(url_for('login'))
        else :
            if current_user.is_admin:
                return super(MyAdminIndexView,self).index()
            else:
                return redirect(url_for('login'))



_admin = Admin(app,'HRnestBOSS Panel',index_view=MyAdminIndexView())
_admin.add_view(ModelView(default_privileges, db.session))
_admin.add_view(ModelView(user, db.session))
_admin.add_view(ModelView(shift_type, db.session))
_admin.add_view(ModelView(work_group, db.session))
_admin.add_view(ModelView(user_request, db.session))
_admin.add_view(ModelView(users, db.session))
_admin.add_view(ModelView(timetable, db.session))

if app.config['ENABLE_ANYMOUS_USERS']:
    _user = user.query.filter_by(email='no_email@none.com',login='anymous').first()
    if _user is None:
        _user = user(login='anymous', email='no_email@none.com', uid=str(uuid.uuid4()),active=True, is_admin=False, hrnest_access=False )
        _user.set_password('None')
        db.session.add(_user)
        db.session.commit()


    _user = user.query.filter_by(email='no_validate@none.com',login='adminHB').first()
    if _user is None:
        _user = user(login='adminHB', email='no_validate@none.com', uid=str(uuid.uuid4()),active=True, is_admin=True, hrnest_access=True )
        _user.set_password('adminHB')
        db.session.add(_user)
        db.session.commit()









