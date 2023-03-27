# coding=utf-8
from HrnestBoss import app,db
from HrnestBoss.DbModel.models import shift_type
from sqlalchemy import or_,and_
import json

class Read():
    def Get_Timetable_types():
        return db.session.query(shift_type).filter(shift_type.type_source=='timetable').all()
    def Get_Timetable_types_emptype(emp_type):
        return db.session.query(shift_type).filter(shift_type.type_source=='timetable')\
            .filter(shift_type.emp_type==emp_type).all()
    def Get_Request_info():
        return db.session.query(shift_type).filter(shift_type.info!= None).all()
    def Get_Request_types():
        return db.session.query(shift_type).filter(shift_type.type_source=='request').all()
    def Get_RequestWWW_types():
        return db.session.query(shift_type).filter(and_(shift_type.type_source=='request',shift_type.req_type_id<10000)).all()
    def Get_RequestEnumerable_types():
        return db.session.query(shift_type).filter(and_(shift_type.type_source=='request',shift_type.req_type_id>=10000)).all()
    def Get_External_types():
        return db.session.query(shift_type).filter(shift_type.type_source=='external').all()
    #optional param => on datetime fields return only time in string format / else Datetime
    def To_JSON(data,timePresenation=False):
        tmp=[]
        for item in data:
            if timePresenation:
                if item.time_from!=None:
                    tFrom=item.time_from.strftime('%H:%M')
                else :
                     tFrom=item.time_from
                if item.time_to != None:
                    tTo=item.time_to.strftime('%H:%M')
                else:
                    tTo=item.time_to
            else:
                tFrom=item.time_from
                tTo=item.time_to
            tmr={
                'id':item.id,
                'name':item.name,
                'description':item.description,
                'emp_type':item.emp_type,
                'type_source':item.type_source,
                'iswholeday': item.iswholeday,
                'req_type_id':item.req_type_id,
                'time_from':tFrom,
                'time_to':tTo, 
                'enumerable':item.enumerable,
                'info':item.info
                }
            tmp.append(tmr)
        return tmp