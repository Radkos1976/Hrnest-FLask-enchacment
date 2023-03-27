# coding=utf-8
from HrnestBoss import app,db
import HrnestBoss.controlers.Migrate as hr2
from HrnestBoss.DbModel.models import shift_type,timetable,users
import HrnestBoss.controlers.Usercontroler as user
import HrnestBoss.controlers.shift_typecontoler as shiftT
import HrnestBoss.controlers.TimeTablecontroler as tmtbl
import HrnestBoss.controlers.User_Requestcontoler as req
import math
import uuid
import json
import datetime
from datetime import datetime,date, timedelta
from HrnestBoss import socket_

def Check_Timetable_Employes(tmetable,Trans,Dfrom,Dto,Check_credentials=True):
  try:
    if tmetable!=None:
        #print(hr2.get_TimetableEmployes(tmetable))
        #Socket Send info about enought credentials for edit a timetable in WWW
        if Check_credentials:  
            accesTimetable = True
            # Dont need we have access via api=> accesTimetable=check_AccessToTimetable(tmetable )
            tmp={'credentials':accesTimetable,'hrnest_id':tmetable,'guid':Trans}
            socket_.emit('AccesToTimetable',{'data':tmp},broadcast=True)
            socket_.sleep(0)
            print('Access to Timetable ' + str(tmetable) + ' by server credentials :' + str(accesTimetable))
        user.writeUserTimetable.Delete_Blank_Record()        
        socket_.sleep(0)
        Range_types=shiftT.Read.Get_Timetable_types()        
        socket_.sleep(0)
        wwwTimetableUSR=sorted(hr2.hrwww.get_timetable_by_API(tmetable),key=lambda x : x['userId'],reverse=False) 
        #print('HrnestID = > ' + str(tmetable) + '<==>' + str(wwwTimetableUSR))
        Timetable_rec=Enumerate_TimetableNew(wwwTimetableUSR,tmetable,Range_types,Dfrom,Dto)
        dbtmp = tmtbl.readTimetable.TimetableByHrnestID(tmetable)
        for item in dbtmp:
            dbTImetable=user.readUser.parse_User_to_JSON(user.readUser.UsersGetALL_Timetable(item.id),'UsersTimetable','nonenum')
            Get_Changes(Timetable_rec,dbTImetable,shiftT.Read.To_JSON(Range_types),item.id,Trans)            
            socket_.sleep(0)
  except Exception as e:
               print('Error in Check_Timetable_Employes :' + str(e))
               print(
                    type(e).__name__,          # TypeError
                    __file__,                  # /tmp/example.py
                    e.__traceback__.tb_lineno  # 2
                )

#Populate Records in USERSTIMETABLE schema style for quick parse data
def Enumerate_TimetableNew(data,timetableID,Range_types,Dfrom,Dto):
  try:
    request_types=shiftT.Read.To_JSON(shiftT.Read.Get_Request_types()) 
    #print('Start')
    timetable_info=tmtbl.readTimetable.TimetableByHrnestID(timetableID)
    
    socket_.sleep(0)
    allPersons=[]    
    counter=0
    sumdiferences=0
    offset=0  
    rec=[]
    present_user=''
    recordobj =''
    Haveoffset=1   
    # if request are not calculated properly calculate twice
    for lp in range(0,Haveoffset):
      #print('Loop nr ' + str(lp) + ' Have offset => ' +str(Haveoffset) + ' Offset Timetable=>' + str(offset))
      for item in data:
       try:
        if present_user!=item['userId']:
                if present_user!='':                                        
                    rec.append(recordobj)                            
                    #New Person
                enum_types_day=Get_enumerable_requests_by_id_TimeRANGE(item['userId'],Dfrom,Dto,request_types)
                #print(enum_types_day)
                recordobj = {                        
                        'uid':item['userId'],
                        'first_name':item['user']['firstName'] ,
                        'last_name': item['user']['lastName'],
                        'full_name': item['user']['lastName'] + ' ' +  item['user']['firstName']
                    }
                arr_shift=[]
                present_user=item['userId']
        tmF=datetime.strptime(item['timeFrom'],'%Y-%m-%dT%H:%M:%S+00:00')
        tmT=datetime.strptime(item['timeTo'],'%Y-%m-%dT%H:%M:%S+00:00')
        dat=tmF.date()
        if dat.strftime('%Y-%m-%d') in enum_types_day:
                emp_typ_time=enum_types_day[dat.strftime('%Y-%m-%d')]
        else :
                emp_typ_time=1 
        if ((int(tmT.hour)+offset) *60 + int(tmT.minute)) - ((int(tmF.hour)+offset) *60 + int(tmF.minute))  > 2:
            valID=Get_closer_Val((int(tmF.hour)+offset) *60 + int(tmF.minute), (int(tmT.hour)+offset) *60 + int(tmT.minute),shiftT.Read.To_JSON(Range_types),emp_typ_time)
            #get average diferences in time => for calculate right offset in hours (cet time when from Poland cet+2)
            if int(valID['timeDif'])<30:
                counter=counter+1        
                sumdiferences=sumdiferences+ int(valID['dif'])
            recordobj[dat.strftime('%Y-%m-%d')]=str(valID['id'])
            #add avaliable information about deiferences beetwen model and real elapsed time
            recordobj[dat.strftime('%Y-%m-%d')+'_emp_err']={"timeDif":valID['timeDif'],"startDif":valID['startDif'],"endDif":valID['endDif']}
            rec.append(recordobj)
        #print(rec)
        socket_.sleep(0) 
       except Exception as e:
                print('Error on parsing data from Hrnest API :' + str(e))     
      if counter>0 and Haveoffset!=1:
            #('Current offset : => ' + str(sumdiferences/counter))
            #Update Offset from timezone in timetable
            if int(sumdiferences/counter)!=0:
              try:
                dbtmp=db.session.query(timetable).filter(timetable.hrnest_id==int(timetableID)).all()
                for item in dbtmp:
                    if item.time_offset!=int(float(sumdiferences/counter)):
                        item.time_offset=int(float(sumdiferences/counter))
                        db.session.commit()
              except Exception as e:
                print('Error on saving data in DB about offset of Timetable :' + str(e))
      if Haveoffset==2 and lp==0:          
          if counter>0:
            offset=int(float(sumdiferences/counter))
          sumdiferences=0 
          counter=0
          rec=[]
          present_user=''
          recordobj =''
    #add request information     
    retrec=[]
    allPersons = hr2.get_TimetableEmployes(timetableID)
    for ite in allPersons:
      try:        
        tmprec={}
        if rec!=['']:
            rx=[item for item in rec if str(item.get('uid'))==str(ite['userId'])]
        else:
            rx=[]
        if not rx:
            tmprec['uid'] = ite['userId']
            tmprec['full_name']=  ite['user']['lastName'] + ite['user']['firstName'] 
        else:
            tmprec=rx[0]
        retrec.append(tmprec)
        socket_.sleep(0)
      except Exception as e:
                print('Error on Adding pesons with no time :' + str(e))
  except Exception as e:
                print('Error in Enumerate_TImetable :' + str(e))
  return retrec

#-------------------------------------------------------------------------------------
# Deprecated
#-------------------------------------------------------------------------------------
#Populate Records in USERSTIMETABLE schema style for quick parse data
def Enumerate_TImetable(data,timetableID,Range_types,Dfrom,Dto):
  try:
    request_types=shiftT.Read.To_JSON(shiftT.Read.Get_Request_types())    
    timetable_info=tmtbl.readTimetable.TimetableByHrnestID(timetableID)
    allPersons=[]
    #save request for debug
    #with open('Datayour_file.txt', 'w') as f:
    #    for item in data:
    #        f.write("%s\n" % item)
    
    #print(allPersons)
    counter=0
    sumdiferences=0
    offset=0  
    rec=[]
    present_user=''
    recordobj =''
    Haveoffset=2
    #Get Timezone offset if exist
    for itm in timetable_info:
       if (itm.time_offset!=None or itm.time_offset!='')  and isinstance(itm.time_offset, int):           
            offset=int(itm.time_offset)
            Haveoffset=1
            allPersons=get_PersonsTimetable_from_www(timetableID)
       #OffSet is None compare first record from API callback
       else:
           allPersons=get_PersonsTimetable_from_www(timetableID,'All')
           if len(data)>0:
              try:
                tmpdat=datetime.strptime(data[0]['timeFrom'],'%Y-%m-%dT%H:%M:%S+00:00')
                tmpwww=[item for item in allPersons if str(item.get('names'))==str(data[0]['user']['lastName'] + ' ' +  data[0]['user']['firstName'])]
                #print(tmpwww[0][tmpdat.strftime('%Y-%m-%d')]['hFrom'] + tmpwww[0]['names'])
                #print(str(tmpdat.hour) + ':' + str(tmpdat.minute) + '  ' + tmpdat.strftime('%Y-%m-%d')+' ' + data[0]['user']['lastName'] + ' ' +  data[0]['user']['firstName'])
                offset=int(int(tmpwww[0][tmpdat.strftime('%Y-%m-%d')]['hFrom'][0:tmpwww[0][tmpdat.strftime('%Y-%m-%d')]['hFrom'].index(':')])-tmpdat.hour)
                dbtmp=db.session.query(timetable).filter(timetable.hrnest_id==int(timetableID)).all()
                for item in dbtmp:
                    if item.time_offset!=offset:
                        item.time_offset=offset
                        db.session.commit()
                Haveoffset=1
              except Exception as e:
                print('Error in try parse offset in timetable :' + str(e))
    # if request are not calculated properly calculate twice
    for lp in range(0,Haveoffset):
      #print('Loop nr ' + str(lp) + ' Have offset => ' +str(Haveoffset) + ' Offset Timetable=>' + str(offset))
      for item in data:
       try:
        if present_user!=item['userId']:
                if present_user!='':                                        
                    rec.append(recordobj)                            
                    #New Person
                enum_types_day=Get_enumerable_requests_by_id_TimeRANGE(item['userId'],Dfrom,Dto,request_types)
                #print(enum_types_day)
                recordobj = {                        
                        'uid':item['userId'],
                        'first_name':item['user']['firstName'] ,
                        'last_name': item['user']['lastName'],
                        'full_name': item['user']['lastName'] + ' ' +  item['user']['firstName']
                    }
                arr_shift=[]
                present_user=item['userId']
        tmF=datetime.strptime(item['timeFrom'],'%Y-%m-%dT%H:%M:%S+00:00')
        tmT=datetime.strptime(item['timeTo'],'%Y-%m-%dT%H:%M:%S+00:00')
        dat=tmF.date()
        if dat.strftime('%Y-%m-%d') in enum_types_day:
                emp_typ_time=enum_types_day[dat.strftime('%Y-%m-%d')]
        else :
                emp_typ_time=1        
        valID=Get_closer_Val((int(tmF.hour)+offset) *60 + tmF.minute,(int(tmT.hour)+offset) *60 + int(tmT.minute),shiftT.Read.To_JSON(Range_types),emp_typ_time)
        #get average diferences in time => for calculate right offset in hours (cet time when from Poland cet+2)
        if int(valID['timeDif'])<30:
            counter=counter+1        
            sumdiferences=sumdiferences+ int(valID['dif'])
        recordobj[dat.strftime('%Y-%m-%d')]=str(valID['id'])
        #add avaliable information about deiferences beetwen model and real elapsed time
        recordobj[dat.strftime('%Y-%m-%d')+'_emp_err']={"timeDif":valID['timeDif'],"startDif":valID['startDif'],"endDif":valID['endDif']}
        rec.append(recordobj)
        #print(rec) 
       except Exception as e:
                print('Error on parsing data from Hrnest API :' + str(e))     
      if counter>0 and Haveoffset!=1:
            #print('Current offset : => ' + str(sumdiferences/counter))
            #Update Offset from timezone in timetable
            if int(sumdiferences/counter)!=0:
              try:
                dbtmp=db.session.query(timetable).filter(timetable.hrnest_id==int(timetableID)).all()
                for item in dbtmp:
                    if item.time_offset!=int(float(sumdiferences/counter)):
                        item.time_offset=int(float(sumdiferences/counter))
                        db.session.commit()
              except Exception as e:
                print('Error on saving data in DB about offset of Timetable :' + str(e))
      if Haveoffset==2 and lp==0:          
          if counter>0:
            offset=int(float(sumdiferences/counter))
          sumdiferences=0 
          counter=0
          rec=[]
          present_user=''
          recordobj =''
    #add request information     
    retrec=[]
    for ite in allPersons:
      try:
        guid=''
        tmprec=''
        if rec!=['']:
            rx=[item for item in rec if str(item.get('full_name'))==str(ite['names'])]
        else:
            rx=[]
        if not rx: 
            #Person dont have timmetable records for range date
            guid=Get_guid_UserID(ite['names'])
            if guid!='':
                tmprec=Get_requests_by_id_inTimeRANGE(guid,Dfrom,Dto,request_types)
                tmprec['full_name']=ite['names']               
            else :
                print(ite['names'] + ' => Dont exist')
        else:
            guid=rx[0]['uid']
            if guid!='':        
                tmprec=rx[0]
                tm=Get_requests_by_id_inTimeRANGE(guid,Dfrom,Dto,request_types)                
                for qwe in tm:
                    tmprec[qwe]=tm[qwe]
                #print(tmprec)
            else :
                print(rx[0]['full_name'] + ' => Dont exist')
        if guid!='':
            retrec.append(tmprec)
      except Exception as e:
                print('Error on Adding pesons with no time :' + str(e))
  except Exception as e:
                print('Error in Enumerate_TImetable :' + str(e))
  return retrec

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)+1):
        yield start_date + timedelta(n)

# Get records for enumerable requests by UID => only for www persons 
def Get_enumerable_requests_by_id_TimeRANGE(uid,tFrom,tTo,request_types):
  try:
    reqDB=req.read_UserRequest.Parse_rquest_to_JSON(req.read_UserRequest.ReadEnumerableInRangeUID(tFrom,tTo,uid))
    tmp={'uid':uid}
    timeFrom=datetime.strptime(tFrom,'%Y-%m-%d')
    timeTo=datetime.strptime(tTo,'%Y-%m-%d')
    for item in reqDB:
        if item['isWholeDay']:
            #One Day request
            if item['dateFrom']==item['dateTo']:                
                tmp[item['dateFrom'].strftime('%Y-%m-%d')]=get_emp_type_fromRequsetTYPe(item['typeId'],request_types)
            else:
                if timeFrom>item['dateFrom']:
                    item['dateFrom']=timeFrom
                if timeTo<item['dateTo']:
                    item['dateTo']=timeTo
                rt=get_emp_type_fromRequsetTYPe(item['typeId'],request_types)
                for tm in daterange(item['dateFrom'],item['dateTo']):
                    if tm>=timeFrom and tm<=timeTo:
                        tmp[tm.strftime("%Y-%m-%d")]=rt
    socket_.sleep(0)
  except Exception as e:
                print('Error in Get_enumerable_requests_by_id_TimeRANGE :' + str(e))
  return tmp

# create records for not enumerable requests
def Get_requests_by_id_inTimeRANGE(uid,tFrom,tTo,request_types):
   try:
    reqDB=req.read_UserRequest.Parse_rquest_to_JSON(req.read_UserRequest.ReadInRangeUID(tFrom,tTo,uid))
    tmp={'uid':uid}
    timeFrom=datetime.strptime(tFrom,'%Y-%m-%d')
    timeTo=datetime.strptime(tTo,'%Y-%m-%d')
    for item in reqDB:
        if item['isWholeDay']:
            #One Day request
            if item['dateFrom']==item['dateTo']:
                tmpRequestype=get_DBType_fromRequsetTYPe(item['typeId'],request_types,True)
                if tmpRequestype!='':                    
                    tmp[item['dateFrom'].strftime('%Y-%m-%d')]=tmpRequestype
            else:
                rt=get_DBType_fromRequsetTYPe(item['typeId'],request_types,True)                
                if rt!='':
                  for tm in daterange(item['dateFrom'],item['dateTo']):
                    if tm>=timeFrom and tm<=timeTo:
                        tmp[tm.strftime("%Y-%m-%d")]=rt
        socket_.sleep(0)
   except Exception as e:
                print('Error in Get_requests_by_id_inTimeRANGE :' + str(e))
   return tmp

def get_emp_type_fromRequsetTYPe(value,request_types):
  try:
    tmp=[item for item in request_types if item.get('req_type_id')==value]
    if tmp:
        return tmp[0]['emp_type']
    else:
        return 1
  except Exception as e:
                print('Error in get_emp_type_fromRequsetTYPe :' + str(e))

def get_DBType_fromRequsetTYPe(value,request_types,none_empty=False):
  try:
    #none_empty if true checking name field if None then return blank value
    tmp=[item for item in request_types if item.get('req_type_id')==value]
    if tmp:
        if none_empty:
            if tmp[0]['name']!=None:
                return tmp[0]['id']
            else:
                return ''
        else:
            return tmp[0]['id']
    else:
        return 1
  except Exception as e:
                print('Error in get_DBType_fromRequsetTYPe :' + str(e))

def get_externalName_fromID(value,request_types):
  try:
    tmp=[item for item in request_types if item.get('id')==value]
    if tmp:
        return tmp[0]['name']
    else:
        return ' '
  except Exception as e:
                print('Error in get_externalName_fromID :' + str(e))

def get_externalDBType_fromID(value,request_types):
  try:
    tmp=[item for item in request_types if item.get('id')==value]
    if tmp:
        return tmp[0]['id']
    else:
        return ' '
  except Exception as e:
                print('Error in get_externalDBType_fromID :' + str(e))

def Get_guid_UserID(names):
  try:
    tmp=''
    rc=db.session.query(users).filter(users.last_name + ' ' + users.first_name==names).all()
    for itm in rc:        
        tmp=str(itm.uid)        
    return tmp
  except Exception as e:
                print('Error in Get_guid_UserID :' + str(e))

def Get_external_UserID(uid):
  try:
    tmp=''
    rc=db.session.query(users).filter(users.uid==uid).all()
    for itm in rc:        
        tmp=int(itm.id)
    return tmp
  except Exception as e:
                print('Error in Get_external_UserID :' + str(e))

#Changes in timetable records model => update only ranges date types
def Get_Changes(wwwTimetable,dbTimetable,Range_types,timetableID,Trans):
  try:
    recUpdate=[]
    recDelete=[]
    recAdd=[]
    strIdADD=''    
    req_Types=shiftT.Read.To_JSON(shiftT.Read.Get_RequestWWW_types())
    ext_types=shiftT.Read.To_JSON(shiftT.Read.Get_External_types())
    #print(ext_types)
   
    #print(dbTimetable)
    strInfoColumn=';id;uid;emp_id;full_name;default_wrkgroup;position;wrk_group;wrk_description;wrk_leader;snet;shift_dta;table_wrkgroup;changes_counter;timetable_id;'
    if wwwTimetable!=['']:
     for rec in wwwTimetable:       
        intID=Get_external_UserID(rec['uid'])        
        if dbTimetable!=['']:
            rc=[item for item in dbTimetable if str(item.get('uid'))==rec['uid']]            
        else :
            rc=[]
        if not rc:           
            if strIdADD.find(';' + str(intID))==-1:
                strIdADD=strIdADD+';' + str(intID)
                recordobj= {'id':intID}
                recAdd.append(recordobj)
            for item in rec:                
                if item!='uid' and item!='first_name' and item!='last_name' and item!='full_name' and item.find('_emp_err')==-1:
                    #print('New Guid')
                    if item + '_emp_err' in rec:
                        recordobj= {'id':intID,'full_name':rec['full_name'],'date':item,'type_id_int':int(rec[item]),'emp_err':str(rec[item + '_emp_err'])}
                    else:
                        recordobj= {'id':intID,'full_name':rec['full_name'],'date':item,'type_id_int':int(rec[item]),'emp_err':''}
                    recUpdate.append(recordobj)
        else:
            for item in rec:
                if item!='uid' and item!='first_name' and item!='last_name' and item!='full_name' and item.find('_emp_err')==-1:
                    if item in rc[0]:                       
                        if (int(rc[0][item]['value'])!=int(rec[item]) and get_externalDBType_fromID(rc[0][item]['value'],ext_types)==' ') or (int(rc[0][item]['value'])!=rec[item] and get_externalDBType_fromID(rec[item],req_Types)!=' '):
                        #if (get_externalDBType_fromID(rc[0][item],ext_types)==' ') or (get_externalDBType_fromID(rec[item],req_Types)!=' '):                            
                            #print('Str1' + str(rc[0][item]!=rec[item] and get_externalDBType_fromID(rc[0][item],ext_types)==' ') + ' Str2' + str(rc[0][item]!=rec[item] and get_externalDBType_fromID(rec[item],req_Types)!=' '))
                            #print(str(rc[0][item]) + ' => ' +str(rec[item]))
                            #print('Item In ' + item)
                            if item + '_emp_err' in rec:
                                recordobj= {'id':intID,'full_name':rec['full_name'],'date':item,'type_id_int':int(rec[item]),'emp_err':str(rec[item + '_emp_err'])}
                            else:
                                recordobj= {'id':intID,'full_name':rec['full_name'],'date':item,'type_id_int':int(rec[item]),'emp_err':''}
                            recUpdate.append(recordobj)
                        elif 'err' in rc[0][item] and item + '_emp_err' in rec:
                          if 'timeDif' in  rc[0][item]['err'] and 'timeDif' in rec[item + '_emp_err']:
                             #print('Check arttr')                                                 
                             #check 'timeDif', 'startDif', 'endDif'
                             if int(rc[0][item]['err']['timeDif'])!=int(rec[item + '_emp_err']['timeDif']) or int(rc[0][item]['err']['startDif'])!=int(rec[item + '_emp_err']['startDif']) or int(rc[0][item]['err']['endDif'])!=int(rec[item + '_emp_err']['endDif']):                          
                                 #print('Check arttr change')
                                 recordobj= {'id':intID,'full_name':rec['full_name'],'date':item,'type_id_int':int(rec[item]),'emp_err':str(rec[item + '_emp_err'])}
                                 recUpdate.append(recordobj)
                                 #print(recordobj)
                          elif 'timeDif' not in  rc[0][item]['err'] and 'timeDif' in rec[item + '_emp_err']:
                              recordobj= {'id':intID,'full_name':rec['full_name'],'date':item,'type_id_int':int(rec[item]),'emp_err':str(rec[item + '_emp_err'])}
                          elif 'timeDif' in  rc[0][item]['err'] and 'timeDif' not in rec[item + '_emp_err']:
                              recordobj= {'id':intID,'full_name':rec['full_name'],'date':item,'type_id_int':int(rec[item]),'emp_err':''}
                        elif 'err' not in rc[0][item] and item + '_emp_err' in rec:
                                #print('Atribute previous null')
                                recordobj= {'id':intID,'full_name':rec['full_name'],'date':item,'type_id_int':int(rec[item]),'emp_err':str(rec[item + '_emp_err'])}
                                recUpdate.append(recordobj) 
                                #print(recordobj)
                    else:
                        #print('Item Out')
                        if item + '_emp_err' in rec:
                            recordobj= {'id':intID,'full_name':rec['full_name'],'date':item,'type_id_int':int(rec[item]),'emp_err':str(rec[item + '_emp_err'])}                           
                        else:
                            recordobj= {'id':intID,'full_name':rec['full_name'],'date':item,'type_id_int':int(rec[item]),'emp_err':''}
                        recUpdate.append(recordobj)
                socket_.sleep(0)
            for itm in rc[0]:                
                if strInfoColumn.find(';' + itm)==-1:                    
                    if not itm in rec and get_externalName_fromID(rc[0][itm],ext_types)!='': 
                        #print('Item not in db ' + itm + 'Id' + rec['full_name'] + ' Item_val :' + str(rc[0][itm]))
                        recordobj= {'id':intID,'full_name':rec['full_name'],'date':itm,'type_id':''}
                        recUpdate.append(recordobj)
                socket_.sleep(0)
    if dbTimetable!=['']:
     for rcrd in dbTimetable:
        fnd=[item for item in wwwTimetable if item.get('uid')==str(rcrd['uid'])]
        if not fnd:           
            intID=Get_external_UserID(rcrd['uid'])
            recordobj= {'id':intID}
            recDelete.append(recordobj)   
    if len(recAdd)>0:
        print("Integrity Persons in Timetable => Some records Added => " + str(len(recAdd)))
        #print(recAdd)
        for i in range(0,math.floor(len(recAdd)/50)+1):            
            tmp={'Check':'Some records Added in WWW','TimetableID':timetableID,'guid':Trans}
            socket_.emit('Integrity Persons in Timetable',{'data':tmp},broadcast=True)
            socket_.sleep(0)
            user.writeUserTimetable.AddMOD_Users_to_Timetable(recAdd[i*50:(i+1)*50],timetableID,False,Trans)        
    if len(recDelete)>0:
        print("Integrity Persons in Timetable => Some records deleted => " + str(len(recDelete)))
        #print(recDelete)
        for i in range(0,math.floor(len(recDelete)/50)+1):           
            tmp={'Check':'Some records deleted in WWW','TimetableID':timetableID,'guid':Trans}
            socket_.emit('Integrity Persons in Timetable',{'data':tmp},broadcast=True)
            socket_.sleep(0)
            user.writeUserTimetable.Del_Users_from_Timetable(recDelete[i*50:(i+1)*50],timetableID,False,Trans)
    if len(recUpdate)>0:
        print("Integrity Persons in Timetable => Some modifications => " + str(len(recUpdate)))
        #print(recUpdate)
        for i in range(0,math.floor(len(recUpdate)/50)+1):           
            tmp={'Check':'WWW recordset modified / added records','TimetableID':timetableID,'guid':Trans}
            socket_.emit('Integrity Persons in Timetable',{'data':tmp},broadcast=True)
            socket_.sleep(0)
            user.writeUserTimetable.AddMOD_Users_to_Timetable(recUpdate[i*50:(i+1)*50],timetableID,False,Trans)

    if len(recUpdate)==0 and len(recDelete)==0 and len(recAdd)==0:
        print("Integrity Persons in Timetable => No changes")
        tmp={'Check':'No changes','TimetableID':timetableID,'guid':Trans}
        socket_.emit('Integrity Persons in Timetable',{'data':tmp},broadcast=True)
        socket_.sleep(0)
    else:
        tmp={'Check':'Changes Done','TimetableID':timetableID,'guid':Trans}
        socket_.emit('Integrity Persons in Timetable',{'data':tmp},broadcast=True)
        socket_.sleep(0)
    #print(dbTimetable)
  except Exception as e:
                print('Error in Get_Changes :' + str(e))

def Get_closer_Val (hourStart,hourEnd,Range_types,emp_typ_time) :
  try:
     tmpval=24*60*2
     tmpid=0
     timedif=0
     tmpdif=0
     startDif=0
     endDif=0
     tmp_range_type=[item for item in Range_types if item.get('emp_type')==emp_typ_time] 
     #if emp_typ_time!=1:
        #print(tmp_range_type)
     for dat in tmp_range_type:
        value= math.fabs((dat['time_from'].hour *60 + dat['time_from'].minute)-hourStart) + math.fabs((dat['time_to'].hour *60 + dat['time_to'].minute)-hourEnd) 
        if value<tmpval:
            tmpval=value
            tmpid=dat['id']
            # get diference from All time 
            timedif=((dat['time_to'].hour *60 + dat['time_to'].minute)-(dat['time_from'].hour *60 + dat['time_from'].minute))-(hourEnd-hourStart)
            #Diferences beetwen Start and End
            startDif=(dat['time_from'].hour *60 + dat['time_from'].minute)-hourStart
            endDif=(dat['time_to'].hour *60 + dat['time_to'].minute)-hourEnd
            #print(str(hourStart) + '=>' + str(dat.time_from.hour *60 + dat.time_from.minute))
            tmpdif=(int(dat['time_from'].hour *60 + dat['time_from'].minute)-int(hourStart))/60
        socket_.sleep(0)
     return {'id':tmpid,'dif':tmpdif,'timeDif':timedif,'startDif':startDif,'endDif':endDif}
  except Exception as e:
                print('Error in Get_closer_Val :' + str(e))
#-------------------------------------------------------------------------------------
# Deprecated
#-------------------------------------------------------------------------------------
#get list of persons from www https://hrnest.io/WorkTime/TimeTable/Details
def get_PersonsTimetable_from_www(timetableWWWID,List='OnlyPerson'):
  try:
     _url='https://hrnest.io/WorkTime/TimeTable/Details/' + str(timetableWWWID)
     s=hr2.hrwww.log_me_in_WWW()
     upload=hr2.hrwww.get_www_conetnt(s,_url)
     persons=upload.find_all("span", attrs={"class": "surname-time"})
     tm=''
     tmp=[]
     if List!='OnlyPerson':
        plan_rows=upload.find_all("div",attrs={"class": "plan-row"})                
        curr=1
        countitm=0
        #get rows day name
        days_nam=[]   
        for nam in plan_rows[0].find_all("div",attrs={"class": "plan-item"}):
            strId=str(nam.get('id'))
            if strId!=None:
                days_nam.append(strId[0:4]+'-'+strId[4:6]+'-'+strId[6:8])     
     for item in persons:
         tm=str(item)
         recordobj={'names':tm.replace('<span class="surname-time">','').replace('</span>','')}
         if List=='OnlyPerson':
             tmp.append(recordobj)
         else:
            countitm=0
            for itm in plan_rows[curr].find_all("div",attrs={"class": "plan-item"}):
                tmrec=itm.find_all("span", attrs={"class": "hour-time"})             
                if len(tmrec)>0:
                    recordobj[str(days_nam[countitm])]={"hFrom":str(tmrec[0]).replace('<span class="hour-time">','').replace('</span>','') + ':' + str(tmrec[1]).replace('<span class="hour-time">','').replace('</span>',''),"hTo":str(tmrec[2]).replace('<span class="hour-time">','').replace('</span>','') + ':' + str(tmrec[3]).replace('<span class="hour-time">','').replace('</span>','')}
                countitm=countitm+1
            tmp.append(recordobj)
            curr=curr+1
     #print(tmp)
     return tmp
  except Exception as e:
                print('Error in get_PersonsTimetable_from_www :' + str(e))

def check_AccessToTimetable(timetableWWWID,login=hr2.hrwww.m_user,password=hr2.hrwww.m_pwd):
    try:
        _url='https://hrnest.io/WorkTime/TimeTable/EditTimeTable/' + str(timetableWWWID)
        s=hr2.hrwww.log_me_in_WWW(login, password)
        upload=hr2.hrwww.get_www_conetnt(s,_url)
        plan_div = upload.find("div",{"id":"plan-container"})
        d_divs = plan_div.find("div",{"class": "plan-row plan-header plan-header-harmonogram"}).findAll("div",{"class": "plan-element"})
        return len(d_divs)>0
    except:
        return False