# coding=utf-8

from flask import request
from HrnestBoss import app, login , hrnestAccess, socket_
from flask_login import current_user, login_required
import HrnestBoss.controlers.User_Requestcontoler as reqst
import HrnestBoss.controlers.shift_typecontoler as shiftT
import HrnestBoss.routes.WsServer
from HrnestBoss.controlers.TimeCalculationsControler import Save_Data
import os

@login_required
@app.route('/request', methods = ['GET','POST','PUT','DELETE'])
def req():
    #Get metods to query data
    if request.method == 'GET':
        #Query Request types
        if 'Request_types' in request.args:
            # get standard request types from Hrnest
            if request.args['Request_types']=='www':
                   return {"data":sorted(shiftT.Read.To_JSON(shiftT.Read.Get_RequestWWW_types(),True),key=lambda x : x['req_type_id'],reverse=False),
                           "Request_type":request.args['Request_types']}
            elif request.args['Request_types']=='enum':
                   return {"data":sorted(shiftT.Read.To_JSON(shiftT.Read.Get_RequestEnumerable_types(),True),key=lambda x : x['req_type_id'],reverse=False),
                           "Request_type":request.args['Request_types']}
            elif request.args['Request_types']=='request':
                   return {"data":sorted(shiftT.Read.To_JSON(shiftT.Read.Get_Request_types(),True),key=lambda x : x['req_type_id'],reverse=False),
                           "Request_type":request.args['Request_types']}
            elif request.args['Request_types'] == 'info':
                   return {"data":sorted(shiftT.Read.To_JSON(shiftT.Read.Get_Request_info(),True),key=lambda x : x['req_type_id'],reverse=False),
                           "Request_type":request.args['Request_types']}
            elif request.args['Request_types']=='onWWW':
                   return {"data":sorted(shiftT.Read.To_JSON(shiftT.Read.Get_External_types() + shiftT.Read.Get_Timetable_types_emptype(1),True),key=lambda x : x['id'],reverse=False),
                           "Request_type":request.args['Request_types']}
            elif request.args['Request_types']=='external':
                   return {"data":shiftT.Read.To_JSON(shiftT.Read.Get_External_types(),True),
                           "Request_type":request.args['Request_types']}
            elif request.args['Request_types']=='timetable':
                if 'emp_type' in request.args:
                    return {"data":sorted(shiftT.Read.To_JSON(shiftT.Read.Get_Timetable_types_emptype(request.args['emp_type']),True),key=lambda x : x['id'],reverse=False),
                           "Request_type":request.args['Request_types']}
                else:
                   return {"data":sorted(shiftT.Read.To_JSON(shiftT.Read.Get_Timetable_types(),True),key=lambda x : x['emp_type'],reverse=False),
                           "Request_type":request.args['Request_types']}
            else:
                   return 'Err => no selected Request_type'
        else:
            #read requests from DB
            if ('date_from' and 'date_to') in request.args:
                if 'uid' in request.args:
                    if 'type' in request.args:
                        if request.args['type']=='www':
                            return {"data":reqst.read_UserRequest.Parse_rquest_to_JSON(reqst.read_UserRequest.ReadInRangeUID(request.args['date_from'],request.args['date_to'],request.args['uid'])),
                                     "date_from": request.args['date_from'],
                                     "date_to":request.args['date_to'],
                                     "type":request.args['type']}
                        elif request.args['type']=='enum':
                            return {"data":reqst.read_UserRequest.Parse_rquest_to_JSON(reqst.read_UserRequest.ReadEnumerableInRangeUID(request.args['date_from'],request.args['date_to'],request.args['uid'])),
                                     "date_from": request.args['date_from'],
                                     "date_to":request.args['date_to'],
                                     "type":request.args['type']
                                     }
                        elif request.args['type']=='all':
                            return  {"data":reqst.read_UserRequest.Parse_rquest_to_JSON(reqst.read_UserRequest.ReadInAllUID(request.args['date_from'],request.args['date_to'],request.args['uid'])),
                                      "date_from": request.args['date_from'],
                                      "date_to":request.args['date_to'],
                                      "type":request.args['type']}
                        else:
                            return 'Err => no selected type'
                    else:
                        return  {"data":reqst.read_UserRequest.Parse_rquest_to_JSON(reqst.read_UserRequest.ReadInAllUID(request.args['date_from'],request.args['date_to'],request.args['uid'])),
                                      "date_from": request.args['date_from'],
                                      "date_to":request.args['date_to'],
                                      "type":'All'}
                else :
                    if 'type' in request.args:
                        if request.args['type']=='www':
                            return {"data":reqst.read_UserRequest.Parse_rquest_to_JSON(reqst.read_UserRequest.ReadInRangeWWW(request.args['date_from'],request.args['date_to'])),
                                     "date_from": request.args['date_from'],
                                     "date_to":request.args['date_to'],
                                     "type":request.args['type']}
                        elif request.args['type']=='enum':
                            if 'TimetableID' in request.args:
                                return {"data":reqst.read_UserRequest.Parse_rquest_to_JSON(reqst.read_UserRequest.ReadEnumerableInRangeByTimetable(request.args['date_from'],request.args['date_to'],request.args['TimetableID'])),
                                     "date_from": request.args['date_from'],
                                     "date_to":request.args['date_to'],
                                     "type":request.args['type'],
                                     "TimetableID":request.args['TimetableID']
                                     }
                            else:
                                return {"data":reqst.read_UserRequest.Parse_rquest_to_JSON(reqst.read_UserRequest.ReadEnumerableInRange(request.args['date_from'],request.args['date_to'])),
                                     "date_from": request.args['date_from'],
                                     "date_to":request.args['date_to'],
                                     "type":request.args['type']
                                     }
                        elif request.args['type']=='all':
                            if 'TimetableID' in request.args:
                                return  {"data":reqst.read_UserRequest.Parse_rquest_to_JSON(reqst.read_UserRequest.ReadInTimetableID(request.args['date_from'],request.args['date_to'],request.args['TimetableID'])),
                                      "date_from": request.args['date_from'],
                                      "date_to":request.args['date_to'],
                                      "type":request.args['type'],
                                      "TimetableID":request.args['TimetableID']}
                            else:
                                return  {"data":reqst.read_UserRequest.Parse_rquest_to_JSON(reqst.read_UserRequest.ReadInRange(request.args['date_from'],request.args['date_to'])),
                                      "date_from": request.args['date_from'],
                                      "date_to":request.args['date_to'],
                                      "type":request.args['type']}
                    else:
                        return {"data": reqst.read_UserRequest.Parse_rquest_to_JSON(reqst.read_UserRequest.ReadInRange(request.args['date_from'],request.args['date_to'])),
                            "date_from": request.args['date_from'],
                            "date_to":request.args['date_to'],
                            "type":'All'}                            
            else:
                return {"data": reqst.read_UserRequest.Parse_rquest_to_JSON(reqst.read_UserRequest.ReadALL()),
                        "type":'All'}
    if request.method == 'POST' :
        if current_user.is_hrnest_access:
            if 'Request_types' in request.args:
                print('Code For Modify enumerable requests type')
            else:
                #modify request in range and uid
                if 'Request_users' in request.values:
                    calback = reqst.write__UserRequest.ModifyRequest(request.values['Request_users'],True,True )
                    returned = socket_.start_background_task(Save_Data.UpdateTimetablesByEnumerableRequest,request.values['Request_users'],True)
                    #read requests from DB
                    #return reqst.write__UserRequest.Mod_Enumerable_request(request.values['Request_users'],True)
                    return calback
        else:
            return {'message': 'Access Denied'}
    if request.method == 'PUT' :
        if current_user.is_hrnest_access:
            if 'Request_types' in request.args:
                print('Code For Modify enumerable requests type')
            else:
                #modify request in range and uid
                if 'Request_users' in request.values:
                    calback = reqst.write__UserRequest.Add_Enumerable_request(request.values['Request_users'],True)
                    returned = socket_.start_background_task(Save_Data.UpdateTimetablesByEnumerableRequest,request.values['Request_users'],True)
                    #read requests from DB                
                    return calback
        else:
            return {'message': 'Access Denied'}
    if request.method == 'DELETE' :
        if current_user.is_hrnest_access:
            if 'Request_types' in request.args:
                print('Code For Modify enumerable requests type')
            else:
                #modify request in range and uid
                if 'Request_users' in request.values:
                    calback = reqst.write__UserRequest.DelRequest(request.values['Request_users'],True)
                    returned = socket_.start_background_task(Save_Data.UpdateTimetablesByEnumerableRequest,request.values['Request_users'],True)
                    #delete request to DB
                    return calback
        else:
            return {'message': 'Access Denied'}

@login_required
@app.route('/getlicenses', methods = ['GET'])
def getlicenses():
    if request.method == 'GET' :
            if licenseKey.license==0:
                  try:
                    with open("./licenses.txt", "r") as f:
                        licenseKey.license=f.read()
                  finally:
                      print('No License file')
            return {"licenses":str(licenseKey.license)}

@login_required
@hrnestAccess
@app.route('/savelicenses', methods = ['GET'])
def putlicenses():
    if request.method == 'GET' :
        if 'license' in  request.values:            
            licenseKey.license=request.values['license']
            with open('./licenses.txt', 'w') as f:
                 f.write(request.values['license'])            
            return {"licenses":licenseKey.license}

@login_required
@app.route('/getlimitchanges', methods = ['GET'])
def getlimitchanges():
    if request.method == 'GET' :
            if limit_changes.limit==0:
                  try:
                    with open("./limitchanges.txt", "r") as f:
                        limit_changes.limit=f.read()
                  finally:
                      print('No License file')
            return {"limitchanges":str(limit_changes.limit)}

@login_required
@hrnestAccess
@app.route('/savelimitchanges', methods = ['GET'])
def putlimitchanges():
    if request.method == 'GET' :
        if 'limitchanges' in  request.values:            
            limit_changes.limit=request.values['limitchanges']
            with open('./limitchanges.txt', 'w') as f:
                 f.write(request.values['limitchanges'])            
            return {"limitchanges":limit_changes.limit}
class licenseKey:
    license=0
class limit_changes:
    limit=0