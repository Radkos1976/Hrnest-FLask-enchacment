# coding=utf-8
from HrnestBoss import socket_
from HrnestBoss.DbModel.models import users,work_group,shift_type
from HrnestBoss.DbModel.models import user2timetable,shift
from HrnestBoss import app,db
from sqlalchemy.sql import exists
from sqlalchemy import or_,and_
import uuid
import datetime
import json
from time import sleep


# CLass for read User model and User_Timetable model
class readUser():
    #Get All Workgroups Informations
    def Workgropup_All():
        return db.session.query(work_group).all()

    #Get ALL Users with connections on wwwHrnest => filter for active / not acttive users
    def UsersGetALL_www(filter = [1]):
        return db.session.query(users,work_group).join(work_group,work_group.id==users.default_wrkgroup, isouter=True).\
                    filter(and_(users.uid != None, users.active.in_(filter))).order_by(users.last_name.asc()).all()

    #Get ALL User model 
    def UsersGetALL_simple(filter = [1]):
        return db.session.query(users,work_group).join(work_group,work_group.id==users.default_wrkgroup, isouter=True).\
                    filter(users.active.in_(filter)).order_by(users.last_name.asc()).all()

    #Get ALL User model by filter workgroup ID
    def UsersGetALL_simple_Work_group(wrkgrp, filter = [1]):
        return db.session.query(users,work_group).join(work_group,work_group.id==users.default_wrkgroup, isouter=True).\
                    filter(and_(work_group.id==wrkgrp,users.active.in_(filter))).order_by(users.last_name.asc()).all()

    #Get User model by filter id
    def User_Id_simple(queryType,param):
        tmp_par=list(param.split(","))
        return db.session.query(users,work_group).join(work_group,work_group.id==users.default_wrkgroup, isouter=True).\
                    filter(getattr(users, queryType).in_(tuple(tmp_par))).order_by(users.last_name.asc()).all()

    def Users_simple_IdTimetable_With_no_Shift_rec_By_queryparam(queryType,param,Timetable_id):
        tmp_par=list(param.split(","))
        tmtble=Timetable_id.split(',') if type(Timetable_id) is str else [Timetable_id]
        return db.session.query(users, user2timetable,work_group).select_from(user2timetable).filter(user2timetable.timetable_id.in_(tmtble)).\
                join(users,users.id==user2timetable.user_id).filter(getattr(users, queryType).in_(tuple(tmp_par))).\
                join(work_group, work_group.id==users.default_wrkgroup, isouter=True).\
                filter(~ exists().where(shift.user_id==user2timetable.id)).\
                order_by(users.last_name.asc(), users.first_name.asc(), users.id.asc()).all()

    def Users_simple_IdTimetable_With_no_Shift_rec_By_WORKGROUP(Timetable_id,wrkgrp):
        tmtble=Timetable_id.split(',') if type(Timetable_id) is str else [Timetable_id]
        return db.session.query(users,user2timetable,work_group).select_from(user2timetable).filter(user2timetable.timetable_id.in_(tmtble)).\
                join(users,users.id==user2timetable.user_id).join(work_group,work_group.id==users.default_wrkgroup ,isouter=True).\
                filter(work_group.id==wrkgrp).filter(~ exists().where(shift.user_id==user2timetable.id)).\
                order_by(users.last_name.asc(),users.first_name.asc(),users.id.asc()).all()

    #Get users from timetable with no record in shift table    
    def Users_simple_IdTimetable_With_no_Shift_rec(Timetable_id):
        tmtble=Timetable_id.split(',') if type(Timetable_id) is str else [Timetable_id]
        return db.session.query(users,user2timetable,work_group).select_from(user2timetable).filter(user2timetable.timetable_id.in_(tmtble)).\
                join(users,users.id==user2timetable.user_id).join(work_group,work_group.id==users.default_wrkgroup ,isouter=True).\
                filter(~ exists().where(shift.user_id==user2timetable.id)).\
                order_by(users.last_name.asc(),users.first_name.asc(),users.id.asc()).all()

    #Get ALL User_Timetable model by filter Timetable_id
    def UsersGetALL_Timetable(Timetable_id):
        tmtble=Timetable_id.split(',') if type(Timetable_id) is str else [Timetable_id]
        return db.session.query(users,user2timetable,work_group,shift,shift_type).select_from(user2timetable).filter(user2timetable.timetable_id.in_(tmtble)).\
                join(users, users.id==user2timetable.user_id).join(shift,shift.user_id==user2timetable.id,isouter=True).\
                join(work_group,work_group.id==users.default_wrkgroup ,isouter=True).\
                join(shift_type,shift.type_id==shift_type.id).order_by(users.last_name.asc(),users.first_name.asc(),users.id.asc()).all()

    #Get ALL User_Timetable model by filter Timetable_id,workgroup ID
    def UsersGetALL_Timetable_Work_group(Timetable_id,wrkgrp):
        tmtble=Timetable_id.split(',')
        return db.session.query(users,user2timetable,work_group,shift,shift_type).select_from(user2timetable).filter(user2timetable.timetable_id.in_(tmtble)).\
                join(users,users.id==user2timetable.user_id).join(shift,shift.user_id==user2timetable.id,isouter=True).\
                filter(shift.date.between(d_from,d_to)).\
                join(work_group,work_group.id==users.default_wrkgroup).filter(work_group.id==wrkgrp).\
                join(shift_type,shift.type_id==shift_type.id).order_by(users.last_name.asc(),users.first_name.asc(),users.id.asc()).all()

    #Get User_Timetable model by filter id,Timetable_id,date ranges
    def User_Id_Timetable(queryType,param,Timetable_id):
        tmp_par=list(param.split(","))
        tmtble=Timetable_id.split(',') if type(Timetable_id) is str else [Timetable_id]
        return  db.session.query(users,user2timetable,work_group,shift,shift_type).select_from(user2timetable).filter(user2timetable.timetable_id.in_(tmtble)).\
                join(users,users.id==user2timetable.user_id).filter(getattr(users, queryType).in_(tuple(tmp_par))).\
                join(shift,shift.user_id==user2timetable.id,isouter=True).\
                join(work_group,work_group.id==users.default_wrkgroup ,isouter=True).\
                join(shift_type,shift.type_id==shift_type.id).order_by(users.last_name.asc(),users.first_name.asc(),users.id.asc()).all()

    #Get ALL User_Timetable model by filter Timetable_id,date ranges
    def UsersGetALL_Timetable_rangeDate(Timetable_id,str_from,str_to):
        #convert string 'yyyy-mm-dd' format to date
        d_from=datetime.datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime.datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))
        tmtble=Timetable_id.split(',') if type(Timetable_id) is str else [Timetable_id]
        return db.session.query(users,user2timetable,work_group,shift,shift_type).select_from(user2timetable).filter(user2timetable.timetable_id.in_(tmtble)).\
                join(users,users.id==user2timetable.user_id).join(shift,shift.user_id==user2timetable.id,isouter=True).\
                filter(shift.date.between(d_from,d_to)).join(work_group,work_group.id==users.default_wrkgroup ,isouter=True).\
                join(shift_type,shift.type_id==shift_type.id).order_by(users.last_name.asc(),users.first_name.asc(),users.id.asc()).all()

    #Get ALL User_Timetable model by filter Timetable_id,date ranges and workgrop ID
    def UsersGetALL_Timetable_rangeDate_Work_group(Timetable_id,str_from,str_to,wrkgrp):
        #convert string 'yyyy-mm-dd' format to date
        d_from=datetime.datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime.datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))
        tmtble=Timetable_id.split(',') if type(Timetable_id) is str else [Timetable_id]
        return db.session.query(users,user2timetable,work_group,shift,shift_type).select_from(user2timetable).filter(user2timetable.timetable_id.in_(tmtble)).\
                join(users,users.id==user2timetable.user_id).join(shift,shift.user_id==user2timetable.id,isouter=True).\
                filter(shift.date.between(d_from,d_to)).join(work_group,work_group.id==users.default_wrkgroup).filter(work_group.id==wrkgrp).\
                join(shift_type,shift.type_id==shift_type.id).order_by(users.last_name.asc(),users.first_name.asc(),users.id.asc()).all()

    #Get User_Timetable model by filter id,Timetable_id,date ranges
    def User_Id_Timetable_rangeDate(queryType,param,Timetable_id,str_from,str_to):
        #convert string 'yyyy-mm-dd' format to date
        d_from=datetime.datetime(int(str_from[0:4]),int(str_from[5:7]),int(str_from[8:10]))
        d_to=datetime.datetime(int(str_to[0:4]),int(str_to[5:7]),int(str_to[8:10]))
        tmtble=Timetable_id.split(',') if type(Timetable_id) is str else [Timetable_id]
        tmp_par=list(param.split(","))
        return  db.session.query(users,user2timetable,work_group,shift,shift_type).select_from(user2timetable).filter(user2timetable.timetable_id.in_(tmtble)).\
                join(users,users.id==user2timetable.user_id).filter(getattr(users, queryType).in_(tuple(tmp_par))).join(shift,shift.user_id==user2timetable.id,isouter=True).\
                filter(shift.date.between(d_from,d_to)).join(work_group,work_group.id==users.default_wrkgroup ,isouter=True).\
                join(shift_type,shift.type_id==shift_type.id).order_by(users.last_name.asc(),users.first_name.asc(),users.id.asc()).all()

    # Convert datatable object list to JSON
    def parse_Workgroup_JSON(workgroup):
        arr_data=[]
        try:
          for records in workgroup:
            recordOBJ={
                'id':records.id,
                'name':records.name,
                'description':records.description,
                'leader':records.leader
                }
            if records.name=='':
                recordOBJ.update({'name': str(records.id) + ' Descr NULL'})
            arr_data.append(recordOBJ)            
        except Exception as e:
            print("Error parse_Workgroup_JSON" + str(e))               
            return "Error parse_Workgroup_JSON" + str(e)
        return arr_data


    def parse_ONE_user_to_Object(user):
        record =user[0]
        recordobj = {
                        'id':record.users.id,
                        'uid':record.users.uid,
                        'emp_id':record.users.emp_id,
                        'first_name':record.users.first_name,
                        'last_name':record.users.last_name,
                        'default_wrkgroup':record.users.default_wrkgroup,
                        'position':record.users.position,                        
                        'snet':record.users.snet,                        
                        'table_wrkgroup':-100,
                        'changes_counter':0,
                        'wrk_group':'',
                        'wrk_description':'',
                        'wrk_leader':''
                    }
        if hasattr(record, 'user2timetable'): 
                    if hasattr(record.user2timetable, 'default_wrkgroup'):
                        recordobj.update({
                            'table_wrkgroup':record.user2timetable.default_wrkgroup
                        })
                    if hasattr(record.user2timetable, 'changes'):
                        recordobj.update({
                            'changes_counter':record.user2timetable.changes
                        })
                    # Add workgroup information if exist
        if record.users.default_wrkgroup is not None:
                        try:
                            recordobj.update({
                            'wrk_group':record.work_group.name,
                            'wrk_description':record.work_group.description,
                            'wrk_leader':record.work_group.leader
                          })
                        except:
                            if errStr.find('Something wrong with saving data workgroup ID ' + str(record.users.default_wrkgroup) + ' dont exist...')==-1:
                                print('Something wrong with saving data workgroup ID ' + str(record.users.default_wrkgroup) + ' dont exist...')
                                errStr=errStr + 'Something wrong with saving data workgroup ID ' + str(record.users.default_wrkgroup) + ' dont exist...'
        return recordobj
    def parse_User_to_JSON(user, typeQuery, ID_type='name'):
            arr_data=[]            
            present_user=''
            recordobj =''
            errStr=''
            try: 
              
              for record in user:                
                #Part for query Users schema
                if not typeQuery=='UsersTimetable' : 
                    recordobj = {
                        'id':record.users.id,
                        'uid':record.users.uid,
                        'emp_id':record.users.emp_id,
                        'first_name':record.users.first_name,
                        'last_name':record.users.last_name,
                        'default_wrkgroup':record.users.default_wrkgroup,
                        'position':record.users.position,                        
                        'snet':record.users.snet,                        
                        'table_wrkgroup':-100,
                        'changes_counter':0,
                        'wrk_group':'',
                        'wrk_description':'',
                        'wrk_leader':'',
                        'active': record.users.active,
                    }
                    
                    if hasattr(record, 'user2timetable'): 
                            if hasattr(record.user2timetable, 'default_wrkgroup'):
                                recordobj.update({
                                'table_wrkgroup':record.user2timetable.default_wrkgroup
                                })
                            if hasattr(record.user2timetable, 'changes'):
                                recordobj.update({
                                'changes_counter':record.user2timetable.changes
                            })
                    # Add workgroup information if exist
                    if record.users.default_wrkgroup is not None:
                        try:
                            recordobj.update({
                            'wrk_group':record.work_group.name,
                            'wrk_description':record.work_group.description,
                            'wrk_leader':record.work_group.leader
                          })
                        except:
                            if errStr.find('Something wrong with saving data workgroup ID ' + str(record.users.default_wrkgroup) + ' dont exist...')==-1:
                                print('Something wrong with saving data workgroup ID ' + str(record.users.default_wrkgroup) + ' dont exist...')
                                errStr=errStr + 'Something wrong with saving data workgroup ID ' + str(record.users.default_wrkgroup) + ' dont exist...'
                    arr_data.append(recordobj)
                else:
                    #Part for query Users and shifs schema
                    if present_user!=record.users.id:
                        if present_user!='':                                        
                            arr_data.append(recordobj)                            
                        #New Person
                        recordobj = {
                            'id':record.users.id,
                            'uid':record.users.uid,
                            'emp_id':record.users.emp_id,
                            'full_name':record.users.last_name +' ' +record.users.first_name,                           
                            'default_wrkgroup':record.users.default_wrkgroup,
                            'position':record.users.position,
                            'table_wrkgroup':-100,
                            'changes_counter':0,
                            'wrk_group':'',
                            'wrk_description':'',
                            'wrk_leader':'',
                            'snet':record.users.snet,
                            'timetable_id':record.user2timetable.timetable_id,
                            'active': record.users.active,
                        }
                        if hasattr(record, 'user2timetable'): 
                            if hasattr(record.user2timetable, 'default_wrkgroup'):
                                recordobj.update({
                                'table_wrkgroup':record.user2timetable.default_wrkgroup
                                })
                            if hasattr(record.user2timetable, 'changes'):
                                recordobj.update({
                                'changes_counter':record.user2timetable.changes
                            })
                        # Add workgroup information if exist
                        if record.users.default_wrkgroup is not None:                           
                               try:
                                    recordobj.update({
                                    'wrk_group':record.work_group.name,
                                    'wrk_description':record.work_group.description,
                                    'wrk_leader':record.work_group.leader
                                    })
                               except:
                                    if errStr.find('Something wrong with saving data workgroup ID ' + str(record.users.default_wrkgroup) + ' dont exist...')==-1:
                                        print('Something wrong with saving data workgroup ID ' + str(record.users.default_wrkgroup) + ' dont exist...')
                                        errStr=errStr + 'Something wrong with saving data workgroup ID ' + str(record.users.default_wrkgroup) + ' dont exist...'
                        arr_shift=[]
                    present_user=record.users.id
                    if hasattr(record, 'shift'):
                        if hasattr(record.shift, 'date'):
                            # if use ID_type record is different 
                            if ID_type=='name':  
                                if len(record.shift.emp_type)>0:
                                    recordobj[record.shift.date.strftime('%Y-%m-%d')]={'value':record.shift_type.name,'err':json.loads(record.shift.emp_type.replace("\'", "\"")),'emp_type':record.shift_type.emp_type}
                                else:
                                    recordobj[record.shift.date.strftime('%Y-%m-%d')]={'value':record.shift_type.name,'err':'','emp_type':record.shift_type.emp_type}
                            elif ID_type=='nonenum':
                                if len(record.shift.emp_type)>0:
                                    recordobj[record.shift.date.strftime('%Y-%m-%d')]={'value':record.shift_type.id,'err':json.loads(record.shift.emp_type.replace("\'", "\""))}
                                else:
                                    recordobj[record.shift.date.strftime('%Y-%m-%d')]={'value':record.shift_type.id,'err':''}
                            else:
                                    recordobj[record.shift.date.strftime('%Y-%m-%d')]=record.shift_type.id 
              #Add Last record in Users Shift Data
              if  typeQuery=='UsersTimetable' :               
                arr_data.append(recordobj)              
            except Exception as e:
                print("Error in parse_User_to_JSON " + str(e))
                print(
                    type(e).__name__,          # TypeError
                    __file__,                  # /tmp/example.py
                    e.__traceback__.tb_lineno  # 2
                )
                return "Error in parse_User_to_JSON " + str(e)
                return "Error in parse_User_to_JSON " + str(e)            
            return arr_data
#Class for write users data
class writeUser():
    # Add custom user with no exist in hrnest
    def AddUser(users_rec,JSON): 
        rows=0
        errrows=0
        rwexist=0
        if JSON:
            user=json.loads(users_rec)
        else:
            user=users_rec                
        for uer in user:
            try:
                    wrk='';
                    #Check if usera have uid => this field is reserved for hrnset users               
                    try:
                        #Check if FirstName LastName FileExistsError
                        chk=users.query.filter(users.first_name==str(uer['first_name']).upper()).\
                            filter(users.last_name==str(uer['last_name']).upper()).all()
                        if len(chk)==0:
                            # add optional fields to db model
                            if not 'position' in uer:
                                uer.update(position=None)
                            if not 'snet' in uer:
                                uer.update(snet=None)
                            if not 'default_wrkgroup' in uer:
                                uer.update(default_wrkgroup=None)
                            if not 'active' in uer:
                                uer.update(active=True)
                            else:
                                #check existence of workgroup
                                if wrk.find('_' + str(uer['default_wrkgroup']) + '_')==-1 and str(uer['default_wrkgroup'])!=None:
                                    
                                    ch=work_group.query.filter(work_group.id==uer['default_wrkgroup']).all()
                                    if len(ch)==0:
                                        p=work_group(id=uer['default_wrkgroup'],name='',description='',leader='')
                                        db.session.add(p)
                                        db.session.commit()
                                    wrk=wrk+'_' + str(uer['default_wrkgroup']) + '_'
                            if not 'uid' in uer:
                                uer.update(uid=None)
                            p=users(uid=uer['uid'],emp_id=str(uer['emp_id']),first_name=str(uer['first_name']),last_name=str(uer['last_name']),position=str(uer['position']),snet=str(uer['snet']),default_wrkgroup=uer['default_wrkgroup'],active=uer['active'])
                            db.session.add(p)
                            db.session.commit()
                            socket_.sleep(0)
                            rows=rows+1
                        else : rwexist=rwexist+1
                    except Exception as e:
                        print(str(e))
                        errrows=errrows+1 
                    socket_.sleep(0)
            except Exception as e:
                print( "Error in saving NEW data " + str(e))
                return "Error in saving NEW data " + str(e)
        
        tmp={'user':user}
        socket_.emit('UserAdd',{'data':tmp},broadcast=True)
        return "Rows_Add :"+ str(rows) + "   Not_Saved_rows(duplicate FirstName LastName) :"+ str(rwexist) + "   Errors :"+ str(errrows)
    # Modify User records
    def ModifyUser(users_rec,JSON): 
        rows=0
        errrows=0
        rwexist=0
        query_param=''
        if JSON:
            user=json.loads(users_rec)
        else:
            user=users_rec        
        try:
            for uer in user:
                if 'emp_id' in uer: query_param='emp_id'
                if 'uid' in uer: query_param='uid'
                if 'id' in uer: query_param='id'                
                chk=users.query.filter(getattr(users, query_param)==uer[query_param]).all()
                if len(chk)>0:
                     for rec in chk:
                         try:
                            # add optional fields to db model
                            if 'snet' in uer:
                                rec.snet=str(uer['snet'])
                            if 'default_wrkgroup' in uer:
                                rec.default_wrkgroup=uer['default_wrkgroup']
                            if 'position' in uer:
                                rec.position=str(uer['position'])                          
                            if 'first_name' in uer:
                                    rec.first_name=str(uer['first_name'])
                            if 'last_name' in uer:
                                    rec.last_name=str(uer['last_name'])
                            if 'emp_id' in uer:
                                    rec.emp_id=str(uer['emp_id']).upper()
                            if 'active' in uer:
                                    rec.active=uer['active']
                            db.session.commit()
                            socket_.sleep(0)
                            rows=rows+1
                         except:
                            errrows=errrows+1
                else : rwexist=rwexist+1 
                socket_.sleep(0)
        except Exception as e:
            print("Error in rows Modify" + str(e))               
            return "Error in rows Modify" +str(e)
        tmp={'user':user}
        socket_.emit('UserMod',{'data':tmp},broadcast=True)
        return "Rows_Modify :"+ str(rows) + "   Not_Modified_rows(dont exist) :"+ str(rwexist) + "   Errors :"+ str(errrows)
    # Delete USER from DB
    def DelUser(users_rec,JSON):
        try:
            if JSON:
                record=json.loads(users_rec)
            else:
                record=users_rec
            
            for tmr in record:
                tmp=users.query.filter(users.id==tmr['id']).all()
                for tm in tmp:
                    db.session.delete(tm)
                    db.session.commit()
                    socket_.sleep(0)
                socket_.sleep(0)
                #commit session => update cascade erase all linked records from another tables
            
        except Exception as e:
            print("Error in rows Erase " + str(e))
            return "Error in rows Erase " + str(e)
        tmp={'user':record}
        socket_.emit('UserDel',{'data':tmp},broadcast=True)
        return 'Done'
    # Add Work Group Record
    def AddWorkgroup(workgroup_rec,JSON): 
        rows=0
        errrows=0
        rwexist=0
        try:
            if JSON:
                workgroup=json.loads(workgroup_rec)
            else:
                workgroup=workgroup_rec                  
            for wrk in workgroup:
                try:                   
                        if 'id' in wrk: 
                            p=work_group(id=wrk['id'],name=wrk['name'],description=str(wrk['description']),leader=str(wrk['leader']))
                        else:
                            p=work_group(name=str(wrk['name']),description=str(wrk['description']),leader=str(wrk['leader']))
                        db.session.add(p)
                        db.session.commit()
                        socket_.sleep(0)
                        rows=rows+1                    
                except:
                    errrows=errrows+1
                socket_.sleep(0)            
            tmp={'workgroup':workgroup}
            socket_.emit('WorkgroupAdd',{'data':tmp},broadcast=True)
        except Exception as e:
            print("Error in Add Workgroup" + str(e))               
            return "Error in Add Workgroup" + str(e)
        return "Rows_Add :"+ str(rows) + "   Not_Saved_rows(duplicate FirstName LastName) :"+ str(rwexist) + "   Errors :"+ str(errrows)
    # Modify Work Group Record
    def ModifyWorkgroup(workgroup_rec,JSON): 
        rows=0
        errrows=0
        rwexist=0
        query_param=''
        if JSON:
            wrks=json.loads(workgroup_rec)
        else:
            wrks=workgroup_rec
        try:
            for wrk in wrks:
                if 'name' in wrk: query_param='name'
                if 'id' in wrk: query_param='id'                
                chk=work_group.query.filter(getattr(work_group, query_param)==wrk[query_param]).all()
                if len(chk)>0:
                     for rec in chk:
                        # Modify optional fields to db model
                        if 'description' in wrk:
                            rec.description=str(wrk['description'])
                        if 'leader' in wrk:
                            rec.leader=str(wrk['leader'])
                        if 'name' in wrk:
                            rec.name=str(wrk['name'])                        
                        db.session.commit()
                        socket_.sleep(0)
                     rows=rows+1
                else : rwexist=rwexist+1
                socket_.sleep(0)
            tmp={'workgroup':wrks}
            socket_.emit('WorkgroupModified',{'data':tmp},broadcast=True)
        except Exception as e:
            print(str("Error in Modify Workgroup" + e))               
            return "Error in Modify Workgroup" + str(e)
        return "Rows_Modify :"+ str(rows) + "   Not_Modified_rows(dont exist) :"+ str(rwexist) + "   Errors :"+ str(errrows)    
class writeUserTimetable:
    def IncerasePersonChanges(usersTimetable_rec,TimetableID,JSON,TransactionGUID=''):
        if JSON:
            users_rec=json.loads(usersTimetable_rec)
        else:
            users_rec=usersTimetable_rec
        for usr in users_rec:
            #check is user Exist 
           if 'id' in usr and 'add_counter' in usr:    
                chk=user2timetable.query.filter(user2timetable.user_id==int(usr['id']))\
                    .filter(user2timetable.timetable_id==int(TimetableID)).all()
                if len(chk)>0 :
                    for rc in chk:                      
                        if rc.changes!=None:
                            rc.changes=rc.changes+int(usr['add_counter'])
                        else:
                           rc.changes=int(usr['add_counter'])
                    db.session.commit()
                    socket_.sleep(0)
           socket_.sleep(0)
        return 'Done'
    def AddMOD_Users_to_Timetable(usersTimetable_rec,TimetableID,JSON,TransactionGUID=''):
      try:
        guidexist=''
        #usersTimetable_rec must contains uid of person
        if JSON:
            users_rec=json.loads(usersTimetable_rec)
        else:
            users_rec=usersTimetable_rec
        for usr in users_rec:
            #check is user Exist 
           if 'id' in usr and guidexist.find(';'+str(usr['id']))==-1:    
                chk=user2timetable.query.filter(user2timetable.user_id==int(usr['id']))\
                    .filter(user2timetable.timetable_id==int(TimetableID)).all()
                if not len(chk)>0 :                    
                    guidexist=guidexist+';'+str(usr['id'])
                    guid =uuid.uuid1()
                    p=user2timetable(id=guid,user_id=usr['id'],timetable_id=int(TimetableID),changes=0)
                    db.session.add(p)
                    db.session.commit()
                    socket_.sleep(0)
                    
                if 'date' in usr and ('type_id' in usr or 'type_id_int' in usr) and usr['date'] != 'active' :
                #Add \ modify data in shifts by type_id

                 work_date= datetime.datetime.strptime(usr['date'],'%Y-%m-%d')
                 chk=shift.query.select_from(user2timetable)\
                    .filter(user2timetable.user_id==int(usr['id']))\
                    .filter(user2timetable.timetable_id==int(TimetableID))\
                    .join(shift,shift.user_id==user2timetable.id)\
                    .filter(shift.date==work_date).all()
                 types=[]
                 if 'type_id' in usr:
                     if 'emp_type' in usr:
                        types=shift_type.query.filter(and_(shift_type.name == usr['type_id'],shift_type.emp_type == usr['emp_type'])).all()
                     else :
                        #default emp_type is 0 or 1
                        types=shift_type.query.filter(and_(shift_type.name == usr['type_id'],or_(shift_type.emp_type ==0,shift_type.emp_type ==1))).all()
                 else:                    
                    types=shift_type.query.filter(shift_type.id==usr['type_id_int']).all()
                 if len(chk)>0:
                    for rc in chk:
                      for rg in types:
                        #If new type is blank record delete it from db
                        if rg.name == '':
                            db.session.delete(rc)
                            db.session.commit()
                            socket_.sleep(0)
                        else:
                            #Mod
                            rc.type_id=rg.id
                            if 'emp_err' in usr:
                                rc.emp_type=usr['emp_err']
                            db.session.commit()                        
                 else:
                    for rg in types:
                        chk1=user2timetable.query.filter(user2timetable.user_id==int(usr['id']))\
                            .filter(user2timetable.timetable_id==int(TimetableID)).all()
                        for rst in chk1:
                            guid1 =uuid.uuid1()
                            emp_err=''
                            if 'emp_err' in usr:
                                emp_err=usr['emp_err']
                            p = shift(id=guid1,user_id=rst.id,date=work_date,type_id=int(rg.id),emp_type=emp_err)
                            db.session.add(p)
                            db.session.commit()
                            socket_.sleep(0)
                socket_.sleep(0)
           writeUserTimetable.Delete_Blank_Record()
           socket_.sleep(0)
           
      except Exception as e:
                print("Error in saving modified / added data " + str(e))
                print(
                    type(e).__name__,          # TypeError
                    __file__,                  # /tmp/example.py
                    e.__traceback__.tb_lineno  # 2
                )
                return "Error in saving data " + str(e)
      if TransactionGUID=='':
           guid1 =uuid.uuid1()
      else:
          guid1=TransactionGUID
      tmp={'users':users_rec,'TimetableID':TimetableID,'guid':str(guid1)}
      socket_.emit('UsersTimetableModified',{'data':tmp},broadcast=True)
      return "Done:" + str(guid1)
    def Del_Users_from_Timetable(usersTimetable_rec,TimetableID,JSON,TransactionGUID=''):
      try:
        guidexist=''
        #usersTimetable_rec must contains uid of person
        if JSON:
            users_rec=json.loads(usersTimetable_rec)
        else:
            users_rec=usersTimetable_rec
        for usr in users_rec:
           # Delete all data about user in timetable ? If date exist erase one record
           if 'date' in usr:
                 work_date= datetime.datetime.strptime(usr['date'],'%Y-%m-%d')
                 chk=shift.query.select_from(user2timetable)\
                    .filter(and_(user2timetable.user_id==int(usr['id']), user2timetable.timetable_id==int(TimetableID)))\
                    .join(shift,shift.user_id==user2timetable.id)\
                    .filter(shift.date==work_date).all()
                 for rc in chk:
                     db.session.delete(rc)
                     db.session.commit()
                     socket_.sleep(0)
           else:
                #check is user Exist           
                if 'id' in usr and guidexist.find(';'+str(usr['id']))==-1:    
                    chk=user2timetable.query.filter(user2timetable.user_id==int(usr['id']))\
                        .filter(user2timetable.timetable_id==int(TimetableID)).all()               
                    if len(chk)>0 :                   
                        for p in chk:
                            guidexist=guidexist+';'+str(usr['id'])                                  
                            db.session.delete(p)
                            db.session.commit()
                            socket_.sleep(0)
                            socket_.emit('UsersTimetableDeleted',{'data':usr['id']},broadcast=True)
           socket_.sleep(0)
        writeUserTimetable.Delete_Blank_Record()
        socket_.sleep(0)
      except Exception as e:
                print("Error in deleting data " + str(e))
                return "Error in deleting data " + str(e)
      if TransactionGUID=='':
           guid1 =uuid.uuid1()
      else:
          guid1=TransactionGUID
      tmp={'users':users_rec,'TimetableID':TimetableID,'guid':str(guid1)}
      socket_.emit('UsersTimetableModified',{'data':tmp},broadcast=True)
      tmp={'users':users_rec,'TimetableID':TimetableID,'guid':str(guid1)}
      socket_.emit('UsersTimetableDelete',{'data':tmp},broadcast=True)
      return "Done:" + str(guid1)
    # delete blank records in shift table 
    def Delete_Blank_Record():
      try:        
        tmp=shift.query.select_from(shift_type)\
                    .filter(shift_type.name=='')\
                    .join(shift,shift.type_id==shift_type.id)\
                    .all()
        for tm in tmp:
              db.session.delete(tm)                
              db.session.commit()
              socket_.sleep(0)
      except Exception as e:
            print(str(e))
            return "Error in rows update_Emp_idByUID" + str(e)