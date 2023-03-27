from HrnestBoss import app, db
from HrnestBoss.DbModel.models import shift_type
from sqlalchemy import or_,and_
import datetime
 
def check_Values():
    # enumerable requests id>=10000
    TypesWork=[
        {'name':'','description':'Blank Record','emp_type':0,'enumerable':None,'info':None,'type_source':'external','iswholeday':True,'req_type_id':None,'time_from':None,'time_to':None},
        {'name':'1','description':'First Shift','emp_type':1,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 06:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 14:15:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'2','description':'Second Shift','emp_type':1,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 13:45:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 22:00:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'1n','description':'Overtime First Shift','enumerable':None,'info':None,'emp_type':1,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 06:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 18:00:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'n2','description':'Overtime Second Shift','enumerable':None,'info':None,'emp_type':1,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 10:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 22:00:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'s','description':'s type of work','emp_type':1,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 08:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 16:15:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'SNET','description':'SNET type of work','emp_type':1,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 09:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 17:15:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'nb','description':'nb type of work','emp_type':1,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 09:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 17:15:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'1','description':'First Shift','emp_type':2,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 07:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 14:15:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'2','description':'Second Shift','emp_type':2,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 13:45:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 21:00:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'1n','description':'Overtime First Shift','emp_type':2,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 08:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 15:15:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'n2','description':'Overtime Second Shift','emp_type':2,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 14:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 21:15:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'s','description':'s type of work','emp_type':2,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 08:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 15:15:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'SNET','description':'SNET type of work','emp_type':2,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 09:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 16:15:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'nb','description':'nb type of work','emp_type':2,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 09:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 16:15:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'1','description':'First Shift','emp_type':3,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 07:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 13:45:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'2','description':'Second Shift','emp_type':3,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 13:45:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 21:30:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'1n','description':'Overtime First Shift','emp_type':3,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 06:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 13:45:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'n2','description':'Overtime Second Shift','emp_type':3,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 14:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 21:45:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'s','description':'s type of work','emp_type':3,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 08:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 15:45:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'SNET','description':'SNET type of work','emp_type':3,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 09:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 16:45:00', "%Y-%m-%d %H:%M:%S")},
        {'name':'nb','description':'nb type of work','emp_type':3,'enumerable':None,'info':None,'type_source':'timetable','iswholeday':True,'req_type_id':None,'time_from':datetime.datetime.strptime('1980-01-01 09:00:00', "%Y-%m-%d %H:%M:%S"),'time_to':datetime.datetime.strptime('1980-01-01 16:45:00', "%Y-%m-%d %H:%M:%S")},
        {'name':None,'description':'Annual leave','emp_type':0,'enumerable':None,'info':'linear-gradient( 110deg, rgb(255, 124, 128, 0.5) 60%, rgb(255, 124, 128, 0.5) 60%)','type_source':'request','iswholeday':True,'req_type_id':1,'time_from':None,'time_to':None},
        {'name':None,'description':'Parental leave','emp_type':0,'enumerable':None,'info':'linear-gradient( 110deg, rgb(255, 124, 128, 0.5) 60%, rgb(255, 124, 128, 0.5) 60%)','type_source':'request','iswholeday':True,'req_type_id':12,'time_from':None,'time_to':None},
        {'name':None,'description':'Maternity leave','emp_type':0,'enumerable':None,'info':'linear-gradient( 110deg, rgb(255, 124, 128, 0.5) 60%, rgb(255, 124, 128, 0.5) 60%)','type_source':'request','iswholeday':True,'req_type_id':10,'time_from':None,'time_to':None},
        {'name':None,'description':'Day off for working on bank holiday','enumerable':None,'info':'linear-gradient( 110deg, rgb(255, 124, 128, 0.5) 60%, rgb(255, 124, 128, 0.5) 60%)','emp_type':0,'enumerable':None,'type_source':'request','iswholeday':True,'req_type_id':8,'time_from':None,'time_to':None},
        {'name':None,'description':'Extended parental leave','emp_type':0,'enumerable':None,'info':'linear-gradient( 110deg, rgb(255, 124, 128, 0.5) 60%, rgb(255, 124, 128, 0.5) 60%)','type_source':'request','iswholeday':True,'req_type_id':24,'time_from':None,'time_to':None},
        {'name':None,'description':'Unpaid leave','emp_type':0,'enumerable':None,'info':'repeating-linear-gradient(to left,rgba(255,0,0,1),rgba(255,0,0,1) 2px,rgba(255,255,255,0) 2px,rgba(255,255,255,0) 5px)','type_source':'request','iswholeday':True,'req_type_id':5,'time_from':None,'time_to':None},
        {'name':None,'description':'Excused absence','emp_type':0,'enumerable':None,'info':'linear-gradient( 110deg, rgb(255, 124, 128, 0.5) 60%, rgb(255, 124, 128, 0.5) 60%)','type_source':'request','iswholeday':True,'req_type_id':27,'time_from':None,'time_to':None},
        {'name':None,'description':'Home Office','emp_type':0,'enumerable':None,'info':'repeating-linear-gradient(45deg,#add8e6,#add8e6 2px,rgba(255,255,255,0) 2px,rgba(255,255,255,0) 5px)','type_source':'request','iswholeday':True,'req_type_id':17,'time_from':None,'time_to':None},
        {'name':None,'description':'Leave on demand','emp_type':0,'enumerable':None,'info':'linear-gradient( 110deg, rgb(255, 124, 128, 0.5) 60%, rgb(255, 124, 128, 0.5) 60%)','type_source':'request','iswholeday':True,'req_type_id':2,'time_from':None,'time_to':None},
        {'name':None,'description':'Occasional leave','emp_type':0,'enumerable':None,'info':'linear-gradient( 110deg, rgb(255, 124, 128, 0.5) 60%, rgb(255, 124, 128, 0.5) 60%)','type_source':'request','iswholeday':True,'req_type_id':3,'time_from':None,'time_to':None},
        {'name':'QC','description':'QC type of work','emp_type':0,'enumerable':None,'info':None,'type_source':'external','iswholeday':True,'req_type_id':None,'time_from':None,'time_to':None},
        {'name':'Szkol','description':'Szkol type of work','emp_type':0,'enumerable':None,'info':None,'type_source':'external','iswholeday':True,'req_type_id':None,'time_from':None,'time_to':None},
        {'name':'LD','description':'LD type of work','emp_type':0,'enumerable':None,'info':None,'type_source':'external','iswholeday':True,'req_type_id':None,'time_from':None,'time_to':None},
        {'name':'z','description':'z type of work','emp_type':0,'enumerable':None,'info':None,'type_source':'external','iswholeday':True,'req_type_id':None,'time_from':None,'time_to':None},
        {'name':None,'description':'Short Time','emp_type':2,'enumerable':True,'info':'linear-gradient( 110deg,  rgb(255, 87, 51,0.3) 60%, rgb(255, 255, 255,0.2) 60%)','type_source':'request','iswholeday':True,'req_type_id':10000,'time_from':None,'time_to':None},
        {'name':None,'description':'Maternal Time','emp_type':3,'enumerable':True,'info':'repeating-linear-gradient(-45deg,#ddd,#ddd 3px,rgba(255,255,255,0.3) 2px,rgba(255,255,255,0.2) 5px)','type_source':'request','iswholeday':True,'req_type_id':10001,'time_from':None,'time_to':None}
        ]

    for shiftTp in TypesWork:
        shfT=shift_type.query.filter(and_(shift_type.name==shiftTp['name'] , shift_type.description==shiftTp['description'],shift_type.emp_type==shiftTp['emp_type'])).all()
        if len(shfT)==0:
            a=shift_type(name=shiftTp['name'],description=shiftTp['description'],emp_type=shiftTp['emp_type'],type_source=shiftTp['type_source'],iswholeday=shiftTp['iswholeday'],req_type_id=shiftTp['req_type_id'],time_from=shiftTp['time_from'],time_to=shiftTp['time_to'],enumerable=shiftTp['enumerable'],info=shiftTp['info'])
            db.session.add(a)
        db.session.commit()

def build_sample_db():
    """
    Populate a small db with some example entries.
    """

    import string
    import random

    db.drop_all()
    db.create_all()
    # passwords are hashed, to use plaintext passwords instead:
    # test_user = User(login="test", password="test")
    test_user = User(login="test", password=generate_password_hash("test"))
    db.session.add(test_user)

    first_names = [
        'Harry', 'Amelia', 'Oliver', 'Jack', 'Isabella', 'Charlie','Sophie', 'Mia',
        'Jacob', 'Thomas', 'Emily', 'Lily', 'Ava', 'Isla', 'Alfie', 'Olivia', 'Jessica',
        'Riley', 'William', 'James', 'Geoffrey', 'Lisa', 'Benjamin', 'Stacey', 'Lucy'
    ]
    last_names = [
        'Brown', 'Smith', 'Patel', 'Jones', 'Williams', 'Johnson', 'Taylor', 'Thomas',
        'Roberts', 'Khan', 'Lewis', 'Jackson', 'Clarke', 'James', 'Phillips', 'Wilson',
        'Ali', 'Mason', 'Mitchell', 'Rose', 'Davis', 'Davies', 'Rodriguez', 'Cox', 'Alexander'
    ]

    for i in range(len(first_names)):
        user = User()
        user.first_name = first_names[i]
        user.last_name = last_names[i]
        user.login = user.first_name.lower()
        user.email = user.login + "@example.com"
        user.password = generate_password_hash(''.join(random.choice(string.ascii_lowercase + string.digits) for i in range(10)))
        db.session.add(user)

    db.session.commit()
    return