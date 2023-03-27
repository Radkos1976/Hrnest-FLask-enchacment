# coding=utf-8
import HrnestBoss.controlers.Migrate as hr2
import HrnestBoss.controlers.Usercontroler as user
import json
import datetime
from datetime import datetime

# Check list of persons for existence in Hrnest if Person not exist in WWW clear UID fields in DB
# Add List of pearsons from www 
# Persons with guid must exist in www HRNEST 
def Check_PersonsInWWW(AllowChanges):
  try:
    print('Start Checking List of Persons in WWW')
    dbUsr=user.readUser.parse_User_to_JSON(user.readUser.UsersGetALL_www([1, 0]),'Users')  
    
    wwwUsrActive= hr2.get_ALLemployes(True)
    for rec in wwwUsrActive:
        rec['active'] = True 
    wwwUsrInActive= hr2.get_ALLemployes(False)
    for rec in wwwUsrInActive:
        rec['active'] =  False
    
    wwwUsr = wwwUsrInActive + wwwUsrActive
    
    value=Update_Departments()   
    tblADD=[]
    tblERA=[]
    tblMOD=[]
    
    #Check Persons not exist in WWW
    for rec in wwwUsr:         
        rc=[item for item in dbUsr if str(item.get('uid'))==str(rec['id'])]
        Fname=rec['firstName']
        Lname=rec['lastName']
        if not rc:                         
            recordobj={
                'uid': str(rec['id']),
                'emp_id': Lname[0:3].upper() + Fname[0:3].upper(),
                'first_name': Fname,
                'last_name': Lname,
                'default_wrkgroup':rec['departmentId'],
                'active' : rec['active'],
                }
            tblADD.append(recordobj)
        else:
            if rc[0]['emp_id']!=Lname[0:3].upper() + Fname[0:3].upper() or rc[0]['first_name']!=Fname or rc[0]['last_name']!= Lname or rc[0]['default_wrkgroup']!=rec['departmentId'] or rc[0]['active']!=rec['active']:
                recordobj={
                'id':rc[0]['id'],
                'uid': str(rec['id']),
                'emp_id': Lname[0:3].upper() + Fname[0:3].upper(),
                'first_name': Fname,
                'last_name': Lname,
                'default_wrkgroup':rec['departmentId'],
                'active' : rec['active'],
                }                
                tblMOD.append(recordobj)
    #Find pearsons to erase in DB (have uId parameter ON and dont exist in www)
    for rec in dbUsr:
        if rec['uid']!=None:
            fnd=[item for item in wwwUsr if str(item.get('id'))==str(rec['uid'])]
            Fname=rec['first_name']
            Lname=rec['last_name']
            if not fnd:
                recordobj={
                'id':rec['id'],
                'uid': str(rec['uid']),
                'emp_id': Lname[0:3].upper() + Fname[0:3].upper(),
                'first_name': Fname,
                'last_name': Lname,
                'default_wrkgroup':rec['default_wrkgroup'],
                'active' : rec['active']
                }
                tblERA.append(recordobj) 
    chk=False 
   
    retVar=[]
    if not tblERA and not tblMOD and not tblADD:
        retVar='No changes'
    else:
        if tblERA:       
            if AllowChanges:
                print(user.writeUser.DelUser(tblERA,False))
        if tblMOD:
            if AllowChanges:
                print(user.writeUser.ModifyUser(tblMOD,False))
        if tblADD:
            if AllowChanges:
                print(user.writeUser.AddUser(tblADD,False))
   
        retVar.append({'Need_Confirm': not AllowChanges,
                        'Erased': tblERA,
                        'Modified' : tblMOD,
                        'Added' : tblADD})
  except Exception as e:
            print(str(e))               
            return "Check_PersonsInWWW "+str(e)
  return retVar 
# Update departments => only add to db ,modify in Db
def Update_Departments():
  try:
    dep= hr2.get_Departments()
    depDb=user.readUser.parse_Workgroup_JSON(user.readUser.Workgropup_All())
    tblADD=[]
    tblMOD=[]
    #Check Persons not exist in WWW
    for rec in dep:            
        rc=[item for item in depDb if item.get('id')==rec['id']]       
        if not rc:                         
            recordobj={                
                'id':rec['id'],
                'name':rec['name'],
                'description':'',
                'leader':''                
                }
            tblADD.append(recordobj)
        else:
            if rc[0]['name']!=rec['name'] :
                recordobj={
                'id':rec['id'],
                'name':rec['name'],
                'description': rc[0]['description'],
                'leader': rc[0]['leader']
                }
                print(recordobj)
                tblMOD.append(recordobj)
    chk=False
    retVar=[]
    if  not tblMOD and not tblADD:
        retVar='No changes'
    else:
        if tblMOD:
                user.writeUser.ModifyWorkgroup(tblMOD,False)
        if tblADD:
                user.writeUser.AddWorkgroup(tblADD,False)
   
        retVar.append({                        
                        'Modified' : tblMOD,
                        'Added' : tblADD})
  except Exception as e:
            print(str(e))               
            return "Update_Departments "+str(e)
  return retVar    
 