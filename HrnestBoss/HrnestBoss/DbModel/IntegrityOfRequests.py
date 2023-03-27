# coding=utf-8
from HrnestBoss import app, db
from HrnestBoss import socket_
import HrnestBoss.controlers.Migrate as hr2
import HrnestBoss.controlers.User_Requestcontoler as req
import HrnestBoss.controlers.TimeTablecontroler as tmtbl
from HrnestBoss.DbModel.models import shift_type
from datetime import datetime

#---------------------------------------------------
#Update persons status based on requests from hrnest

#Get request from WWW
def Get_request(Type_call,Dfrom,Dto):
    if Type_call=='Range':
            return hr2.get_RequestOfPerson(Dfrom,Dto)
    else:
            return hr2.get_RequestOfPerson()
    
# Create tables list of Add,Modyfications,Delete on Table User_Request in DB
# Type request => active or range /// if is in range you must specify dateFrom and dateTo and check first edited Timetable ID
def Update_Requ_DB(Type_call,Dfrom=None,Dto=None,TmtblID=None):
    try: 
        Update_Request_types()
        reqWWW=Get_request(Type_call,Dfrom,Dto)
        if Dfrom==None:
            Dfrom=datetime.now().strftime('%Y-%m-%d')
        if Dto==None:
            Dfrom=datetime.now().strftime('%Y-%m-%d')
        reqDB=req.read_UserRequest.Parse_rquest_to_JSON(req.read_UserRequest.ReadInRange(Dfrom,Dto)) 
        socket_.sleep(0)
        tblADD=[]
        tblERA=[]
        tblMOD=[]
        for rec in reqWWW:           
            rc=[item for item in reqDB if int(item.get('number'))==int(rec['number'])]        
            if not rc:
                if rec['status'][0:8]!='Rejected':
                    recordobj={
                'number' : rec['number'] ,
                'status' :rec['status'] ,
                'userId':rec['userId'] ,
                'typeId' :rec['typeId'] ,
                'isWholeDay' :rec['isWholeDay'] ,
                'dateFrom':rec['dateFrom'] ,
                'dateTo':rec['dateTo'] ,
                'title':rec['title'] 
                }
                    tblADD.append(recordobj)
            else:
                if rec['status'][0:8]!='Rejected':                    
                    date_from= rc[0]['dateFrom'].strftime('%Y-%m-%d')                            
                    date_to=rc[0]['dateTo'].strftime('%Y-%m-%d')
                    if str(rc[0]['status'])!=str(rec['status']) or str(rc[0]['userId'])!=str(rec['userId']) or int(rc[0]['typeId'])!=int(rec['typeId']) or bool(rc[0]['isWholeDay'])!=bool(rec['isWholeDay']) or date_from!=rec['dateFrom'] or date_to!=rec['dateTo'] or rc[0]['title']!=rec['title']  :
                        recordobj={
                            'number' : rc[0]['number'] ,
                            'status' :rec['status'] ,
                            'userId':rec['userId'] ,
                            'typeId' :rec['typeId'] ,
                            'isWholeDay' :rec['isWholeDay'] ,
                            'dateFrom':rec['dateFrom'] ,
                            'dateTo':rec['dateTo'] ,
                            'title':rec['title'] 
                            }  
                        tblMOD.append(recordobj)
                else:
                    recordobj={
                            'number' : rc[0]['number'] ,
                            'status' :rec['status'] ,
                            'userId':rec['userId'] ,
                            'typeId' :rec['typeId'] ,
                            'isWholeDay' :rec['isWholeDay'] ,
                            'dateFrom':rec['dateFrom'] ,
                            'dateTo':rec['dateTo'] ,
                            'title':rec['title'] 
                            }
                    tblERA.append(recordobj)
        for rec in reqDB:
          # dont erase enumerable and users not in www requests index <0
          if int(rec['number'])>0:
            fnd=[item for item in reqWWW if int(item.get('number'))==int(rec['number'])]
            if not fnd:
                # check type of request                
                recordobj={
                'number' : rec['number'] ,
                'status' :rec['status'] ,
                'userId':rec['userId'] ,
                'typeId' :rec['typeId'] ,
                'isWholeDay' :rec['isWholeDay'] ,
                'dateFrom':rec['dateFrom'] ,
                'dateTo':rec['dateTo'] ,
                'title':rec['title'] 
                }
                tblERA.append(recordobj)
        chk=False    
        retVar=[]      

        if not tblERA and not tblMOD and not tblADD:
            retVar='No changes'
        else:
            if tblERA:    
                print(req.write__UserRequest.DelRequest(tblERA,False))
            if tblMOD:               
                print(req.write__UserRequest.ModifyRequest(tblMOD,False))
            if tblADD:               
                print(req.write__UserRequest.AddRequest(tblADD,False))   
            retVar.append({ 'Erased': tblERA,
                            'Modified' : tblMOD,
                            'Added' : tblADD})
        req.write__UserRequest.update_Emp_idByUID()
        socket_.sleep(0)
    except Exception as e:
            print('Request_USER_DAYS_OFF ERR : ' + str(e.args))
            print(
                    type(e).__name__,          # TypeError
                    __file__,                  # /tmp/example.py
                    e.__traceback__.tb_lineno  # 2
                )
            return "Request_USER_DAYS_OFF "+str(e.args)
    return retVar
def check_existing_Timetables_FOR_requests(Dfrom=None,Dto=None,TmtblID=None):
    if TmtblID!=None :
        # First check selected Timetable in selected range
        Update_Selected_Timetable(TmtblID,Dfrom,Dto)
    all_Timetbl=tmtbl.readTimetable.parse_Timetable_to_JSON(tmtbl.readTimetable.TableGetAll)
def Update_Selected_Timetable(timetableID,Dfrom,Dto):
    print(timteableID)
# update standard request types
def Update_Request_types():
    reqTypes=hr2.get_request_Types()
    for item in reqTypes:
        shfT=shift_type.query.filter(shift_type.req_type_id==item['id']).all()
        if len(shfT)==0:
            #fix new request name change name='u' to name=None and set gradient 
            a=shift_type(name=None,description=item['title'],emp_type=0,type_source='request',iswholeday=True,req_type_id=item['id'],time_from=None,time_to=None,enumerable=None,info='linear-gradient( 110deg, rgb(161, 108, 214, 0.5) 60%, rgb(161, 108, 200, 0.5) 60%)')
            db.session.add(a)
            db.session.commit()
        socket_.sleep(0)
        
        