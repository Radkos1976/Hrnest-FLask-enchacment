# coding=utf-8

from HrnestBoss.DbModel.models import timetable,user2timetable,shift,shift_type,user_request
import HrnestBoss.DbModel.IntegrityTimetablepy as timetbl
from HrnestBoss.controlers.Usercontroler import readUser
from sqlalchemy import or_,func,case,and_,cast, Date
from HrnestBoss import app,db
from sqlalchemy import func
from HrnestBoss import socket_
from operator import itemgetter
import datetime
from datetime import datetime,timedelta
import json

class readTimetable():
    def TimetableByID(id):
        return  db.session.query(timetable).filter(timetable.id==int(id)).all()
    def TimetableByHrnestID(id):
        return  db.session.query(timetable).filter(timetable.hrnest_id==int(id)).all()
    def TimetableByRangeDates(d_from,d_to):
        return  db.session.query(timetable).filter(or_(timetable.date_to.between(d_from,d_to),timetable.date_from.between(d_from,d_to))).all()
    def TimetableByRangeDatesUserId(d_from,d_to,user_id):
        return  db.session.query(timetable).select_from(user2timetable).filter(user2timetable.user_id==int(user_id))\
            .join(timetable,timetable.id==user2timetable.timetable_id)\
            .filter(or_(timetable.date_to.between(d_from,d_to),timetable.date_from.between(d_from,d_to),and_(timetable.date_from<=d_from,timetable.date_to>= d_to))).all()
    def TableGetAll():        
        return  db.session.query(timetable).filter(timetable.hrnest_id!='').order_by(timetable.objversion.desc()).all()
    def DraftsGetALL():
        return db.session.query(timetable).filter(timetable.hrnest_id==None).order_by(timetable.objversion.desc()).all()
    def parse_Timetable_to_JSON(Timetable,datesAsString=True):
      try:
        now=datetime.now().date()       
        tmp=[]
        arr_data=[] 
        # Check if Length of timetable is zero => go update    
        #if len(Timetable)==0:
        #    tmp= timetbl.Changes_Timetable_List(True)
        #    Timetable=TableGetAll()
        for record in Timetable:
            if datesAsString:
                dtF=record.date_from.strftime('%Y-%m-%d')
                dtT=record.date_to.strftime('%Y-%m-%d')
            else :
                dtF=record.date_from
                dtT=record.date_to
            recordobj={
                'id':record.id,
                'hrnest_id':record.hrnest_id,
                'title':record.title,
                'date_from':dtF,
                'date_to':dtT,
                'Present': 1 if (record.date_from.date() <= now and now <= record.date_to.date()) else 2 if (now < record.date_from.date()) else 3,
                'Type':'Present Table' if (record.date_from.date() <= now and now <= record.date_to.date()) else 'Future Table' if (now < record.date_from.date()) else 'Past Table'
                }
            arr_data.append(recordobj)            
            tmp=sorted(arr_data,key=lambda x : x['date_to'],reverse=True)        
      except Exception as e:
            print(str(e))               
            return "Error parse_Timetable_to_JSON"+str(e)
      #sort By present ,future and past
      return  sorted(tmp, key=lambda x : x['Present'], reverse=False)
    #Get timetable by ID
    def Tabletible_by_id(id_Timetable):
        tmtble=id_Timetable.split(',') if type(id_Timetable) is str else [id_Timetable]
        return db.session.query(timetable).filter(timetable.id.in_(tmtble)).\
            order_by(timetable.objversion.desc()).all()
    def Calculate_sum_FN(AlL,onlyreq):        
        for item in AlL:
            rx=[itm for itm in onlyreq if itm.get('date')==item['date']]
            if len(rx)>0:                
                item['S1']=item['S1']-rx[0]['S1']
                item['S2']=item['S2']-rx[0]['S2']
        return AlL    
    # Function of summary shifts in all timetables in date range of selected timetable
    def Get_FN_by_Timetable (id_timetable): 
        tmtbl = readTimetable.TimetableByHrnestID(id_timetable)        
        withRequests = readTimetable.JSON_off_FN(\
            db.session.query(shift.date,func.sum(case({ "SNET": 1, "s": 1, "1": 1, "1n": 1, "n2": 1},value=shift_type.name, else_=0)).label('S1'),\
            func.sum(case([(shift_type.name.in_(['SNET', 's', '2', 'n2', '1n']),1)], else_=0)).label('S2'))\
            .join(shift_type,shift_type.id==shift.type_id).filter(shift.date.between(tmtbl[0].date_from,tmtbl[0].date_to)).join(user2timetable,user2timetable.id==shift.user_id)\
            .join(user_request,user_request.emp_id==user2timetable.user_id).filter(and_(user_request.title.not_in(['Home Office','Overtime']),\
                user_request.number>0,and_(user_request.dateFrom<=shift.date,user_request.dateTo>=shift.date))).group_by(shift.date).all())
        socket_.sleep(0)
        AllRequest = readTimetable.JSON_off_FN(\
            db.session.query(shift.date,func.sum(case({ "SNET": 1, "s": 1, "1": 1, "1n": 1, "n2": 1},value=shift_type.name, else_=0)).label('S1'),\
            func.sum(case([(shift_type.name.in_(['SNET', 's', '2', 'n2', '1n']),1)], else_=0)).label('S2'))\
            .join(shift_type,shift_type.id==shift.type_id).filter(shift.date.between(tmtbl[0].date_from,tmtbl[0].date_to)).group_by(shift.date).all() )
        return readTimetable.Calculate_sum_FN(AllRequest,withRequests)
    def Get_FN_draft(id_draft):
        tmtbl=readTimetable.TimetableByID(id_draft)
        withRequests =readTimetable.JSON_off_FN(\
           db.session.query(shift.date,func.sum(case({ "SNET": 1, "s": 1, "1": 1, "1n": 1, "n2": 1},value=shift_type.name, else_=0)).label('S1'),\
           func.sum(case([(shift_type.name.in_([ 'SNET', 's', '2', 'n2', '1n']),1)], else_=0)).label('S2'))\
            .join(shift_type,shift_type.id==shift.type_id).filter(shift.date.between(tmtbl[0].date_from,tmtbl[0].date_to)).join(user2timetable,user2timetable.id==shift.user_id)\
            .join(user_request,user_request.emp_id==user2timetable.user_id,isouter=True).filter(and_(user_request.title.not_in(['Home Office','Overtime']),\
            user_request.number>0,or_(user_request.dateFrom.between(shift.date,shift.date),user_request.dateTo.between(shift.date,shift.date),\
            and_(user_request.dateFrom<=shift.date,user_request.dateTo>=shift.date)))).group_by(shift.date).all())
        socket_.sleep(0)
        AllRequest = readTimetable.JSON_off_FN(\
            db.session.query(shift.date,func.sum(case({ "SNET": 1, "s": 1, "1": 1, "1n": 1, "n2": 1},value=shift_type.name, else_=0)).label('S1'),\
            func.sum(case([(shift_type.name.in_(['SNET', 's', '2', 'n2', '1n']),1)], else_=0)).label('S2'))\
            .join(shift_type,shift_type.id==shift.type_id).filter(shift.date.between(tmtbl[0].date_from,tmtbl[0].date_to)).group_by(shift.date).all()) 
        return readTimetable.Calculate_sum_FN(AllRequest,withRequests)

    def JSON_off_FN(data):
        arr_dat=[]
        for rec in data:
            recobj={
                'date':rec.date.strftime('%Y-%m-%d'),
                'S1' : rec.S1,
                'S2' : rec.S2
                }
            arr_dat.append(recobj)
        return arr_dat
    # List of persons with posibility of duplicate error => exist in same time i more than one timetable and person exist in timetable
    def Get_Duplicates_pers_by_Timetable(id_timetable):
        tmtbl=readTimetable.TimetableByHrnestID(id_timetable) 
        return db.session.query(user2timetable.user_id,func.count(user2timetable.timetable_id).label('Cnt'),func.group_concat(user2timetable.timetable_id).label('Tmtbl')).\
            join(timetable,timetable.id==user2timetable.timetable_id).\
            filter(or_(timetable.date_from.between(tmtbl[0].date_from,tmtbl[0].date_to),timetable.date_to.between(tmtbl[0].date_from,tmtbl[0].date_to))).\
            group_by(user2timetable.user_id).having(and_(func.count(user2timetable.timetable_id)>1,func.group_concat(timetable.hrnest_id).ilike('%' + str(id_timetable) + '%'))).all()
    def Get_Duplicates_pers_by_Draft(id_draft):
        tmtbl=readTimetable.TimetableByID(id_draft)
        return db.session.query(user2timetable.user_id,func.count(user2timetable.timetable_id).label('Cnt'),func.group_concat(user2timetable.timetable_id).label('Tmtbl')).\
            join(timetable,timetable.id==user2timetable.timetable_id).\
            filter(or_(timetable.date_from.between(tmtbl[0].date_from,tmtbl[0].date_to),timetable.date_to.between(tmtbl[0].date_from,tmtbl[0].date_to))).\
            group_by(user2timetable.user_id).having(and_(func.count(user2timetable.timetable_id)>1,func.group_concat(timetable.id).ilike('%' + str(id_draft) + '%'))).all()
    # List of persons with posibility of duplicate error => exist in same time i more than one timetable
    def Get_Duplicates_pers_listInRange_of_Timetable(id_timetable):
        tmtbl=readTimetable.TimetableByHrnestID(id_timetable) 
        allTimetables=readTimetable.parse_Timetable_to_JSON(readTimetable.TimetableByRangeDates(tmtbl[0].date_from,tmtbl[0].date_to),False)
        potentially_duplicated = db.session.query(user2timetable.user_id,func.count(user2timetable.timetable_id).label('Cnt'),func.group_concat(user2timetable.timetable_id).label('Tmtbl')).\
            join(timetable,timetable.id==user2timetable.timetable_id).\
            filter(or_(timetable.date_from.between(tmtbl[0].date_from,tmtbl[0].date_to),timetable.date_to.between(tmtbl[0].date_from,tmtbl[0].date_to))).\
            group_by(user2timetable.user_id).having(func.count(user2timetable.timetable_id)>1).all()
        return readTimetable.Check_potentially_duplicated_persons(allTimetables,potentially_duplicated)
    def Get_Duplicates_pers_listInRange_of_Draft(id_draft):
        tmtbl=readTimetable.TimetableByID(id_draft)
        allTimetables=readTimetable.parse_Timetable_to_JSON(readTimetable.TimetableByRangeDates(tmtbl[0].date_from,tmtbl[0].date_to),False)
        potentially_duplicated = db.session.query(user2timetable.user_id,func.count(user2timetable.timetable_id).label('Cnt'),func.group_concat(user2timetable.timetable_id).label('Tmtbl')).\
            join(timetable,timetable.id==user2timetable.timetable_id).\
            filter(or_(timetable.date_from.between(tmtbl[0].date_from,tmtbl[0].date_to),timetable.date_to.between(tmtbl[0].date_from,tmtbl[0].date_to))).\
            group_by(user2timetable.user_id).having(func.count(user2timetable.timetable_id)>1).all()
        return readTimetable.Check_potentially_duplicated_persons(allTimetables,potentially_duplicated)
    def Check_potentially_duplicated_persons(allTimetables,potentially_duplicated): 
        returned=[]
        for item in potentially_duplicated:
            tmp_arr=[]
            duplicated=False
            tmp_dupl=[]            
            for it in item['Tmtbl'].split(','):                
                tmp=[item for item in allTimetables if item.get('id')==int(float(it))]
                if len(tmp)>0:
                    tmp_arr.append(tmp[0])  
           
            for it in tmp_arr:
               
                tmp=[item for item in tmp_arr if (it['date_from']>=item.get('date_from') and it['date_from']<=item.get('date_to')) or (it['date_to']>=item.get('date_from') and it['date_to']<=item.get('date_to'))]
                if len(tmp)>1:
                    duplicated=True
                    tmp_dupl.append(it['id'])
            if duplicated:  
                recobj={
                    'user_id':item.user_id,               
                    'Cnt' : len(tmp_dupl),
                    'Tmtbl' : tmp_dupl                
                }                
                returned.append(recobj)
        return returned
    def JSON_off_Duplicates_pers(data):
        arr_dat=[]        
        for rec in data:
            if type(rec) is dict:
                tmo=readUser.parse_ONE_user_to_Object(readUser.User_Id_simple('id',str(rec['user_id'])))
                socket_.sleep(0)
                recobj={
                'user_id':rec['user_id'],
                'name' : tmo['last_name'] + ' ' + tmo['first_name'],
                'Cnt' : rec['Cnt'],
                'Tmtbl' : rec['Tmtbl'],
                'User_record' : tmo
                }
                arr_dat.append(recobj)
            else :          
                tmo=readUser.parse_ONE_user_to_Object(readUser.User_Id_simple('id',str(rec.user_id)))
                socket_.sleep(0)
                recobj={
                    'user_id':rec.user_id,
                    'name' : tmo['last_name'] + ' ' + tmo['first_name'],
                    'Cnt' : rec.Cnt,
                    'Tmtbl' : rec.Tmtbl.split(','),
                    'User_record' : tmo
                }
                arr_dat.append(recobj)
            socket_.sleep(0)
        
        return sorted(arr_dat,key=lambda x : x['name'],reverse=False)
class writeTimetable():
    #Erase records from shift table (not in range of timetable)
    def Erase_rec_Not_in_Range(Timetable_id,date_from,date_to):
      try:
        print('Checking Modified Datatable Timetable')
        quer=db.session.query(shift).select_from(user2timetable).filter(user2timetable.timetable_id==Timetable_id)\
            .join(shift,shift.user_id==user2timetable.id,isouter=True)\
            .filter(not shift.date.between(date_from,date_to)).all()
        db.session.delete(quer)
        db.session.commit()
        socket_.sleep(0)
        db.session.remove()
      except Exception as e:
            print(str(e))               
            return "Erase_rec_Not_in_Range"+str(e)
    #Modify records in timetable
    def modify(recLst,JSON):
        try:
            if JSON:
                recL=json.loads(recLst)
            else:
                recL=recLst  
            for tmr in recL:
                print(tmr['id'])
                tmp=timetable.query.filter(timetable.id==tmr['id']).all()
                if len(tmp)>0:
                    for recx in tmp:                        
                        date_from= datetime.strptime(tmr['date_from'],'%Y-%m-%d')
                        date_to= datetime.strptime(tmr['date_to'],'%Y-%m-%d')
                        rangedate=False
                        recx.hrnest_id=tmr['hrnest_id']
                        print(tmr['title'])
                        recx.title=tmr['title']
                        if recx.date_from  != date_from:
                            rangedate=True
                        recx.date_from  = date_from
                        if recx.date_to!= date_to:
                            rangedate=True
                        recx.date_to= date_to                           
                        db.session.commit()                        
                        socket_.sleep(0)
                        if rangedate:
                            #range date has modified delete records from shift tables
                            writeTimetable.Erase_rec_Not_in_Range(int(tmr['id']),datetime.datetime.strptime(tmr['date_from'],'%Y-%m-%d'),datetime.datetime.strptime(tmr['date_to'],'%Y-%m-%d'))
                            socket_.sleep(0)
                socket_.sleep(0)
            db.session.remove()    
        except Exception as e:    
            return 'Error in rows Modify ' + str(e)
        return 'Done'
    def erase(recLst,JSON):       
        try:
            if JSON:
                record=json.loads(recLst)
            else:
                record=recLst
           
            for tmr in record:
                tmp=timetable.query.filter(timetable.id==tmr['id']).all()
                for tm in tmp:
                   db.session.delete(tm)
                   socket_.sleep(0)
                db.session.commit()
                socket_.sleep(0)
                #commit session => update cascade erase all linked records from another tables
            db.session.remove()     
        except Exception as e:
            return "Error in rows Erase " + str(e)
        return 'Done'
    def add(recLst,JSON):
        #try:
            if JSON:
                record=json.loads(recLst)
            else:
                record=recLst
            for tmr in record:
                date_to=datetime.strptime(tmr['date_to'],'%Y-%m-%d')
                date_from=datetime.strptime(tmr['date_from'],'%Y-%m-%d')                
                p=timetable(hrnest_id=tmr['hrnest_id'], title=tmr['title'], time_offset=0,date_from  = date_from,date_to=date_to)
                db.session.add(p)
                socket_.sleep(0)
            db.session.commit()            
            socket_.sleep(0)
            db.session.remove()
        #except Exception as e:
            #return "Error in rows Modify " + str(e)
            return 'Done'
    def addDraft(recLst,JSON):
        try:
            if JSON:
                record=json.loads(recLst)
            else:
                record=recLst
            for tmr in record:
                date_to=datetime.strptime('1979-01-01','%Y-%m-%d') + timedelta(days=int(tmr['weeks'])*7 -1 )
                date_from=datetime.strptime('1979-01-01','%Y-%m-%d')                 
                p=timetable(title=tmr['title'],date_from = date_from,date_to=date_to)
                db.session.add(p)
                db.session.commit()
                socket_.sleep(0)
                db.session.remove()
                tmp={'Need_Confirm':True,
                        'Erased': [],
                        'Modified' : [],
                        'Added' : record}
                socket_.emit('checkTimetable_List',{'data':tmp},broadcast=True)
                socket_.sleep(0)
        except Exception as e:
            return "Error in rows Modify " + str(e)
        
        return 'Done'

