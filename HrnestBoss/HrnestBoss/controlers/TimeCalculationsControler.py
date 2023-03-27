# coding=utf-8
from HrnestBoss import socket_
from HrnestBoss.routes.WsServer import Set_thread_hist ,Get_thread_hist, Set_thread_onWork, JobEnded, ReQuest
from HrnestBoss.controlers.Usercontroler import readUser
from HrnestBoss.controlers.User_Requestcontoler import read_UserRequest
from HrnestBoss.controlers.shift_typecontoler import Read
from HrnestBoss.controlers.TimeTablecontroler import readTimetable
import HrnestBoss.controlers.Migrate as hrnest
import HrnestBoss.controlers.hrnest as hrWWW
import datetime
from datetime import datetime,timedelta
from threading import Thread
import json
from time import sleep

class Save_Data():
    def convertSymbolsToTime(usersTimetable_rec,TimetableID,JSON=False,Credentials=False):
        if JSON:
            users_rec=json.loads(usersTimetable_rec)
        else:
            users_rec=usersTimetable_rec
        itemPerc = 1;
        counter = len(users_rec)
        main_rec = []
        max_counter = len(users_rec)
        state = ''
        if max_counter > 0:            
            presentTimetable = readTimetable.TimetableByID(TimetableID)
            state = Read_Data.getStateOfTimetable(presentTimetable[0].hrnest_id,presentTimetable[0].date_from.strftime("%Y-%m-%d"),presentTimetable[0].date_to.strftime("%Y-%m-%d"))
            if state=='Approved':
                ok= hrnest.change_timetable_status(presentTimetable[0].hrnest_id,'Waiting')
            requests = read_UserRequest.ReadEnumerableInRangeByTimetable(presentTimetable[0].date_from.strftime("%Y-%m-%d"), presentTimetable[0].date_to.strftime("%Y-%m-%d"), TimetableID) 
            socket_.sleep(0)    
            #print(requests)
            enumTypesRequest = Read.Get_RequestEnumerable_types()            
            timetableRequest = Read.Get_Timetable_types()            
            socket_.sleep(0)
            if presentTimetable[0].hrnest_id != None:
                planned_end = datetime.today() - timedelta(minutes = max_counter / 60)
                if Get_thread_hist('Check_Timetable_Employes' + str(presentTimetable[0].hrnest_id)) < planned_end:
                        Set_thread_hist('Check_Timetable_Employes' + str(presentTimetable[0].hrnest_id), max_counter / 60 )
            #if users_rec[0]['type_id']=='':
            #   if Credentials != False:
            #       s=hrWWW.log_me_in_WWW(Credentials['login'],Credentials['psw'])
            #   else:
            #       s=hrWWW.log_me_in_WWW() 
            #   harmonogram = hrWWW.get_timetable_by_WWW(s, presentTimetable[0].hrnest_id)
            #  plan_div = harmonogram.find("div",{"id":"plan-container"})
            #   processed_timetable = hrWWW.process_plan_div(plan_div)
                itemPerc = 0;
                counter = 0
                for usr in users_rec:
                    Set_thread_onWork('Check_Timetable_Employes' + str(presentTimetable[0].hrnest_id))
                    counter +=1
                    #print(usr)
                    emp_typ_time = 1
                    tm = datetime.strptime(usr['date'], '%Y-%m-%d')
                    persExist = [item for item in requests if (str(item.userId) == usr['guid'] and tm >= item.dateFrom and tm <= item.dateTo)]
            
                    if len(persExist) > 0 :
                        emp_typ_time = [item for item in enumTypesRequest if item.req_type_id == persExist[0].typeId][0].emp_type
                    # create model for Api Body
                    time_model_preset = [item for item in timetableRequest if item.emp_type == emp_typ_time and item.name == usr['type_id']]
                    #print(time_model_preset[0].time_from.hour)
                    commentonly = False
                    if len(time_model_preset) == 0:
                        time_model_preset.append(timetableRequest[0]) 
                        time_model_preset[0].time_to= time_model_preset[0].time_from
                        commentonly=True
                        #akcja=hrWWW.easily_delete_timetable_item_by_WWW(s, processed_timetable, usr['guid'],usr['date'].replace('-',''), presentTimetable[0].hrnest_id)
                
                    dateBeetwenDays = False
                    if time_model_preset[0].time_from.hour > time_model_preset[0].time_to.hour:
                        dateBeetwenDays = True
                    if dateBeetwenDays:
                        tdelta = datetime.strptime(str(time_model_preset[0].time_to.hour + 24).zfill(2) + ':' + str(time_model_preset[0].time_to.minute).zfill(2), '%H:%M') - datetime.strptime(str(time_model_preset[0].time_from.hour).zfill(2) + ':' + str(time_model_preset[0].time_from.minute).zfill(2), '%H:%M')
                    else:
                        tdelta = datetime.strptime(str(time_model_preset[0].time_to.hour).zfill(2) + ':' + str(time_model_preset[0].time_to.minute).zfill(2), '%H:%M') - datetime.strptime(str(time_model_preset[0].time_from.hour).zfill(2) + ':' + str(time_model_preset[0].time_from.minute).zfill(2), '%H:%M')
                    if hrWWW.calls_wait > 10:
                        socket_.sleep(round(hrWWW.calls_wait/2))
                    callback = hrnest.put_Item_Timetable(
                        presentTimetable[0].hrnest_id, 
                        usr['guid'], 
                        usr['date'] + 'T' +  str(time_model_preset[0].time_from.hour).zfill(2) + ':' + str(time_model_preset[0].time_from.minute).zfill(2) + ':00',
                        (usr['date'] if dateBeetwenDays!=True else (datetime.datetime.strptime(usr['date'],'%Y-%m-%d') + timedelta(days=1)).strftime("%Y-%m-%d")) + 'T' +  str(time_model_preset[0].time_to.hour).zfill(2) + ':' + str(time_model_preset[0].time_to.minute).zfill(2) + ':00',
                        '' if commentonly!=True else '_', 
                        15 if tdelta.seconds//3600 >6 and not commentonly else 0, 
                        commentonly,
                        'POST', )  #if commentonly!=True else 'DELETE'                     
                    socket_.sleep(0)
                    if callback == 409:
                        state = Read_Data.getStateOfTimetable(presentTimetable[0].hrnest_id,presentTimetable[0].date_from.strftime("%Y-%m-%d"),presentTimetable[0].date_to.strftime("%Y-%m-%d"))
                        if state=='Approved':
                            ok= hrnest.change_timetable_status(presentTimetable[0].hrnest_id,'Waiting')
                            callback = hrnest.put_Item_Timetable(
                                presentTimetable[0].hrnest_id, 
                                usr['guid'], 
                                usr['date'] + 'T' +  str(time_model_preset[0].time_from.hour).zfill(2) + ':' + str(time_model_preset[0].time_from.minute).zfill(2) + ':00',
                                (usr['date'] if dateBeetwenDays!=True else (datetime.datetime.strptime(usr['date'],'%Y-%m-%d') + timedelta(days=1)).strftime("%Y-%m-%d")) + 'T' +  str(time_model_preset[0].time_to.hour).zfill(2) + ':' + str(time_model_preset[0].time_to.minute).zfill(2) + ':00',
                                '' if commentonly!=True else '_', 
                                15 if tdelta.seconds//3600 >6 and not commentonly else 0, 
                                commentonly,
                                'POST', )
                    if hrWWW.calls_wait > 10:
                        socket_.sleep(round(hrWWW.calls_wait/2))
                    else:
                        socket_.sleep(1)
                    tmpPerc = round((counter/max_counter) *100)
                    if tmpPerc > itemPerc + round(100/max_counter):
                       itemPerc = tmpPerc
                       tmp= {'DataExchange':'Started','TimetableID': presentTimetable[0].hrnest_id, 'Percentage': itemPerc, 'Changed' : counter, 'AllSet': max_counter }
                       socket_.emit('SaveOnHRNEST',{'data':tmp},broadcast=True)
            if state=='Approved':
                ok= hrnest.change_timetable_status(presentTimetable[0].hrnest_id,'Approved')
            tmp= {'DataExchange':'End','TimetableID': presentTimetable[0].hrnest_id, 'Percentage': 100, 'Changed' : counter, 'AllSet': max_counter }
            socket_.emit('SaveOnHRNEST',{'data':tmp},broadcast=True)
            JobEnded('Check_Timetable_Employes' + str(presentTimetable[0].hrnest_id))
    def UpdateTimetablesByEnumerableRequest(Request_users,JSON=False):
        tables = {}
        if JSON:
            users_rec=json.loads(Request_users)
        else:
            users_rec=Request_users
        all_dataF = None
        all_dataT = None
        for item in users_rec:            
            d_from=datetime(int(item['dateFrom'][0:4]),int(item['dateFrom'][5:7]),int(item['dateFrom'][8:10]))
            d_to=datetime(int(item['dateTo'][0:4]),int(item['dateTo'][5:7]),int(item['dateTo'][8:10]))
            if hasattr(item, 'old_dateFrom'):
                if d_from > datetime(int(item['old_dateFrom'][0:4]),int(item['old_dateFrom'][5:7]),int(item['old_dateFrom'][8:10])):
                    d_from=datetime(int(item['old_dateFrom'][0:4]),int(item['old_dateFrom'][5:7]),int(item['old_dateFrom'][8:10]))
                if d_to < datetime(int(item['old_dateTo'][0:4]),int(item['old_dateTo'][5:7]),int(item['old_dateTo'][8:10])):
                    d_to=datetime(int(item['old_dateTo'][0:4]),int(item['old_dateTo'][5:7]),int(item['old_dateTo'][8:10]))
            timetbl = readTimetable.TimetableByRangeDatesUserId(d_from,d_to,item['emp_id'])
            if all_dataF is None:
                all_dataF=d_from
            if all_dataT is None:
                all_dataT=d_to
            if all_dataF > d_from:
                all_dataF=d_from
            if all_dataT<d_to:
                all_dataT=d_to
            for itm in timetbl:
                usersTimetable_rec = readUser.User_Id_Timetable_rangeDate('id',str(item['emp_id']),itm.id,item['dateFrom'],item['dateTo'])
                for record in usersTimetable_rec:
                    if hasattr(record, 'shift'):
                        if hasattr(record.shift, 'date'):
                            tmp = {
                                'id': record.users.id,
                                'emp_id': record.users.emp_id,
                                'timetable_id': itm.id,
                                'guid': str(record.users.uid),
                                'full_name': record.users.last_name + ' '  + record.users.first_name,
                                'date': record.shift.date.strftime('%Y-%m-%d'),
                                'type_id': record.shift_type.name,                                
                             }
                            if itm.id not in tables:
                                tables[itm.id] = [tmp]
                            else :
                                tables[itm.id].append(tmp)
        for item in tables:           
           Save_Data.convertSymbolsToTime(tables[item] , item)
           socket_.sleep(5)
        
        requ = ReQuest()
        requ.Dataset={
                'Dataset': 'Range', 'dateFrom': all_dataF.strftime("%Y-%m-%d"), 'dateTo': all_dataT.strftime("%Y-%m-%d"),'Trans': 'Intenal', 'type':'Enumerable'
            }
        socket_.start_background_task(requ.CheckRange())


class Read_Data():

    def daterange(start_date, end_date):
        for n in range(int((end_date - start_date).days)+1):
            yield start_date + timedelta(n)

    def get_days_off(dateTo,dateFrom):
        days_off = []
        d_from=datetime(int(dateFrom[0:4]),int(dateFrom[5:7]),int(dateFrom[8:10]))
        d_to=datetime(int(dateTo[0:4]),int(dateTo[5:7]),int(dateTo[8:10]))
        for item in Read_Data.daterange(d_from, d_to):
            dayType = hrnest.get_working_day_info_by_API(item.strftime("%Y-%m-%d"))
            socket_.sleep(1)
            if not dayType:
                days_off.append(item.strftime("%Y-%m-%d"))
        return days_off

    # function dont work => problem with Hrnest API (return emtpy calback)
    def getCalendarItemsOff(dateTo,dateFrom):
        days_off = []
        allDays =  hrnest.get_calendar_Days(dateFrom,dateTo)
        socket_.sleep(1)
        for item in allDays:
            if item['type'] != 'Customday':
                days_off.append(item['date'])
        return days_off

    def getStateOfTimetable(id,dateF,dateT):
        timetables = hrnest.get_timetable_ALL(dateF,dateT)
        state = ''
        for tbl in timetables:
            if tbl['id'] == id:
                state= tbl['status']
                break
        return state 
        