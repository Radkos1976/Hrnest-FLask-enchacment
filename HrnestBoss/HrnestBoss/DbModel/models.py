# coding=utf-8
"""
Db Models for sql alchemy
"""

from HrnestBoss import db
from sqlalchemy_utils import UUIDType 
import sqlalchemy_utils
import uuid
from datetime import datetime,date
from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlite3 import Connection as SQLite3Connection
from werkzeug.security import generate_password_hash, check_password_hash

@event.listens_for(Engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, SQLite3Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.close()


# Types of shifts
class shift_type(db.Model):
     id=db.Column(db.Integer(),primary_key=True,unique=True)
     # If name is None then request is only info (dont change data)
     name=db.Column(db.String())
     description =db.Column(db.String())
     emp_type=db.Column(db.Integer())
     #type of data source request / timetable range hour
     type_source = db.Column(db.String())
     # If type_source == request det data about allDay and request ID
     iswholeday= db.Column(db.Boolean())
     req_type_id =db.Column(db.Integer())
     # IF  type_source == timetable set range of time
     time_from=db.Column(db.DateTime())
     time_to=db.Column(db.DateTime())
     # Add external request if true field emp_type determne rows_source
     enumerable=db.Column(db.Boolean())
     #Additional field with info senedet to frontend
     info=db.Column(db.String())
     objversion=db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)

     def __repr__(self):
        return '<id {}>'.format(self.id) 

# Pupulate pearsons in group
class work_group(db.Model):
    id=db.Column(db.Integer(),primary_key=True,unique=True)
    name=db.Column(db.String())
    description=db.Column(db.String())
    leader=db.Column(db.String())
    objversion=db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)

    def __repr__(self):
        return '<id {}>'.format(self.id)

# request from users about day_off...home office etc
class user_request(db.Model):
    number=db.Column(db.Integer(),primary_key=True,unique=True)
    status=db.Column(db.String())
    userId=db.Column(sqlalchemy_utils.UUIDType(binary=False),nullable=True)
    typeId=db.Column(db.Integer())
    title=db.Column(db.String())
    isWholeDay=db.Column(db.Boolean())
    dateFrom=db.Column(db.DateTime())
    dateTo=db.Column(db.DateTime())
    #Column for pearsons from outside of www/hrnest db => if userId is empty then search table by int emp_id
    emp_id=db.Column(db.Integer())

    def __repr__(self):
        return '<number {}>'.format(self.number)
# Users 
class users(db.Model):
    id = db.Column(db.Integer(),primary_key=True,unique=True) 
    uid = db.Column(sqlalchemy_utils.UUIDType(binary=False),nullable=True)
    emp_id=db.Column(db.String(),nullable=True)
    first_name= db.Column(db.String())
    last_name= db.Column(db.String())
    default_wrkgroup= db.Column(db.Integer(),db.ForeignKey(work_group.id),unique=False,nullable=True)
    position=db.Column(db.String(),nullable=True)
    snet=db.Column(db.String(),nullable=True)
    objversion=db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)
    active = db.Column(db.Boolean())
    
    def __repr__(self):
        return '<id {}>'.format(self.id)

#List of created Timetables
class timetable(db.Model):
    id= db.Column(db.Integer(),primary_key=True,unique=True)
    hrnest_id=db.Column(db.Integer(),nullable=True,unique=True)
    title=db.Column(db.String())
    date_from  = db.Column(db.DateTime())
    date_to= db.Column(db.DateTime())
    time_offset=db.Column(db.Integer())
    objversion=db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)        
    db.CheckConstraint("date_from>=date_to", name="ck_started_before_ended")
    
    def __repr__(self):
        return '<id {}>'.format(self.id)     
   

# Persons in selected timetables
class user2timetable(db.Model):
    id=db.Column(sqlalchemy_utils.UUIDType(binary=False),primary_key=True,unique=True)
    user_id=db.Column(db.Integer(),db.ForeignKey(users.id,ondelete="CASCADE") , primary_key=True,unique=False,nullable=False)
    timetable_id=db.Column(db.Integer(),db.ForeignKey(timetable.id,ondelete="CASCADE"), primary_key=True,unique=False,nullable=False)
    default_wrkgroup= db.Column(db.Integer(),db.ForeignKey(work_group.id,onupdate="CASCADE"),unique=False,nullable=True)
    objversion=db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)
    changes=db.Column(db.Integer(),default=0)
    db.UniqueConstraint('user_id', 'timetable_id', name='unique_user_in_timetable')

 
    def __repr__(self):
        return '<timetable_id {}>'.format(self.timetable_id)

# Shift by time tables
class shift(db.Model):
     id= db.Column(sqlalchemy_utils.UUIDType(binary=False),primary_key=True,unique=True)
     user_id =db.Column(sqlalchemy_utils.UUIDType(binary=False),db.ForeignKey(user2timetable.id,ondelete="CASCADE"), primary_key=True,unique=False,nullable=False)
     date =db.Column(db.DateTime(),nullable=False)
     type_id =db.Column(db.Integer(),db.ForeignKey(shift_type.id,ondelete="CASCADE"))
     emp_type=db.Column(db.String())
     date_updated=db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)     
     db.UniqueConstraint('user_id', 'date', name='unique_date_timetableUSR')
     def __repr__(self):
        return '<id {}>'.format(self.id)

#Table with automatic privileges for mail
class default_privileges(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True)
    is_admin = db.Column(db.Boolean())
    hrnest_access =  db.Column(db.Boolean())

    def __repr__(self):
        return '<mail_id {}>'.format(self.id)

# Create user model.
class user(db.Model):
    id = db.Column(db.Integer, primary_key=True) 
    uid = db.Column(sqlalchemy_utils.UUIDType(binary=False),primary_key=False,unique=True)
    federated = db.Column(db.String(500),nullable=True,unique=True)
    login = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(500))
    active = db.Column(db.Boolean()) 
    is_admin = db.Column(db.Boolean())
    hrnest_access =  db.Column(db.Boolean())

    # Flask-Login integration
    # NOTE: is_authenticated, is_active, and is_anonymous
    # are methods in Flask-Login < 0.3.0
    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return self.active

    @property
    def is_anonymous(self):
        return False
    
    @property
    def is_hrnest_access(self):
       return self.hrnest_access

    def get_id(self):
        return self.id

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    # Required for administrative interface
    def __unicode__(self):
        return self.username
