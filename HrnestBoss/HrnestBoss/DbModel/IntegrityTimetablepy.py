from HrnestBoss import socket_
import HrnestBoss.controlers.Migrate as hr2
import HrnestBoss.controlers.TimeTablecontroler as timeTbl
import json
import datetime
import time
from datetime import datetime,timedelta


#Check List of changes in timetable List
def Changes_Timetable_List(AllowChanges):
  try:
    print('Start Checking Timetables List in WWW')
    WWWTimetables= Merge_All_types_of_Timetables() 
    if WWWTimetables!='Login incorrect':
        DBTimetables= timeTbl.readTimetable.parse_Timetable_to_JSON(timeTbl.readTimetable.TableGetAll())
        socket_.sleep(0)
        tblADD=[]
        tblERA=[]
        tblMOD=[]
        #print('Iterate elements')
        # Find Timetables not exist in WWW 
        for tbl in WWWTimetables:
          try: 
            
            #print(tbl['status'])
            if tbl['status'] != 0 and tbl['status'] != 'Rejected' and tbl['status'] !='Deleted':                
                rec=[item for item in DBTimetables if item.get('hrnest_id')==int(tbl['id'])]
                #print('Hrnest Table => ' + tbl['title'] + ' state => ' + tbl['status']) 
                if not rec:               
                    recordobj={                
                        'hrnest_id':int(tbl['id']),
                        'title':tbl['title'],
                        'date_from':tbl['dateFrom'],
                        'date_to':tbl['dateTo'],               
                    }
                    tblADD.append(recordobj)
                else:                 
                    if rec[0]['title']!=tbl['title'] or rec[0]['date_from']!=tbl['dateFrom'] or rec[0]['date_to']!=tbl['dateTo']:
                        recordobj={
                            'id':rec[0]['id'],
                            'hrnest_id':int(tbl['id']),
                            'title':tbl['title'],
                            'date_from':tbl['dateFrom'],
                            'date_to':tbl['dateTo'],               
                        }
                        tblMOD.append(recordobj)
          except Exception as e:
              print('Error in row => ' + tbl + ' Errr' + e)
        #Find timetables to erase in DB (have hrnestId parameter ON and dont exist in www
        for rec in DBTimetables:
            if rec['hrnest_id']!=None:
                fnd=[item for item in WWWTimetables if item.get('id')==rec['hrnest_id']]
                date_to=datetime.strptime(rec['date_to'],'%Y-%m-%d')
                date_from=datetime.strptime(rec['date_from'],'%Y-%m-%d')
                if not fnd:
                    recordobj={
                        'id':rec['id'],
                        'hrnest_id':rec['hrnest_id'],
                        'title':rec['title'],
                        'date_from':date_from.strftime('%Y-%m-%d'),
                        'date_to':date_to.strftime('%Y-%m-%d')
                    }
                    tblERA.append(recordobj)
            socket_.sleep(0)
        chk=False
        retVar=[]
        if not tblERA and not tblMOD and not tblADD:
            retVar='No changes'
        else:
            if tblERA:       
                if AllowChanges:
                    result=timeTbl.writeTimetable.erase(tblERA,False)
            if tblMOD:
                if AllowChanges:                   
                    result=timeTbl.writeTimetable.modify(tblMOD,False)
            if tblADD:
                if AllowChanges:                    
                    result=timeTbl.writeTimetable.add(tblADD,False)
            
            time.sleep(int((len(tblERA) + len(tblMOD) + len(tblADD)) * 0.01))
            retVar.append({'Need_Confirm': not AllowChanges,
                        'Erased': tblERA,
                        'Modified' : tblMOD,
                        'Added' : tblADD})
    else :
        retVar='Login to www incorrect'
  except Exception as e:
            print(str(e))               
            return "Changes_Timetable_List "+ str(e)
  return retVar
def Merge_All_types_of_Timetables():
  try:
    Mergedtable_data=[]
    #s=hr2.hrwww.log_me_in_WWW()
    
    date_from=(datetime.now()-timedelta(365*4)).strftime('%Y-%m-%d')
    date_to=(datetime.now()+timedelta(365*2)).strftime('%Y-%m-%d') 
        #--------------------------------------------------------------------------------------
        # Deprecated => now data are exported from WWW by api
        #-------------------------------------------------------------------------------------
        #Mergedtable_data= Get_ONETimetable_List(s,'https://hrnest.io/WorkTime/TimeTable?StartDateIn=' + date_from + '&EndDateIn=' + date_to) + Get_ONETimetable_List(s,'https://hrnest.io/WorkTime/TimeTable/Draft?StartDateIn=' + date_from + '&EndDateIn=' + date_to) + Get_ONETimetable_List(s,'https://hrnest.io/WorkTime/TimeTable/Saved?StartDateIn=' + date_from + '&EndDateIn=' + date_to)
    Mergedtable_dataNEW = hr2.get_timetable_ALL(date_from, date_to)
    #print(Mergedtable_dataNEW)
    
    
    #Some unusual Timetables
    #Mergedtable_data=Mergedtable_data+Get_ONETimetable_List(s,'https://hrnest.io/WorkTime/TimeTable/Deleted') 
    #Mergedtable_data=Mergedtable_data+Get_ONETimetable_List(s,'https://hrnest.io/WorkTime/TimeTable/Rejected')
  except Exception as e:
            print(str(e))               
            return "Merge_All_types_of_Timetables "+str(e)   
  return Mergedtable_dataNEW

#------------------------------------------------------------------------------------------------
# Deprecated
#------------------------------------------------------------------------------------------------
def Get_ONETimetable_List(s,_url): 
  try:
    upload=hr2.hrwww.get_www_conetnt(s,_url)
    # Create a data dictionary to store the data.
    data = {}
    TableList = upload.find("table", attrs={"class": "table no-footer border-table"})    
    headings = []
    for th in TableList.thead.find_all("th"):
        if th.text.replace('\n', ' ').strip()!='':
            # remove any newlines and extra spaces from left and right
            headings.append(th.text.replace('\n', ' ').strip())
        else:
            headings.append('id')
     # Get all the rows of table
    table_data = []
    for tr in TableList.tbody.find_all("tr"): # find all tr's from table's tbody
            t_row = {}           
            for td, th in zip(tr.find_all("td"), headings):
                if td.text.replace('\n', '').strip()!='':
                    t_row[th] = td.text.replace('\n', '').strip()
                else:
                    if hasattr(td.input,'value'):
                        t_row[th] = td.input['value']
                    else:
                        t_row['b']=''
            table_data.append(t_row)
    # Put the data for the table with his heading.
  except Exception as e:
            print(str(e))               
            return "Get_ONETimetable_Lists "+str(e) 
  return table_data

def Get_List_of_timetables_in_RangeDates(dFrom,dTo):    
    timeFrom=datetime.strptime(dFrom,'%Y-%m-%d')
    timeTo=datetime.strptime(dTo,'%Y-%m-%d')
    return timeTbl.readTimetable.TimetableByRangeDates(timeFrom,timeTo)