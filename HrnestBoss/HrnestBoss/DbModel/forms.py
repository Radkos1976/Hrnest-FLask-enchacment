from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from markupsafe import Markup
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo
from HrnestBoss.DbModel.models import user

def validate_username(self, username):
        _user = user.query.filter_by(login=username.data).first()
        if _user is not None:
            raise ValidationError('Please use a different username.')
        if len(username.data) < 3:
            raise ValidationError('Please use a different username.')

def validate_email(self, email):
        if (len(email.data)<11):
            raise ValidationError('The email must come from the domain quasar.us')        
        if email.data[-10:] != '@quasar.us' and email.data!='radkos76@gmail.com':
            raise ValidationError('The email must come from the domain quasar.us')

def email_exist(self, email):
    _user = user.query.filter_by(email=email.data).first()             
    if _user is not None:
          raise ValidationError('Email exist, Please use a different email address.')

def email_not_exist(self, email):
    _user = user.query.filter_by(email=email.data).first()
    if _user is None:
        raise ValidationError('Email not exist in List of Registered Users')

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')    
    submit = SubmitField('Sign In')     
    
class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), validate_username])
    email = StringField('Email', validators=[DataRequired(), Email(), validate_email, email_exist])
    password = PasswordField('Password', validators=[DataRequired()])
    password2 = PasswordField(
        'Repeat Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

class Forgotten_Credentials(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email(), validate_email, email_not_exist])
    submit = SubmitField('Send Restore Mail')

class Lost_Activation_email(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email(), validate_email, email_not_exist])
    submit = SubmitField('Send Acitvation Mail')

class RenewCredentials(FlaskForm):
    def ternarry_validate_username(self, field):
        if self.change_userName.data:
            if self.username.data is None:
                raise ValidationError('Empty Username')

            validate_username(self,self.username)
    def ternarry_validate_password(self, field):
        if self.change_password.data:
            if self.password.data is None:
                raise ValidationError('Empty Password')

    def ternarry_validate_password2(self, field):
        if self.change_password.data:
            if self.password2.data is None:
                raise ValidationError('Empty Password')
            if self.password2.data != self.password.data :
                raise ValidationError('Field Password must be equal')

    change_userName = BooleanField('Change UserName ?')
    username = StringField('Username', validators=[ternarry_validate_username] )
    change_password = BooleanField('Change Password ?')
    password = PasswordField('Password', validators=[ternarry_validate_password] )
    password2 = PasswordField(
        'Repeat Password', validators=[ternarry_validate_password] )
    submit = SubmitField('Restore')
    

    
