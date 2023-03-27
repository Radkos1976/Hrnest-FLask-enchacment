# coding=utf-8
from flask import request,json
from HrnestBoss import app,hrnestAccess
from HrnestBoss.controlers.Usercontroler import readUser,writeUser
from HrnestBoss.controlers.TimeTablecontroler import readTimetable
from HrnestBoss.controlers.TimeCalculationsControler import Read_Data
from flask_login import current_user, login_required

# route user get
# Types Data => only persons records {switch not 'UsersTimetable' args } or persons records + data about shift {switch 'UsersTimetable'=timetble.id args }  =>
# Filtering Data => If you want get all records {switch 'UsersGetALL'}, 
# in all view enabled fields to limit records by date_range only on view with shift data  {switch 'date_from' and 'date_to' args} or and filter by work_group {switch 'work_group'}
# If you want to see one pearsons data use switch 'emp_id' or 'uid' or 'id' and not 'UsersGetALL'
# Get data about users two main metods get persons only and persons by default timetable
@app.route('/user', methods = ['GET','POST','PUT'])
@login_required
def user():
    #Get metods to query data
    if request.method == 'GET':
        # Users metod non query about timetable
        if not 'UsersTimetable' in request.args:
            #Metods to retieve User type ALL users
            if 'UsersGetALL' in request.args:
                 #check another filter wrkgroup
                if 'work_group' in request.args:
                    user=readUser.UsersGetALL_simple_Work_group(request.args['work_group'])
                else:
                    user=readUser.UsersGetALL_simple()
            #Metods to retieve User type by id fields
            elif 'emp_id' or 'uid' or 'id' and not 'UsersTimetable' in request.args:
                query_param=''
                if 'emp_id' in request.args: query_param='emp_id' 
                if 'uid' in request.args: query_param='uid'
                if 'id' in request.args: query_param='id'
                if query_param!='':
                    user=readUser.User_Id_simple(query_param,request.args[query_param])
                else:
                    user=[]
        #Users in selected timetable metods
        elif 'UsersTimetable' in request.args:
            #Metods to retieve Users Type and timetable shifts data by selected Timetable query of All Users
            if ('UsersTimetable' and 'UsersGetALL') in request.args:
                #check request date range exist
                if ('date_from' and 'date_to') in request.args:
                    #check another filter wrkgroup
                    if 'work_group' in request.args:
                        user=readUser.UsersGetALL_Timetable_rangeDate_Work_group(request.args['UsersTimetable'], request.args['date_from'], request.args['date_to'], request.args['work_group']) + readUser.Users_simple_IdTimetable_With_no_Shift_rec_By_WORKGROUP(request.args['UsersTimetable'], request.args['work_group'])
                    else:
                        user=readUser.UsersGetALL_Timetable_rangeDate(request.args['UsersTimetable'],request.args['date_from'],request.args['date_to']) + readUser.Users_simple_IdTimetable_With_no_Shift_rec(request.args['UsersTimetable'])                       
                else:
                     #check another filter wrkgroup
                    if 'work_group' in request.args:
                        user=readUser.UsersGetALL_Timetable_Work_group(request.args['UsersTimetable'],request.args['work_group']) + readUser.Users_simple_IdTimetable_With_no_Shift_rec_By_WORKGROUP(request.args['UsersTimetable'],request.args['work_group'])
                    else:
                        user=readUser.UsersGetALL_Timetable(request.args['UsersTimetable'])+ readUser.Users_simple_IdTimetable_With_no_Shift_rec(request.args['UsersTimetable']) 
            #Metods to retieve Users Type and timetable shifts data by selected query user id fields 
            elif 'emp_id' or 'uid' or 'id' and 'UsersTimetable' in request.args:
                query_param=''
                if 'emp_id' in request.args: query_param='emp_id'
                if 'uid' in request.args: query_param='uid'
                if 'id' in request.args: query_param='id'
                if query_param!='':
                    #check request date range exist
                    if ('date_from' and 'date_to') in request.args:
                        user=readUser.User_Id_Timetable_rangeDate(query_param,request.args[query_param],request.args['UsersTimetable'],request.args['date_from'],request.args['date_to'])+readUser.Users_simple_IdTimetable_With_no_Shift_rec_By_queryparam(query_param,request.args[query_param],request.args['UsersTimetable'])
                    else:                    
                        user=readUser.User_Id_Timetable(query_param,request.args[query_param],request.args['UsersTimetable']) + readUser.Users_simple_IdTimetable_With_no_Shift_rec_By_queryparam(query_param,request.args[query_param],request.args['UsersTimetable'])
                else:
                    user=[]
            else:
                return 'Not all Query parameters'
        #Managing retieved data
        if len(user)>0:
            if 'UsersTimetable' in request.args: 
                type_query='UsersTimetable'
                if ('date_from' and 'date_to') in request.args:
                    d_from = request.args['date_from']
                    d_to = request.args['date_to']
                else:
                    tmp_var = readTimetable.Tabletible_by_id(request.args['UsersTimetable'])
                    d_from = tmp_var[0].date_from.strftime('%Y-%m-%d')
                    d_to = tmp_var[0].date_to.strftime('%Y-%m-%d')
            else: 
                type_query = 'Simple' 
                d_from = ''
                d_to = ''          
            #print('Users_count' + str(len(user)))
            return {"date_from":d_from,
                    "date_to":d_to,
                    "data" :readUser.parse_User_to_JSON(user,type_query,'name')}
        else:
            #Query return no data
            return 'Query result contains zero elements',204
    # Post metods to modify data
    #Modify existing record if fields are from hrnest you can modify only data {work_group,position,snet}
    elif request.method == 'POST':
        if current_user.is_hrnest_acces:
            if 'ModUser' in request.args:
                if 'users' in request.values:                  
                     return writeUser.ModifyUser(request.values['users'],True)
                else:
                     return 'No elements found',204
            elif 'ModWork_group' in request.args:
                if 'groups' in request.values:
                     req = writeUser.ModifyWorkgroup(request.values['groups'],True)
                     return req
                else:
                     return 'No elements found',204
            else :
                return 'No Command',204
        else:
            return {'message': 'Access Denied'}
    # AddUserNotHrnest atribute adds custom persons only to DB ( uid field in user model dont exist) 
    elif request.method=='PUT':
        if current_user.is_hrnest_acces:
             if 'AddUserNotHrnest' in request.args:
                if 'users' in request.values:                 
                     return writeUser.AddUser(request.values['users'],True)
                else:
                     return 'No elements found',204
             elif 'AddUserNotHrnest' in request.args:
                if 'groups' in request.values:                 
                     return writeUser.AddWorkgroup(request.values['groups'],True)
                else:
                     return 'No elements found',204
             else :
                return 'No Command',204
        else:
            return {'message': 'Access Denied'}

@app.route('/daysoff', methods = ['GET'])
@login_required
@hrnestAccess
def DaysOff():
    if 'dateTo' in request.args and 'dateFrom' in request.args:
        return {'DaysOff' :Read_Data.get_days_off(request.values['dateTo'],request.values['dateFrom'])}
        #return {'DaysOff' :Read_Data.getCalendarItemsOff(request.values['dateTo'],request.values['dateFrom'])}
    return 'No Command',204