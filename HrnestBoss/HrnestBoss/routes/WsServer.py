# coding=utf-8
import functools
from HrnestBoss import socket_
from threading import Thread, Event
from flask_socketio import SocketIO, emit, disconnect
import HrnestBoss.controlers.TimeTablecontroler as tmtbl
import HrnestBoss.DbModel.IntegrityTimetablepy as timetbl
import HrnestBoss.DbModel.IntegrityPersons as pers
import HrnestBoss.DbModel.IntegrityOfRequests as req_pers
import HrnestBoss.DbModel.IntegrityPersonsInTImetable as PersTMTBL
import HrnestBoss.controlers.User_Requestcontoler as usrcontr
import HrnestBoss.controlers.hrnest as hrWWW
import HrnestBoss.controlers.Migrate as hr2
import json
import datetime
import time
from datetime import datetime, timedelta
from flask_login import current_user


thread = Thread()
requ = Thread()
saveWWW = Thread()
# history of running threads
thread_hist = {}
# threads on work
threat_onWork = {}
#list of timetables with temporary changed status to allow edit
timetables_temp_status = {}

def TimetableEditEnded(key):
    global timetables_temp_status
    timetables_temp_status.pop(key, None)
    return True

def Set_TimetableEdit(key):
    global timetables_temp_status
    timetables_temp_status[key] = datetime.today()

def UpdateIsNeeded(key, time):
    global thread_hist
    global threat_onWork
    result =False
    if key not in thread_hist:
        thread_hist[key] = datetime.today() - timedelta(minutes = time+2) 
    if key not in threat_onWork:
        tdelta = datetime.today() - thread_hist[key]
        if tdelta.seconds // 60 > time:
            threat_onWork[key] = datetime.today()
            thread_hist[key] = datetime.today()
            result = True
    return result

def Get_thread_hist(key):
    global thread_hist
    return thread_hist[key] if key in thread_hist else datetime.today()

def Set_thread_hist(key, time):
    global thread_hist    
    thread_hist[key] = datetime.today() - timedelta(minutes = time+2)
    return True

def Set_thread_onWork(key):
    global threat_onWork
    threat_onWork[key] = datetime.today()

def JobEnded(key):
    global threat_onWork
    threat_onWork.pop(key, None)
    return True

def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            disconnect()
        else:
            return f(*args, **kwargs)
    return wrapped

@socket_.on('Save_data_on_WWW')
@authenticated_only
def Save_on_WWW(message):
    global saveWWW
    #if not saveWWW.is_alive():
    print('Save data on WWW')          
    saveWWW=SaveWW()
    saveWWW.Dataset=message
    socket_.start_background_task(saveWWW.save())

@socket_.on('Timetables_List')
def Timetables(message):    
    emit('response',{'data': message['data']})

@socket_.on('Check_Range')
@authenticated_only
def Check_range(Dataset):
     global requ
     print('Starting Query Check Range')      
     requ = ReQuest()
     requ.Dataset=Dataset
     socket_.start_background_task(requ.CheckRange())

@socket_.on('Get_Requests')
@authenticated_only
def Get_Requests(Dataset):
    global requ
    #Check requests of pearsons / update persons in Timetables on offday => first check timetable in message
    print('Starting Query Check Request') 
    print('Starting Thread :' + Dataset['Dataset'] ) 
    requ = ReQuest()
    requ.Dataset=Dataset
    socket_.start_background_task(requ.CheckPerson())

# Update data from Hrest to DB
@socket_.on('Check Integrity')
@authenticated_only
def test_broadcast_message(Dataset):
    global thread
    print('Request of Check Integrity')
    #Turn Jobs to another Process
    print('Starting Thread :' + Dataset['Dataset'] + ' , AllowChanges ' + Dataset['AllowChanges'])        
    thread = BCKGRND()
    thread.Dataset = Dataset
    socket_.start_background_task(thread.updateTbls())
        #thread.updateTbls() 

# Connect to Socked in Main thread
@socket_.on('connect')
def test_connect():
    print('Client connected')
    

@socket_.on('disconnect_request')
def disconnect_request():
    def can_disconnect():
        disconnect()    
    emit('response',{'data': 'Disconnected!'},callback=can_disconnect)

@socket_.on('disconnect')
def test_disconnect():
    print('Client disconnected')

class BCKGRND(Thread):     
    def __init__(self): 
        self.Dataset={'Dataset': 'All',
            'AllowChanges': 'true'}        
        super(BCKGRND, self).__init__()
     
    def Check_IntegrityTimetbl(self):              
        tmp = 'No changes'
        if UpdateIsNeeded('Start thread for timetables', 3):           
             print('Start thread for timetables')             
             tmp= timetbl.Changes_Timetable_List(self.Allowchanges)
             if UpdateIsNeeded('Update_Departments', 15):
                dba=pers.Update_Departments()
                JobEnded('Update_Departments')
             JobEnded('Start thread for timetables')
             emit('checkTimetable_List',{'data':tmp},broadcast=True)
        socket_.sleep(0)
        print('End Checking Timetables List in WWW => emmit signal')                    

        #print('checkTimetable_List : '.format(tmp))
    def Check_IntegrityPersonsInWWW(self):
        dadc = 'No changes'
        if UpdateIsNeeded('Check_IntegrityPersonsInWWW', 15):
            print('Start thread for persons')            
            dadc=pers.Check_PersonsInWWW(self.Allowchanges)
            JobEnded('Check_IntegrityPersonsInWWW')
            emit('checkPersonsfrmWWW',{'data':dadc},broadcast=True)
        socket_.sleep(0)
        print('End Checking List of Persons in WWW => emmit signal')
                
        #print('checkPersonsfrmWWW : '.format(dadc))
    
    def updateTbls(self):        
        self.qry = self.Dataset['Dataset']
        self.Allowchanges=json.loads(self.Dataset['AllowChanges'].lower())        
        if self.qry.upper()=='ALL' or self.qry.upper()=='TIMETABLE':
             self.Check_IntegrityTimetbl()
        if self.qry.upper()=='ALL' or self.qry.upper()=='PERSONSINWWW':
             self.Check_IntegrityPersonsInWWW()
             
class ReQuest(Thread):
    def __init__(self): 
        self.Dataset={'Dataset':'Active'}       
        super(ReQuest, self).__init__()

    def CheckRange(self):
        self.Dfrom= self.Dataset['dateFrom']
        self.Dto= self.Dataset['dateTo']        
        self.Trans=self.Dataset['Trans']
        self.Ttbl = [0]
        self.qry='Range'
        tmp={'DataExchange':'Started','dateTo':self.Dataset['dateTo'],'dateFrom':self.Dataset['dateFrom'],'guid':self.Dataset['Trans']}
        socket_.emit('DataExchange',{'data':tmp},broadcast=True)
        self.Check_Requests()
        self.Check_timetableInRange(True)
        tmp={'DataExchange':'Ended','dateTo':self.Dataset['dateTo'],'dateFrom':self.Dataset['dateFrom'],'guid':self.Dataset['Trans'], 'type': self.Dataset['type']}
        socket_.emit('DataRangeExchange',{'data':tmp},broadcast=True)
        tmp={'DataExchange':'Ended','dateTo':self.Dataset['dateTo'],'dateFrom':self.Dataset['dateFrom'],'guid':self.Dataset['Trans']}
        socket_.emit('DataExchange',{'data':tmp},broadcast=True)


    def Check_timetableInRange(self, refrForce = False):
        rng=timetbl.Get_List_of_timetables_in_RangeDates(self.Dfrom,self.Dto) 
        counter = 0
        current = time.time()
        for item in rng:
            counter +=1
            if not item.hrnest_id in self.Ttbl:               
               if UpdateIsNeeded('Check_Timetable_Employes' + str(item.hrnest_id), 1 if refrForce else 10):
                    print('Quick Check Timetable => ' + str(item.hrnest_id) + '   name : ' + item.title )
                    PersTMTBL.Check_Timetable_Employes(item.hrnest_id,'internal',item.date_from.strftime('%Y-%m-%d'),item.date_to.strftime('%Y-%m-%d'),False)
                    JobEnded('Check_Timetable_Employes' + str(item.hrnest_id))
                    if refrForce:
                        delta = (time.time() - current) * 1000
                        if delta > 5000: 
                            tmp={'DataExchange':'Work','dateTo':self.Dataset['dateTo'],'dateFrom':self.Dataset['dateFrom'],'guid':self.Dataset['Trans'], 'type': self.Dataset['type'], 'percent': round((counter/len(rng)) * 100) }
                            socket_.emit('DataRangeExchange',{'data':tmp},broadcast=True)
                            current = time.time()
            socket_.sleep(0)

    def Check_Requests(self):
        if UpdateIsNeeded('Update_Requ_DB' + self.Dfrom + self.Dto, 5):                
                req_pers.Update_Requ_DB(self.qry,self.Dfrom,self.Dto)
                JobEnded('Update_Requ_DB' + self.Dfrom + self.Dto)
                socket_.sleep(0)

    def CheckPerson(self):
        self.qry = self.Dataset['Dataset']
        #print(self.qry)
        if self.qry == ('Range' or 'All'):
          if self.Dataset['ID']!=None:
            print('Integrity')
            self.Dfrom= self.Dataset['dateFrom']
            self.Dto= self.Dataset['dateTo']
            self.Ttbl=self.Dataset['ID'].split(',') if type(self.Dataset['ID']) is str else [self.Dataset['ID']]
            self.Trans=self.Dataset['Trans']            
            tmp={'DataExchange':'Started','dateTo':self.Dataset['dateTo'],'dateFrom':self.Dataset['dateFrom'],'guid':self.Dataset['Trans']}
            socket_.emit('DataExchange',{'data':tmp},broadcast=True)
            self.Check_Requests()              
            
            for item in self.Ttbl:
                if item != None or item !='':
                    presentTimetable = tmtbl.readTimetable.TimetableByHrnestID(int(item))
                    if UpdateIsNeeded('Check_Timetable_Employes' + str(item), 10):
                        PersTMTBL.Check_Timetable_Employes(int(item),self.Trans,self.Dfrom,self.Dto)                    
                        JobEnded('Check_Timetable_Employes' + str(item))
                    else:                         
                        accesTimetable = True
                        tmp={'credentials':accesTimetable,'hrnest_id':item,'guid':self.Trans}
                        socket_.emit('AccesToTimetable',{'data':tmp},broadcast=True)
                        tmp={'Check':'No changes','TimetableID':presentTimetable[0].id,'guid':self.Dataset['Trans']}
                        socket_.emit('Integrity Persons in Timetable',{'data':tmp},broadcast=True)
                socket_.sleep(0)            
            socket_.start_background_task(usrcontr.write__UserRequest.update_Emp_idByUID,False)
            socket_.start_background_task(usrcontr.write__UserRequest.update_Emp_idByUID)
            
            #Check all recordset in ranges except present
            self.Check_timetableInRange()
            tmp={'DataExchange':'Ended','dateTo':self.Dataset['dateTo'],'dateFrom':self.Dataset['dateFrom'],'guid':self.Dataset['Trans']}
            socket_.emit('DataExchange',{'data':tmp},broadcast=True)          
            
          else:
            tmp={'Check':'No changes','TimetableID':self.Dataset['ID'],'guid':self.Dataset['Trans']}
            socket_.emit('Integrity Persons in Timetable',{'data':tmp},broadcast=True)
        else :
            req_pers.Update_Requ_DB(self.qry)

class SaveWWWNEW(Thread):
    def __init__(self): 
        self.Dataset={'HRnest':'Active'}       
        super(SaveWW, self).__init__()

    def save(self):
        self.Dfrom= self.Dataset['dateFrom']
        self.Dto= self.Dataset['dateTo']
        standard_query=['persons','TimetableID']
        credentials_query=['psw' , 'login']
        tmp={'DataExchange':'Started','dateTo':self.Dataset['dateTo'],'dateFrom':self.Dataset['dateFrom'],'guid':''}
        socket_.emit('DataExchange',{'data':tmp},broadcast=True)
        if 'persons' in self.Dataset and 'TimetableID' in self.Dataset: 
            if len(self.Dataset['persons'])>0:
                for item in self.Dataset['persons']:
                    result = hr2.put_Item_Timetable(self.Dataset['TimetableID'], item['guid'], item['startTime'], item['endTime'], '', SaveWWWNEW.Calculate_break_minutes(item['startTime'],item['endTime']), False)
                print('Data saved On WWW => Timetable ID:' + str(self.Dataset['TimetableID']))
                socket_.sleep(0)
                Dataset= {'Dataset': 'Range','dateFrom': self.Dataset['dateFrom'],'dateTo': self.Dataset['dateTo'],'ID':self.Dataset['TimetableID'],'Trans':self.Dataset['Trans']}
                #Check requests of pearsons / update persons in Timetables on offday => first check timetable in message          
                requ = ReQuest()
                requ.Dataset=Dataset
                socket_.start_background_task(requ.CheckPerson())
        tmp={'DataExchange':'Ended','dateTo':self.Dataset['dateTo'],'dateFrom':self.Dataset['dateFrom'],'guid':''}
        socket_.emit('DataExchange',{'data':tmp},broadcast=True)

    def Calculate_break_minutes(s1,s2):
          tmp=0
          tdelta = datetime.strptime(s2, '%H:%M') - datetime.strptime(s1, '%H:%M')
          if tdelta.seconds//3600 >6 or tdelta.seconds<0:
              tmp=15
          return tmp

#----------------------------------------------------------------
# Class Deprecated
#----------------------------------------------------------------
class SaveWW(Thread):
    def __init__(self): 
        self.Dataset={'HRnest':'Active'}       
        super(SaveWW, self).__init__()
    def save(self):
        self.Dfrom= self.Dataset['dateFrom']
        self.Dto= self.Dataset['dateTo']
        standard_query=['persons','TimetableID']
        credentials_query=['psw' , 'login']
        tmp={'DataExchange':'Started','dateTo':self.Dataset['dateTo'],'dateFrom':self.Dataset['dateFrom'],'guid':''}
        socket_.emit('DataExchange',{'data':tmp},broadcast=True)
        if 'persons' in self.Dataset and 'TimetableID' in self.Dataset: 
            if len(self.Dataset['persons'])>0:
                #get data from www
                wwwFresh= PersTMTBL.hr2.hrwww.get_timetable_by_API(self.Dataset['TimetableID'])
                if 'psw' in self.Dataset and 'login' in self.Dataset:
                    #credentials not from server
                    s=hrWWW.log_me_in_WWW(self.Dataset['login'],self.Dataset['psw'])
                else:
                    s=hrWWW.log_me_in_WWW()
                harmonogram = hrWWW.get_timetable_by_WWW(s, self.Dataset['TimetableID'])
                plan_div = harmonogram.find("div",{"id":"plan-container"})
                processed_timetable = hrWWW.process_plan_div(plan_div)
                for item in self.Dataset['persons']:
                    if 'psw' in self.Dataset and 'login' in self.Dataset:
                        #credentials not from server
                        s=hrWWW.log_me_in_WWW(self.Dataset['login'],self.Dataset['psw'])
                    else:
                        s=hrWWW.log_me_in_WWW()
                    if len([itm for itm in wwwFresh if str(itm.get('userId'))==item['guid'] and str(itm.get('timeFrom'))[0:10]==item['date']])>0:
                        if 'startTime' in item:                     
                            #records find modify                       
                            akcja = hrWWW.easily_edit_timetable_item_by_WWW(s, processed_timetable, item['guid'], item['date'].replace('-',''), item['startTime'], item['endTime'], SaveWW.Calculate_break_minutes(item['startTime'],item['endTime']), '',False,self.Dataset['TimetableID'])
                            print( str(item) +' => Modify')
                        else:
                            akcja=hrWWW.easily_delete_timetable_item_by_WWW(s,processed_timetable,item['guid'],item['date'].replace('-',''),self.Dataset['TimetableID'])
                            print( str(item) +' => Delete')
                    else:
                        #add new                        
                        akcja = hrWWW.create_timetable_item_by_WWW(s, self.Dataset['TimetableID'], item['guid'], item['date'],item['startTime'], item['endTime'],SaveWW.Calculate_break_minutes(item['startTime'],item['endTime']), '', False)
                        print( str(item) +' => Add New')                               
                print('Data saved On WWW => Timetable ID:' + str(self.Dataset['TimetableID']))
                
                Dataset= {'Dataset': 'Range','dateFrom': self.Dataset['dateFrom'],'dateTo': self.Dataset['dateTo'],'ID':self.Dataset['TimetableID'],'Trans':self.Dataset['Trans']}
                #Check requests of pearsons / update persons in Timetables on offday => first check timetable in message          
                requ = ReQuest()
                requ.Dataset=Dataset
                socket_.start_background_task(requ.CheckPerson())
        tmp={'DataExchange':'Ended','dateTo':self.Dataset['dateTo'],'dateFrom':self.Dataset['dateFrom'],'guid':''}
        socket_.emit('DataExchange',{'data':tmp},broadcast=True)
    def Calculate_break_minutes(s1,s2):
          tmp=0
          tdelta = datetime.strptime(s2, '%H:%M') - datetime.strptime(s1, '%H:%M')
          if tdelta.seconds//3600 >6 or tdelta.seconds<0:
              tmp=15
          return tmp