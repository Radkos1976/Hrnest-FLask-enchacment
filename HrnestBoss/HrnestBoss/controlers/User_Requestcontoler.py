# coding=utf-8

from HrnestBoss import socket_
from HrnestBoss.DbModel.models import user_request,users,user2timetable,shift,timetable

from HrnestBoss import app,db
from sqlalchemy.orm import Session
from sqlalchemy import or_,and_,func,update
import datetime
from datetime import datetime,timedelta
import json

class read_UserRequest():
    #Get All existing requests
    def ReadALL():
            return db.session.query(user_request).all()
    #Get request in range
    def ReadInRange(str_from,str_to) :
        d_from=datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))
        return db.session.query(user_request)\
        .filter(or_(user_request.dateFrom.between(d_from,d_to),user_request.dateTo.between(d_from,d_to),\
            and_(user_request.dateFrom<=d_from,user_request.dateTo>=d_to)))\
        .all()
    #read enumerable and not fromWWW requests in time range by uid 
    def ReadEnumerableInRangeUID(str_from,str_to,uid) :        
        d_from=datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))     
        return db.session.query(user_request)\
        .filter(and_(user_request.userId==uid,user_request.typeId>=10000,\
            or_(user_request.dateFrom.between(d_from,d_to),user_request.dateTo.between(d_from,d_to),\
                and_(user_request.dateFrom<=d_from,user_request.dateTo>=d_to))))\
        .all()
    #read enumerable and not fromWWW requests in time range by int id 
    def ReadEnumerableInRangeID(str_from,str_to,id) :        
        d_from=datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))     
        return db.session.query(user_request)\
        .filter(and_(user_request.emp_id==id,user_request.typeId>=10000,\
            or_(user_request.dateFrom.between(d_from,d_to),user_request.dateTo.between(d_from,d_to),\
                and_(user_request.dateFrom<=d_from,user_request.dateTo>=d_to))))\
        .all()
    #read All requests not from WWW requests in time range by uid 
    def ReadEnumerableAndNotWWWInRangeUID(str_from,str_to,uid) :        
        d_from=datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))     
        return db.session.query(user_request)\
        .filter(and_(user_request.userId==uid,or_(user_request.typeId>=10000,user_request.number<0),\
            or_(user_request.dateFrom.between(d_from,d_to),user_request.dateTo.between(d_from,d_to),\
                and_(user_request.dateFrom<=d_from,user_request.dateTo>=d_to))))\
        .all()
    #read All requests not from WWW requests in time range by id 
    def ReadEnumerableAndNotWWWInRangeID(str_from,str_to,id) :        
        d_from=datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))     
        return db.session.query(user_request)\
        .filter(and_(user_request.emp_id==id,or_(user_request.typeId>=10000,user_request.number<0),\
            or_(user_request.dateFrom.between(d_from,d_to),user_request.dateTo.between(d_from,d_to),\
                and_(user_request.dateFrom<=d_from,user_request.dateTo>=d_to))))\
        .all()
    #read enumerable and not fromWWW requests in time range
    def ReadEnumerableInRange(str_from,str_to) :        
        d_from=datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))     
        return db.session.query(user_request)\
        .filter(and_(user_request.typeId>=10000,\
            or_(user_request.dateFrom.between(d_from,d_to),user_request.dateTo.between(d_from,d_to),\
                and_(user_request.dateFrom<=d_from,user_request.dateTo>=d_to))))\
        .all()
    #read requests from WWW in time range by uid and not enumerable
    def ReadInRangeUID(str_from,str_to,uid) :        
        d_from=datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))     
        return db.session.query(user_request)\
        .filter(and_(user_request.userId==uid,user_request.typeId<10000,\
            or_(user_request.dateFrom.between(d_from,d_to),user_request.dateTo.between(d_from,d_to),\
                and_(user_request.dateFrom<=d_from,user_request.dateTo>=d_to))))\
        .all()
    #read requests from WWW in time range by id and not enumerable
    def ReadInRangeID(str_from,str_to,id) :        
        d_from=datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))     
        return db.session.query(user_request)\
        .filter(and_(user_request.emp_id==id,user_request.typeId<10000,\
            or_(user_request.dateFrom.between(d_from,d_to),user_request.dateTo.between(d_from,d_to),\
                and_(user_request.dateFrom<=d_from,user_request.dateTo>=d_to))))\
        .all()
    #read request by TimetableID
    def ReadInTimetableID(str_from,str_to,Timetable_id) :
        d_from=datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10])) 
        tmtble=Timetable_id.split(',') if type(Timetable_id) is str else [Timetable_id]
        return db.session.query(user_request).select_from(user2timetable).filter(user2timetable.timetable_id.in_(tmtble))\
        .join(user_request,user_request.emp_id==user2timetable.user_id).filter(or_(user_request.dateFrom.between(d_from,d_to),user_request.dateTo.between(d_from,d_to),\
                and_(user_request.dateFrom<=d_from,user_request.dateTo>=d_to)))\
        .all()
    #read requests from WWW in time range and not enumerable
    def ReadInRangeWWW(str_from,str_to) :        
        d_from=datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))     
        return db.session.query(user_request)\
        .filter(and_(user_request.typeId<10000,\
            or_(user_request.dateFrom.between(d_from,d_to),user_request.dateTo.between(d_from,d_to),\
                and_(user_request.dateFrom<=d_from,user_request.dateTo>=d_to))))\
        .all()
    #read enumerable and not in WWW requests in time range and users who exists in timetable 
    def ReadEnumerableInRangeByTimetable(str_from,str_to,timetableID):
        d_from=datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))
        tmtble=timetableID.split(',') if type(timetableID) is str else [timetableID]
        return db.session.query(user_request).select_from(user2timetable).filter(user2timetable.timetable_id.in_(tmtble))\
        .join(user_request,user_request.emp_id==user2timetable.user_id).filter(and_(or_(user_request.dateFrom.between(d_from,d_to),user_request.dateTo.between(d_from,d_to),\
                and_(user_request.dateFrom<=d_from,user_request.dateTo>=d_to)), user_request.typeId >= 10000))\
        .all()
    #read All request in time range by uid 
    def ReadInAllUID(str_from,str_to,uid) :        
        d_from=datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))     
        return db.session.query(user_request)\
        .filter(and_(user_request.userId==uid,\
            or_(user_request.dateFrom.between(d_from,d_to),user_request.dateTo.between(d_from,d_to),\
                and_(user_request.dateFrom<=d_from,user_request.dateTo>=d_to))))\
        .all()
    #read All request in time range by id 
    def ReadInAllID(str_from,str_to,id) :        
        d_from=datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))     
        return db.session.query(user_request)\
        .filter(and_(user_request.emp_id==id,\
            or_(user_request.dateFrom.between(d_from,d_to),user_request.dateTo.between(d_from,d_to),\
                and_(user_request.dateFrom<=d_from,user_request.dateTo>=d_to))))\
        .all()
    def Parse_rquest_to_JSON(records):
        arr_data=[]  
        recordobj =''
        try:
            for rec in records:
                recordobj ={
                'number' : rec.number,
                'status' :rec.status ,
                'userId':rec.userId ,
                'typeId' :rec.typeId ,
                'isWholeDay' :rec.isWholeDay ,
                'dateFrom':rec.dateFrom ,
                'dateTo':rec.dateTo ,
                'title':rec.title,
                'emp_id':rec.emp_id
                    }                
                arr_data.append(recordobj)
        except Exception as e:
                print('Parse JSON' + str(e))               
                return "Error in parse_User_to_JSON "+str(e)
        return arr_data
class write__UserRequest():
    license = 0
    Main_index = []
    #Update Field Emp_id by datafrom Users table and erase not used requests
    def update_Emp_idByUID(scanAll=True):
      try:        
        if scanAll:
            val=db.session.query(user_request,users).filter(and_(user_request.emp_id!=users.id, user_request.userId==users.uid )).all()
        else:
            val=db.session.query(user_request,users).filter(and_(user_request.emp_id==None, user_request.userId==users.uid )).all()
        socket_.sleep(0)
        if len(val)>0:
            for itm in val:               
                itm.user_request.emp_id=itm.users.id                
            db.session.commit()            
            socket_.sleep(0)
        #delete unused requests
        tmp=user_request.query.filter(user_request.dateFrom>user_request.dateTo).all()
        socket_.sleep(0)
        for tm in tmp:
              db.session.delete(tm)
              socket_.sleep(0)
        db.session.commit()
        db.session.remove()
        socket_.sleep(0)
      except Exception as e:
            print(str(e))
            return "Error in rows update_Emp_idByUID" + str(e)
    # Modyify request in db
    def DelRequest(Request_users_rec,JSON,only_enumerable=False):
        try:
            if JSON:
                record=json.loads(Request_users_rec)
            else:
                record=Request_users_rec            
            for tmr in record:
                #check deletion target if only enumerable flag is on
                if (only_enumerable and int(tmr['number'])<0) or not only_enumerable:
                    tmp=user_request.query.filter(user_request.number==int(tmr['number'])).all()
                    socket_.sleep(0)
                    for tm in tmp:
                        db.session.delete(tm) 
                        socket_.sleep(0)
            db.session.commit()     
            db.session.remove()
            socket_.sleep(0)
        except Exception as e:
            print(str(e))
            return "Error in rows Erase user_request" + str(e)
        return 'Done'
    def ModifyRequest(Request_users_rec,JSON,only_enumerable=False): 
      try:
        rows=0
        errrows=0
        rwexist=0
        query_param=''
        if JSON:
            user=json.loads(Request_users_rec)
        else:
            user=Request_users_rec       
        try:
            for uer in user:
              if (only_enumerable and int(uer['number'])<0) or not only_enumerable:
                chk=user_request.query.filter(user_request.number==int(uer['number'])).all()
                socket_.sleep(0)
                if len(chk)>0:
                     for rec in chk:
                         try:
                          date_from= datetime.strptime(uer['dateFrom'],'%Y-%m-%d')
                          date_to= datetime.strptime(uer['dateTo'],'%Y-%m-%d')
                            # if date_from>date_to erase request
                          if date_from>date_to:
                              tmp=user_request.query.filter(user_request.number==int(uer['number'])).all()
                              socket_.sleep(0)
                              for tm in tmp:
                                db.session.delete(tm)  
                                socket_.sleep(0)
                          else:
                            # add optional fields to db model
                            if 'status' in uer:
                                rec.status=uer['status']
                            if 'userId' in uer:
                                rec.userId=str(uer['userId'])
                            if 'typeId' in uer:
                                rec.typeId=int(uer['typeId'])                           
                            if 'isWholeDay' in uer:
                                rec.isWholeDay=bool(uer['isWholeDay'])
                            if 'dateFrom' in uer:                                
                                rec.dateFrom=date_from
                            if 'dateTo' in uer:     
                                rec.dateTo=date_to
                            if 'title' in uer:
                                rec.title=uer['title']                            
                            rows=rows+1                    
                         except Exception as e:
                            print(str(e)) 
                            errrows=errrows+1
                     db.session.commit()
                     db.session.remove()
                     socket_.sleep(0)
                else : rwexist=rwexist+1             
        except Exception as e:
            print(str(e))               
            return "Error in rows Modify in user_request" +str(e)
        return "Rows_Modify in user_request:"+ str(rows) + "   Not_Modified_rows(dont exist) :"+ str(rwexist) + "   Errors :"+ str(errrows)
      except Exception as e:
            print(str(e))
            return "Error in rows Modify in user_request function jsonify" + str(e)
    def AddRequest(Request_users_rec,JSON,only_enumerable=False): 
        rows=0
        errrows=0
        rwexist=0
        if JSON:
            user=json.loads(Request_users_rec)
        else:
            user=Request_users_rec               
        for uer in user:
            try:             
                   
                if uer['typeId']!=None:
                    try:                        
                        chk=user_request.query.filter(user_request.number==int(uer['number'])).all()                           
                        if len(chk)==0:
                            # add optional fields to db model
                            date_from= datetime.strptime(uer['dateFrom'],'%Y-%m-%d')                              
                            date_to= datetime.strptime(uer['dateTo'],'%Y-%m-%d')                              
                            p=user_request(number=int(uer['number']),status=uer['status'],userId=str(uer['userId']),typeId=int(uer['typeId']),isWholeDay=bool(uer['isWholeDay']),dateFrom=date_from,dateTo=date_to,title=uer['title'])
                            db.session.add(p)                            
                            rows=rows+1
                        else : rwexist=rwexist+1
                    except Exception as e:
                        print("Error in saving NEW data aa " +  str(e))
                        errrows=errrows+1               
            except Exception as e:
                print("Error in saving NEW data " +  str(e))
                return "Error in saving NEW data " + str(e)            
        db.session.commit()
        db.session.remove()
        socket_.sleep(0)
        return "Rows_Add :"+ str(rows)+ "   Errors :"+ str(errrows)
    #Enumerable request Add
    def Add_Enumerable_request(Request_users_rec,JSON):
      try:
        tmp_add=[]
        arr_ind=[]       
        rec=[]
        if JSON:
            rec=json.loads(Request_users_rec)
        else:
            rec=Request_users_rec         
        for uer in rec:
            chkAdd=True
            tmp_s=write__UserRequest.check_modify_request(uer['dateFrom'],uer['dateTo'],uer['typeId'],uer['emp_id'])
            socket_.sleep(0)
            #print(tmp_s)
            if tmp_s!={'No recordset to add/modify'}:                
                if tmp_s['Duplicate'] or uer['typeId']==0:
                     chkAdd=False              
            else:
                if uer['typeId']==0:
                    chkAdd=False
            if chkAdd:
                tmp_add.append(uer)        
        # get newly created indexed ids
        if len(tmp_add)>0:
            arr_ind=[]
            while len(tmp_add)>len(arr_ind):
                arr_ind=write__UserRequest.get_lower_free_IND(len(tmp_add))
                socket_.sleep(0)
                if len(tmp_add)>len(arr_ind):
                    write__UserRequest.erase_fromMain_index(arr_ind)
                    socket_.sleep(0)
            socket_.sleep(0)
        # modify sended records by index (number field) atribute
            counter=0
            for item in tmp_add:
                item['number']=arr_ind[counter]
                counter=counter+1        
            print('Enumerable Request Addet :' + write__UserRequest.AddRequest(tmp_add,False))        
            write__UserRequest.erase_fromMain_index(arr_ind)
            socket_.sleep(0)
        write__UserRequest.update_Emp_idByUID(False)
        socket_.sleep(0)
        return 'Done'
      except Exception as e:
            print(str(e))
            return "Error in rows Add_Enumerable_request " + str(e)
    #Enumerable request Mod
    def Mod_Enumerable_request(Request_users_rec,JSON):
      try:
        tmp_s=[]
        tmp_mod=[]
        rec=[]
        if JSON:
            rec=json.loads(Request_users_rec)
        else:
            rec=Request_users_rec       
        for uer in rec:
            chkAdd=True
            tmp_s=write__UserRequest.check_modify_request(uer['dateFrom'],uer['dateTo'],uer['typeId'],uer['emp_id']) 
            socket_.sleep(0)
            if tmp_s!={'No recordset to add/modify'}:                
                if tmp_s['Duplicate'] or uer['typeId']==0:
                     chkAdd=False              
            else:
                if uer['typeId']==0:
                    chkAdd=False 
            if chkAdd:
                tmp_add.append(tmp_mod)
        if len(tmp_mod)>0:
            print('Enumerable Request Modified :' + write__UserRequest.ModifyRequest(tmp_mod,True))
        
        return 'Done'   
      except Exception as e:
            print(str(e))
            return "Error in rows Mod_Enumerable_request " + str(e)
    #Helper methods for enumerable req
    #Check existence of another enumerable request in date range by user id
    def check_modify_request(dFrom,dTo,typeId,emp_id):
      try:
        arr_add=[]
        arr_mod=[]
        duplicate=False
        #print('Try Find another records in date range => ID ' + str(emp_id) )        
        tmp_rec=read_UserRequest.ReadEnumerableInRangeID(dFrom,dTo,emp_id)
        if len(tmp_rec)>0:
            #print('Some records for selected user id are finded in date range ')
            d_from=datetime(int(dFrom[0:4]),int(dFrom[5:7]),int(dFrom[8:10]))
            d_to=datetime(int(dTo[0:4]),int(dTo[5:7]),int(dTo[8:10])) 
            for rc in tmp_rec:
                if d_from==rc.dateFrom and d_to==rc.dateTo and typeId==rc.typeId:
                    duplicate=True
                #modify and add request
                if d_from>=rc.dateFrom and d_to<=rc.dateTo:
                    #print('Modify One Request and add another')
                    #first modify
                    recordobj={
                        'number' : rc.number ,
                        'status' :rc.status ,
                        'userId':rc.userId ,
                        'typeId' :rc.typeId ,
                        'isWholeDay' :rc.isWholeDay ,
                        'dateFrom':rc.dateFrom.strftime('%Y-%m-%d') ,
                        'dateTo':(d_from - timedelta(days=1)).strftime('%Y-%m-%d') ,
                        'title':rc.title,
                        'emp_id':rc.emp_id
                    }
                    arr_mod.append(recordobj)
                    #Add rest of request
                    recordobj={                        
                        'status' :rc.status ,
                        'userId':rc.userId ,
                        'typeId' :rc.typeId ,
                        'isWholeDay' :rc.isWholeDay ,
                        'dateFrom':(d_to + timedelta(days=1)).strftime('%Y-%m-%d'),
                        'dateTo': rc.dateTo.strftime('%Y-%m-%d'),
                        'title':rc.title,
                        'emp_id':rc.emp_id
                    }
                    arr_add.append(recordobj)
                #modify request
                elif d_from>=rc.dateFrom and d_to>rc.dateTo:
                    #print('Modify date_to range')
                    recordobj={
                        'number' : rc.number ,
                        'status' :rc.status ,
                        'userId':rc.userId ,
                        'typeId' :rc.typeId ,
                        'isWholeDay' :rc.isWholeDay ,
                        'dateFrom':rc.dateFrom.strftime('%Y-%m-%d') ,
                        'dateTo':(d_from - timedelta(days=1)).strftime('%Y-%m-%d') ,
                        'title':rc.title,
                        'emp_id':rc.emp_id
                    }
                    arr_mod.append(recordobj)
                elif d_from<rc.dateFrom and d_to<=rc.dateTo:
                    #print('Modify Date_from range')
                    recordobj={
                        'number' : rc.number ,
                        'status' :rc.status ,
                        'userId':rc.userId ,
                        'typeId' :rc.typeId ,
                        'isWholeDay' :rc.isWholeDay ,
                        'dateFrom':(d_to + timedelta(days=1)).strftime('%Y-%m-%d'),
                        'dateTo':rc.dateTo.strftime('%Y-%m-%d') ,
                        'title':rc.title,
                        'emp_id':rc.emp_id
                    }
                    arr_mod.append(recordobj) 
                else:
                    #print('Switch dates')
                    recordobj={
                        'number' : rc.number ,
                        'status' :rc.status ,
                        'userId':rc.userId ,
                        'typeId' :rc.typeId ,
                        'isWholeDay' :rc.isWholeDay ,
                        'dateFrom':rc.dateTo.strftime('%Y-%m-%d'),
                        'dateTo':rc.dateFrom.strftime('%Y-%m-%d') ,
                        'title':rc.title,
                        'emp_id':rc.emp_id
                    }
                    arr_mod.append(recordobj)             
            if len(arr_add)>0:
                arr_ind=[]
                while len(arr_add)>len(arr_ind):
                    arr_ind=write__UserRequest.get_lower_free_IND(len(tmp_rec))
                    socket_.sleep(0)
                    if len(arr_add)>len(arr_ind):
                        write__UserRequest.erase_fromMain_index(arr_ind)
                        socket_.sleep(0)
                counter=0
                for item in arr_add:
                    item['number']=arr_ind[counter]
                    counter=counter+1            
                print('Enumerable Request Addet :' + write__UserRequest.AddRequest(arr_add,False))
                write__UserRequest.erase_fromMain_index(arr_ind)
                socket_.sleep(0)
            if len(arr_mod)>0:
                print('Enumerable Request Modified :' + write__UserRequest.ModifyRequest(arr_mod,False))
            
            return {'Done':True,'Duplicate':duplicate}
        else:
            return {"No recordset to add/modify"}
      except Exception as e:
            print(str(e))
            return "Error in rows check_modify_request " + str(e)
    #get list of free counter index in user request table 
    def get_lower_free_IND(len_array): 
      try:
        val=db.session.query(func.round(user_request.number/10).label('typ'),func.count(func.round(user_request.number/10)).label('cnt') )\
            .filter(user_request.number<-9).group_by(func.round(user_request.number/10)).order_by(user_request.number.desc()).all()
        socket_.sleep(0)
        #print(val)
        arr_ind=[]
        curr_item=1
        last_counter_grp=0
        brk=False
        if len(val)==0:
            for intcnt in range(int((len_array+9)*-1)-15,-9):
                if not intcnt in write__UserRequest.Main_index:
                    write__UserRequest.Main_index.append(intcnt)
                    arr_ind.append(intcnt)                    
        else:            
            if int(val[0]['typ'])!=-1:
                first_elem=int(val[0]['typ']*10+1)
                if first_elem+9<len_array*-1:
                    #print('Dont know')
                    first_elem=len_array*-1
                    brk=True
                for intcnt in range(first_elem,-9):
                    if not intcnt in write__UserRequest.Main_index:
                        write__UserRequest.Main_index.append(intcnt)
                        arr_ind.append(intcnt)                        
                        curr_item=curr_item+1
                    last_counter_grp=round(intcnt/10,0)
            for itm in val:
                #print(str(last_counter_grp) + ' => Counter => ' + str(itm['typ']))
                if last_counter_grp>itm['typ'] +1:
                    #print('All group empty')
                    #All group is empty
                    first_elem=int((last_counter_grp-1)*10)                 
                    last_elem=int((itm['typ'])*10)+1                   
                    if first_elem-last_elem>len_array-curr_item:
                        last_elem=first_elem-(len_array-curr_item)
                    #print('First: ' + str(last_elem) + '  Last: ' + str(first_elem))
                    for intcnt in range(last_elem,first_elem+1):
                        if not intcnt in write__UserRequest.Main_index:
                            write__UserRequest.Main_index.append(intcnt)
                            arr_ind.append(intcnt)                            
                            curr_item=curr_item+1
                            if curr_item>len_array:
                                    brk=True
                        last_counter_grp=round(intcnt/10,0)
                # Check if index in range not full
                if brk:
                     break
                if itm.cnt!=10:
                    # find free counter index
                    tmp_quer=user_request.query.filter(func.round(user_request.number/10)==itm.typ).order_by(user_request.number.desc()).all()
                    #print(tmp_quer)
                    if len(tmp_quer)>0:                        
                        counter=0
                        previous=int(itm['typ']*10)
                        if int(tmp_quer[0].number)<previous:
                            #Add first element of group
                            if not previous in write__UserRequest.Main_index:
                                write__UserRequest.Main_index.append(previous)
                                arr_ind.append(previous)                                
                                counter=counter+1
                            curr_item=curr_item+1
                        #print('Start checking for empty index in group')
                        for elem in tmp_quer:
                            #print(str(previous) + ' => ' + str(elem.number))
                            if previous>elem.number+1:
                                for ind in range(elem.number+1,previous):
                                    #print('Find Empty Index beetwen indexed records') 
                                    if not ind in write__UserRequest.Main_index:
                                        write__UserRequest.Main_index.append(ind)
                                        arr_ind.append(ind)                                        
                                        counter=counter+1                                    
                                        if curr_item>len_array:
                                            brk=True
                                    curr_item=curr_item+1
                            if brk:
                                break
                            counter=counter+1
                            previous=elem.number
                        if counter!=10:                            
                            tmpfr=int(itm['typ']-1)*10
                            if counter>len_array-curr_item:
                                tmpfr=tmpfr-(len_array-curr_item-1)
                                #print('preCal')                                
                            #print('FromA : ' + str(tmpfr+1) + '  To : ' + str(int(itm['typ'])*10-counter) + ' Counter:' +str(counter))
                            #add rest of elements in group
                            for elem in range(tmpfr+1,int(itm['typ'])*10-counter):
                                if not elem in write__UserRequest.Main_index:
                                    write__UserRequest.Main_index.append(elem)
                                    arr_ind.append(elem)                                    
                                curr_item=curr_item+1
                                if curr_item>len_array:
                                    brk=True
                                if brk:
                                    break
                last_counter_grp=itm['typ']
                if brk:
                    break
            if not brk:
                #print('Add rest of indexed fields in decerasing order')
                first_elem=int((last_counter_grp-1)*10)
                if first_elem>=0:
                    first_elem=first_elem*-1
                last_elem=first_elem-(len_array-curr_item) 
                #print('First: ' + str(last_elem) + '  Last: ' + str(first_elem))
                more=0
                for intcnt in range(last_elem,first_elem+1):
                    if not intcnt in write__UserRequest.Main_index:
                        write__UserRequest.Main_index.append(intcnt)
                        arr_ind.append(intcnt)                        
                    else:
                        more=more+1                   
                while more>1:
                    last_elem=last_elem-1
                    if not last_elem in write__UserRequest.Main_index:
                        write__UserRequest.Main_index.append(last_elem)
                        arr_ind.append(last_elem)
                        more=more-1 
        return arr_ind
      except Exception as e:
            print(str(e))
            return "Error in rows get_lower_free_IND " + str(e)
    def erase_fromMain_index(arr_val):
        for item in arr_val:
            write__UserRequest.Main_index.remove(item)
            socket_.sleep(0)
    
