# coding=utf-8
from flask import request
from HrnestBoss import socket_
from HrnestBoss import app,hrnestAccess
from HrnestBoss.controlers.Migrate import  Create_new_Timetable,get_timetable_ALL
import HrnestBoss.controlers.Migrate as hrnest
from HrnestBoss.controlers.TimeTablecontroler import readTimetable,writeTimetable
from HrnestBoss.controlers.TimeCalculationsControler import Save_Data
from HrnestBoss.controlers.Usercontroler import writeUserTimetable,readUser
import HrnestBoss.DbModel.IntegrityPersonsInTImetable as integr
import HrnestBoss.routes.WsServer
from flask_login import current_user, login_required
from threading import Thread


@app.route('/timetable', methods = ['POST','PUT','DELETE'])
@login_required
@hrnestAccess
def timetable():
    #Get metods to query data
    if request.method == 'POST':
        if 'AddUser' in request.args:
            if ('emp_id' or 'uid' or 'id') and 'TimetableID' in request.args:
                query_param=''
                if 'emp_id' in request.args: query_param='emp_id' 
                if 'uid' in request.args: query_param='uid'
                if 'id' in request.args: query_param='id'
        if 'AddDraft' in request.args:
            #print('Hej')
            if 'Draft' in request.values:                
                tmp=writeTimetable.addDraft(request.values['Draft'],True)
    if request.method == 'DELETE':
        if 'DelDraft' in request.args:
            if 'Draft' in request.values:                
                tmp=writeTimetable.erase(request.values['Draft'],True)
    return 'Ok'

@app.route('/timetableGetALL',methods =['GET'])
@login_required
def timetableGetALL():
    if request.method == 'GET': 
        return {"data" :  readTimetable.parse_Timetable_to_JSON(readTimetable.TableGetAll())} 

@app.route('/GroupsGetALL',methods =['GET'])
@login_required
def groupsGetALL():
    if request.method == 'GET':
        return  {"data" :readUser.parse_Workgroup_JSON(readUser.Workgropup_All())}


@app.route('/draftsGetALL',methods =['GET'])
@login_required
@hrnestAccess
def draftsGetALL():
    if request.method == 'GET':
        return {"data" :  readTimetable.parse_Timetable_to_JSON(readTimetable.DraftsGetALL())}

@app.route('/userstimetable',methods =['POST','PUT','DELETE'])
@login_required
@hrnestAccess
def UsersTimetable():
    if request.method == 'POST' or request.method == 'PUT':      
        if 'users' in request.values and 'TimetableID' in request.args and not 'Transaction' in request.args :
            tmp = socket_.start_background_task(writeUserTimetable.AddMOD_Users_to_Timetable,request.values['users'], request.args['TimetableID'], True)
            thread = socket_.start_background_task(Save_Data.convertSymbolsToTime,request.values['users'], request.args['TimetableID'], True)           
            #Save_Data.convertSymbolsToTime(request.values['users'], request.args['TimetableID'], True)
            return "Done"
        elif 'users' in request.values and 'TimetableID' in request.args and 'Transaction' in request.args :
            tmp = socket_.start_background_task(writeUserTimetable.AddMOD_Users_to_Timetable, request.values['users'], request.args['TimetableID'], True, request.args['Transaction'])
            thread = socket_.start_background_task(Save_Data.convertSymbolsToTime,request.values['users'], request.args['TimetableID'], True)            
            #Save_Data.convertSymbolsToTime(request.values['users'], request.args['TimetableID'], True)
            return "Done"
    elif request.method == 'DELETE':
       if 'users' in request.values and 'TimetableID' in request.args and not 'Transaction' in request.args :
            tmp = socket_.start_background_task(writeUserTimetable.Del_Users_from_Timetable,request.values['users'], request.args['TimetableID'], True)            
            thread = socket_.start_background_task(Save_Data.convertSymbolsToTime, request.values['users'], request.args['TimetableID'], True, request.values['credentials'] if 'credentials' in request.values else False)
            #Save_Data.convertSymbolsToTime(request.values['users'], request.args['TimetableID'], True, request.values['credentials'] if 'credentials' in request.values else False )
            return "Done"
       elif 'users' in request.values and 'TimetableID' in request.args and 'Transaction' in request.args :
            tmp = socket_.start_background_task(writeUserTimetable.Del_Users_from_Timetable,request.values['users'],request.args['TimetableID'],True,request.args['Transaction'])
            thread = socket_.start_background_task(Save_Data.convertSymbolsToTime,request.values['users'], request.args['TimetableID'], True, request.values['credentials'] if 'credentials' in request.values else False)
            #Save_Data.convertSymbolsToTime(request.values['users'], request.args['TimetableID'], True, request.values['credentials'] if 'credentials' in request.values else False)
            return "Done"

@app.route('/timetableFNcalc',methods =['GET'])
@login_required
def get_FN_fromRange():
    if request.method=='GET':
        if 'TimetableID' in request.args:
            return {"data" : readTimetable.Get_FN_by_Timetable(request.args['TimetableID'])}
        if 'ID' in request.args:
            return {"data" : readTimetable.Get_FN_draft(request.args['ID'])}

@app.route('/timePersDuplicates',methods =['GET'])
@login_required
def get_DuplicatesInRange():
    if request.method=='GET':
        if 'TimetableID' in request.args:
            if 'ALL_Duplicates' in request.args:
                return {"data" :  readTimetable.JSON_off_Duplicates_pers(readTimetable.Get_Duplicates_pers_listInRange_of_Timetable(request.args['TimetableID']))}
            else:
                return {"data" :  readTimetable.JSON_off_Duplicates_pers(readTimetable.Get_Duplicates_pers_by_Timetable(request.args['TimetableID']))}
        if 'ID' in request.args:
            if 'ALL_Duplicates' in request.args:
                return {"data" :  readTimetable.JSON_off_Duplicates_pers(readTimetable.Get_Duplicates_pers_listInRange_of_Draft(request.args['ID']))}
            else:
                return {"data" :  readTimetable.JSON_off_Duplicates_pers(readTimetable.Get_Duplicates_pers_by_Draft(request.args['ID']))}

@app.route('/StateTimetable',methods = ['POST'])
@login_required
@hrnestAccess
def ChangeStateofTimetable():
    if request.method=='POST' and 'Timetable' in request.values and 'State' in request.values:
        ok= hrnest.change_timetable_status(request.values['Timetable'],request.values['State'])
        return ok
    return {"data" : 'Error no mandatory parameters'}


@app.route('/TimetablesFromAPI',methods = ['POST'])
@login_required
@hrnestAccess
def GetAPITimetable():
    if request.method=='POST' and 'Date_from' in request.values and 'Date_to' in request.values:
        result= get_timetable_ALL(request.values['Date_from'], request.values['Date_to'])        
        return result
    return {"data" : 'Error no mandatory parameters'}


@app.route('/CreateTimetable',methods = ['POST'])
@login_required
@hrnestAccess
def CreateTimetable():
    if request.method=='POST' and 'Timetables' in request.values:
        result = Create_new_Timetable(request.values['Timetables'])
        ok= hrnest.change_timetable_status(int(result),'Approved')
        return result

@app.route('/CheckIsValidCredentials',methods = ['POST'])
@login_required
def CheckCredentialsISvalid():
    if request.method=='POST':
        if all (k in request.values.to_dict(flat=False) for k in ("login","password")):
            return {"data" :integr.check_AccessToTimetable(request.values['login'],request.values['password'])}
        else :
            return {"data" : 'Error no mandatory parameters'}

@app.route('/IncerasePersonChanges',methods = ['POST'])
@login_required
@hrnestAccess
def IncerasePersonChanges():
    if request.method == 'POST' or request.method == 'PUT':      
        if 'users' in request.values and 'TimetableID' in request.args and not 'Transaction' in request.args :
            tmp = writeUserTimetable.IncerasePersonChanges(request.values['users'],request.args['TimetableID'],True)
            return {"data" :tmp}
        elif 'users' in request.values and 'TimetableID' in request.args and 'Transaction' in request.args :
            tmp = writeUserTimetable.IncerasePersonChanges(request.values['users'],request.args['TimetableID'],True,request.args['Transaction'])
            return {"data" :tmp}


            