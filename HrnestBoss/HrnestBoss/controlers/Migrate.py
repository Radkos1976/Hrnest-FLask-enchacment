# coding=utf-8
import HrnestBoss.controlers.hrnest as hrwww
import datetime
import requests
from time import sleep
from datetime import datetime,date, timedelta
import json
import pytz

def get_timetable_ALL(dateFrom, dateTo):
	url = "https://api.hrnest.io/api/v1/Timetable" 
	payload = { "filter" : { 			
				"dateFrom": dateFrom,
				"dateTo": dateTo
		}
	}
	result=hrwww.make_api_call(url, hrwww.API_user, hrwww.API_pwd,payload)
	return result

# Replace a timetable item
def put_Item_Timetable(timetableId, uid, timeFrom, timeTo, comment, breakMinutes, commentOnly, method):
			
	url = "https://api.hrnest.io/api/v1/Timetable/Item"
	payload = { 'search': {
				'timetableId': timetableId,
				'userId': uid
			},
			'model': {
				'timeFrom': timeFrom + '.000' + get_hours_offset_to_UTC(timeFrom),
				'timeTo': (timeTo if timeFrom!=timeTo else timeTo[:-4] + '1:00') + '.000'  + get_hours_offset_to_UTC(timeTo),
				'comment': comment,
				'breakMinutes': breakMinutes,
				'commentOnly': commentOnly
			}
		}
	print(payload)
	if method == 'POST':
		result = hrwww.make_api_post(url, hrwww.API_user, hrwww.API_pwd,payload)
	else:
		result = hrwww.make_api_delete(url, hrwww.API_user, hrwww.API_pwd,payload)
	return result


# get employes from Hrnest
def get_ALLemployes(active = True):
	url = "https://api.hrnest.io/api/v1/Employee"
	payload = {"filter": {"isActive": active}}
	result=hrwww.make_api_call(url, hrwww.API_user, hrwww.API_pwd,payload)	
	return result

#get persons in timetable
def get_TimetableEmployes (timetable_id):	
	url = "https://api.hrnest.io/api/v1/Timetable/Employees"
	payload = {"search": {"timetableId": timetable_id}}
	result=hrwww.make_api_call(url, hrwww.API_user, hrwww.API_pwd,payload)
	return result

def get_Company():
	url = "https://api.hrnest.io/api/v1/Company"
	payload = {}
	result=hrwww.make_api_call(url, hrwww.API_user, hrwww.API_pwd,payload)
	return result

def get_Departments():
	url = "https://api.hrnest.io/api/v1/Company/Departments"
	payload = {}
	result=hrwww.make_api_call(url, hrwww.API_user, hrwww.API_pwd,payload)	
	return result

def get_request_Types():	
	url = "https://api.hrnest.io/api/v1/Request/AvailableTypes"
	payload = {}
	result=hrwww.make_api_call(url, hrwww.API_user, hrwww.API_pwd,payload)	
	return result

def get_Timetables_list_all():
	s=hrwww.log_me_in_WWW()
	timetables = []

# get requests of persons in date range is none print only active request
def get_RequestOfPerson(dateFrom=None,dateTo=None):
	payload = {}
	if dateFrom!=None and dateTo!=None:
		date_from= dateFrom +'T00:00:01.511Z'                           
		date_to= dateTo +'T23:59:59.511Z'     
		payload = { 'filter': {'dateFrom': dateFrom,'dateTo': dateTo}}
	url = "https://api.hrnest.io/api/v1/Request"	
	result=hrwww.make_api_call(url, hrwww.API_user, hrwww.API_pwd,payload)
	return result

def get_hours_offset_to_UTC(dFrom):
	
	local_tz = pytz.timezone('Europe/Berlin')
	tm=datetime.strptime(dFrom,'%Y-%m-%dT%H:%M:%S')
	offset_seconds= local_tz.utcoffset(tm).seconds
	offset_hours = offset_seconds / 3600.0
	return "{}{:02}:{:02d}".format('+-'[int(offset_hours)<0], abs(int(offset_hours)), abs(int((offset_hours % 1) * 60)))

def change_Value_to_UTC(dfrom):
	target_tz = pytz.timezone('UTC')
	local_tz = pytz.timezone('Europe/Berlin')
	tm=local_tz.localize(datetime.strptime(dfrom,'%Y-%m-%dT%H:%M:%S'))
	return target_tz.normalize(tm).strftime('%Y-%m-%dT%H:%M:%S')

def Create_new_Timetable(_payload):				
	payload = json.loads(_payload)
	url = "https://api.hrnest.io/api/v1/Timetable"
	#result= payload
	result = hrwww.make_api_post(url, hrwww.API_user, hrwww.API_pwd,payload)
	return str(result)

def get_working_day_info_by_API(day):
	url = "https://api.hrnest.io/api/v1/Company/IsWorkingday"
	payload = {"search": {"date": day }}
	result = hrwww.make_api_call(url, hrwww.API_user, hrwww.API_pwd, payload)
	return result

def change_timetable_status(timetable_id, status):
	url = "https://api.hrnest.io/api/v1/Timetable/Status"
	payload = { 'search': {
				'timetableId': timetable_id				
			},
			'model': {
				'status': status
			}
		}
	result = hrwww.make_api_patch(url, hrwww.API_user, hrwww.API_pwd,payload)
	return result

def get_calendar_Days(dFrom, dTo):
	url = "https://api.hrnest.io/api/v1/Employee/CalendarItems" #?dateFrom=" + dFrom + "&dateTo=" + dTo
	payload = { "filter" : { 			
				"dateFrom": dFrom, # + 'T00:00:00.000Z',
				"dateTo": dTo # + 'T00:00:00.000Z'
			}}
	result = hrwww.make_api_call(url, hrwww.API_user, hrwww.API_pwd, payload)
	return result