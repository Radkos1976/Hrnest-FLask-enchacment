# coding=utf-8
#hrnest.py

#biblioteki, ktore trzeba zainstalowac
#pip install requests
#pip install bs4


import requests
import json
import urllib
import pytz
import datetime
from datetime import datetime,date, timedelta
from ratelimit import limits, sleep_and_retry
from bs4 import BeautifulSoup
from threading import Thread, BoundedSemaphore
from time import sleep
import time
import queue

#hasla
API_user = 'sample api user'
API_pwd = 'sample password '
m_user = 'sample user'
m_pwd = 'sample password'

calls_wait = 0
pool = BoundedSemaphore(2)
Queue= queue.Queue()
##############SEKCJA HRNEST API

#podstawowa funkcja do wolania API HRNESTu
def make_api_call(url, user, pwd, payload):
	#auth = requests.auth.HTTPBasicAuth(user, pwd)
	global calls_wait	
	global pool

	calls_wait +=1
	params = json.dumps(payload)
	headers = {'Content-type': 'application/json',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Language': 'pl,en-US;q=0.7,en;q=0.3',
			'Accept-Encoding': 'gzip, deflate, br',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0'}

	pool.acquire(blocking=True)
	calls_wait -=1
	thread = CustomThread('GET', url, params, headers, user, pwd)
	thread.start()
	#thread.join()
	#res = thread.value
	res=Queue.get()
	#res = requests.get(url, data=params, headers=headers, auth=requests.auth.HTTPBasicAuth(user, pwd))
	return res.json()

def make_api_delete(url, user, pwd, payload):
	global calls_wait	
	global pool

	calls_wait +=1
	#auth = requests.auth.HTTPBasicAuth(user, pwd)	
	params = json.dumps(payload)
	headers = {'Content-type': 'application/json',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Language': 'pl,en-US;q=0.7,en;q=0.3',
			'Accept-Encoding': 'gzip, deflate, br',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0'}
	pool.acquire(blocking=True)
	calls_wait -=1
	thread = CustomThread('DELETE', url, params, headers, user, pwd)
	#thread = CustomThread('POST', url, params, headers, user, pwd)
	thread.start()
	#thread.join()
	#res = thread.value	
	res=Queue.get()
	return res.json()

def make_api_patch(url, user, pwd, payload):
	global calls_wait	
	global pool

	calls_wait +=1
	#auth = requests.auth.HTTPBasicAuth(user, pwd)	
	params = json.dumps(payload)
	headers = {'Content-type': 'application/json',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Language': 'pl,en-US;q=0.7,en;q=0.3',
			'Accept-Encoding': 'gzip, deflate, br',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0'}
	pool.acquire(blocking=True)
	calls_wait -=1
	thread = CustomThread('PATCH', url, params, headers, user, pwd)
	thread.start()
	#thread.join()
	#res = thread.value
	res=Queue.get()
	#res = requests.post(url, data=params, headers=headers, auth=requests.auth.HTTPBasicAuth(user, pwd))
	##### WYKOMENTOWANE LINIJKI DIAGNOSTYCZNE, DO UZYCIA W RAZIE PROBLEMOW
	# print("STATUS CODE", res.status_code) #kod odpowiedzi (chcemy 200)
	# print("REASON", res.reason) #powod odpowiedzi
	# print("TEXT", res.text) #tresc odpowiedzi w postaci tekstowej
	# print("JSON", res.json()) #obiekt odpowiedzi do przetwarzania maszynowego
	# print("URL", res.url) #w razie gdyby odpowiedz byla z innego adresu
	# print(dir(res)) #mozna sobie zobaczyc dodatkowe metody i atrybuty odpowiedzi
	return res.status_code

def make_api_post(url, user, pwd, payload):
	global calls_wait	
	global pool

	calls_wait +=1
	#auth = requests.auth.HTTPBasicAuth(user, pwd)	
	params = json.dumps(payload)
	headers = {'Content-type': 'application/json',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Language': 'pl,en-US;q=0.7,en;q=0.3',
			'Accept-Encoding': 'gzip, deflate, br',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0'}
	pool.acquire(blocking=True)
	calls_wait -=1
	thread = CustomThread('POST', url, params, headers, user, pwd)
	thread.start()
	#thread.join()
	#res = thread.value
	res=Queue.get()
	#res = requests.post(url, data=params, headers=headers, auth=requests.auth.HTTPBasicAuth(user, pwd))
	##### WYKOMENTOWANE LINIJKI DIAGNOSTYCZNE, DO UZYCIA W RAZIE PROBLEMOW
	# print("STATUS CODE", res.status_code) #kod odpowiedzi (chcemy 200)
	# print("REASON", res.reason) #powod odpowiedzi
	# print("TEXT", res.text) #tresc odpowiedzi w postaci tekstowej
	# print("JSON", res.json()) #obiekt odpowiedzi do przetwarzania maszynowego
	# print("URL", res.url) #w razie gdyby odpowiedz byla z innego adresu
	# print(dir(res)) #mozna sobie zobaczyc dodatkowe metody i atrybuty odpowiedzi
	if res.status_code==202 :
		return res.status_code
	return res.json()

# mechanizm semaforów dla wątków związanych z limitem requestów w HRNEST API => tylko dwa requesty na sekundę
class CustomThread(Thread):
    # constructor
    def __init__(self, method, url, params, headers, user, pwd):
        # execute the base constructor
        Thread.__init__(self)
        # set a default value
        self.method = method
        self.url = url
        self.params = params
        self.headers = headers
        self.auth = requests.auth.HTTPBasicAuth(user, pwd)
        self.value = None
 
    # function executed in a new thread
    def run(self):
        repeat = True
        while repeat:
            current = time.time()
            if self.method == 'DELETE':
                 self.value = requests.delete(self.url, data=self.params, headers=self.headers, auth=self.auth)           
            elif self.method == 'GET' :
                 self.value = requests.get(self.url, data=self.params, headers=self.headers, auth=self.auth)
            else:
                 self.value = requests.patch(self.url, data=self.params, headers=self.headers, auth=self.auth) if self.method == 'PATCH' else requests.post(self.url, data=self.params, headers=self.headers, auth=self.auth)
            print("Url => " ,self.url,": Status => ", self.value.status_code, " :Method => ", self.method) #kod odpowiedzi (chcemy 200)
            repeat = self.value.status_code == 429 
            if not repeat:
                 Queue.put(self.value) 
            delta = (time.time() - current) * 1000
            if delta < 1000:
                sleep((1000-delta)/1000)
        pool.release()

#funkcja do pobierania harmonogramu z HRNESTu przez API
def get_timetable_by_API(timetableID):
	url = "https://api.hrnest.io/api/v1/Timetable/Items"
	payload = {"search": {"timetableId": timetableID }}
	result = make_api_call(url, API_user, API_pwd, payload)
	#convert to timezone
	local_tz = pytz.timezone('UTC')
	target_tz = pytz.timezone('Europe/Berlin')
	for item in result:
		tmF=local_tz.localize(datetime.strptime(item['timeFrom'],'%Y-%m-%dT%H:%M:%S+00:00'))
		tmT=local_tz.localize(datetime.strptime(item['timeTo'],'%Y-%m-%dT%H:%M:%S+00:00'))
		item['timeFrom']=target_tz.normalize(tmF).strftime('%Y-%m-%dT%H:%M:%S+00:00')
		item['timeTo']=target_tz.normalize(tmT).strftime('%Y-%m-%dT%H:%M:%S+00:00')
	return result


def get_all_employees_by_API():
	url = "https://api.hrnest.io/api/v1/Employee"
	payload = {}
	result = make_api_call(url, API_user, API_pwd, payload)
	return result

def get_employee_details_by_API(empID):
	url = "https://api.hrnest.io/api/v1/Employee/"
	result = make_api_call(url + str(empID), API_user, API_pwd, None)
	return result



#przyklad pobrania harmonogramu z HRNESTu
# result = get_timetable_by_API(4866)
# print(result)
#przyklad pobrania listy uzytkownikow z HRNESTu
# result = get_all_employees_by_API()
# print(result)
#przyklad pobrania szczegolow uzytkownika z HRNESTu
# result = get_employee_details_by_API('51a4dfce-d023-44ed-b79e-00fd3d4ab89a')
# print(result)
#przyklad pobrania informacji o dniu - czy jest roboczy, z HRNESTu
# result = get_working_day_info_by_API('2021-02-17')
# print(result)

##############SEKCJA HRNEST.IO WWW

#funkcja do zalogowania sie na stronie. Zwraca obiekt z otwarta, zalogowana sesja
def log_me_in_WWW(user=m_user,pwd=m_pwd):
	logon_url = 'https://hrnest.io/Account/Logon'
	payload = {'UserName' : user,
			'Password' : pwd,
			'btn': 'confirm',
			'RememberMe': 'true'}
	s = requests.Session() #otwieramy sesje
	page = s.get(logon_url) #pobieramy strone logowania
	#przetwarzanie strony logowania by pozyskac token
	soup = BeautifulSoup(page.content, 'html.parser')
	token = None
	inputs = soup.findAll("input")
	for i in inputs:
		if type(i.attrs) is dict:
			if 'name' in i.attrs:
				if i.attrs['name'] == '__RequestVerificationToken':
					token = i.attrs['value']
					break

	payload["__RequestVerificationToken"] = token
	assert token is not None
	after_login_page = s.post(logon_url, data=payload)
	assert after_login_page.status_code == 200, "Expected Status 200; Got: " + after_login_page.status_code
	assert after_login_page.url == 'https://hrnest.io/Dashboard', "Expected url to be the start page; Got: "+ after_login_page.url 
	return s #zwracamy sesje, w ktorej udalo sie pomyslnie zalogowac. W ramach tej sesji bedzie mozna przechodzic na inne strony
#Get Timetables List from www
def get_www_conetnt(s,_url):	
	timetable_response = s.get(_url)
	soup = BeautifulSoup(timetable_response.content, 'html.parser')	
	return soup

#funkcja pobierajaca zawartosc strony z harmonogramem
def get_timetable_by_WWW(s, timetableId):
	timetable_pages_url = 'https://hrnest.io/WorkTime/Timetable/EditTimeTable/'
	timetable_url = timetable_pages_url + str(timetableId)
	timetable_response = s.get(timetable_url)
	soup = BeautifulSoup(timetable_response.content, 'html.parser')
	return soup

#funkcja do tworzenia nowej pozycji w harmonogramie, dla wybranego uzytkownika, w wybrany dzien. Dziala tylko, jesli uzytkownik nie ma juz tego dnia wpisanych godzin
def create_timetable_item_by_WWW(s, timetableId, userId, date, startTime, endTime, breakMinutes, comment, onlyComment):
	timetable_item_url = 'https://hrnest.io/WorkTime/Timetable/Item'
	payload = { 
			'Item.Id' :str(0),
			'Item.TimetableId' : str(timetableId),
			'Item.UserId' : userId,
			'Item.Date' : date,
			'Item.TimeFm' : startTime,
			'Item.TimeTo' : endTime,
			'Item.BreakMinutes' : str(breakMinutes),
			'Item.Comment' : comment,
			'Item.OnlyComment' : str(onlyComment).lower(),
			'X-Requested-With' : 'XMLHttpRequest'			
	}
	headers = {'Host': 'hrnest.io',
			'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0',
			'Accept' : '*/*',
			'Accept-Language' : 'pl,en-US;q=0.7,en;q=0.3',
			'Accept-Encoding' : 'gzip, deflate, br',
			'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
			'Referer' : 'https://hrnest.io/WorkTime/Timetable/EditTimeTable/' + str(timetableId)
	}
	encoded_payload = urllib.parse.urlencode(payload)
	timetable_response = s.post(timetable_item_url, data=encoded_payload, headers=headers)
	soup = BeautifulSoup(timetable_response.content, 'html.parser')
	
	return soup


#funkcja do edycji istniejacej pozycji w harmonogramie, dla wybranego uzytkownika, w wybrany dzien. Wymaga podania odpowiedniego itemId. Lepiej uzywac wersji easy
def edit_timetable_item_by_WWW(s, itemId, userId, date, startTime, endTime, breakMinutes, comment, onlyComment,TimetableID):
	timetable_item_url = 'https://hrnest.io/WorkTime/Timetable/Item'
	print(itemId)
	print(date)
	payload = { 
			'Item.Id' : str(itemId),
			'Item.UserId' : userId,
			'Item.TimetableId' : str(0),
			'Item.Date' : date,
			'Item.TimeFm' : startTime,
			'Item.TimeTo' : endTime,
			'Item.BreakMinutes' : str(breakMinutes),
			'Item.Comment' : comment,
			'Item.OnlyComment' : str(onlyComment).lower(),
			'X-Requested-With' : 'XMLHttpRequest'			
	}
	headers = {'Host': 'hrnest.io',
			'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0',
			'Accept' : '*/*',
			'Accept-Language' : 'pl,en-US;q=0.7,en;q=0.3',
			'Accept-Encoding' : 'gzip, deflate, br',
			'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
			'Referer' : 'https://hrnest.io/WorkTime/Timetable/EditTimeTable/' + str(TimetableID)
	}
	encoded_payload = urllib.parse.urlencode(payload)
	encoded_payload = encoded_payload.replace("%2B","+")
	print(encoded_payload)
	timetable_response = s.post(timetable_item_url, data=encoded_payload, headers=headers)
	soup = BeautifulSoup(timetable_response.content, 'html.parser')
	
	return soup

def delete_timetable_item_by_WWW(s, itemId,TimetableID):
	timetable_item_url = 'https://hrnest.io/WorkTime/Timetable/Item'
	print(itemId)
	print(date)
	payload = { 
			'Id' : str(itemId),			
			'X-Requested-With' : 'XMLHttpRequest'			
	}
	headers = {'Host': 'hrnest.io',
			'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0',
			'Accept' : '*/*',
			'Accept-Language' : 'pl,en-US;q=0.7,en;q=0.3',
			'Accept-Encoding' : 'gzip, deflate, br',
			'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
			'Referer' : 'https://hrnest.io/WorkTime/Timetable/EditTimeTable/' + str(TimetableID)
	}
	encoded_payload = urllib.parse.urlencode(payload)
	encoded_payload = encoded_payload.replace("%2B","+")
	print(encoded_payload)
	timetable_response = s.delete(timetable_item_url, data=encoded_payload, headers=headers)
	soup = BeautifulSoup(timetable_response.content, 'html.parser')
	
	return soup	
#funkcja do przetwarzania scrapowanego hagmonogramu celem pobrania identyfikatorow uzytkownikow i identyfikatorow wpisanych juz pozycji
def process_plan_div(plan_div):
	#zbieramy uzytkownikow
	users = []
	u_divs = plan_div.findAll("div",{"class": "worker"})
	i = 0
	for u in u_divs:
		surname_span = u.find("span",{'class': 'surname-time'})
		if surname_span is None:
			continue
		users.append([i, surname_span.text])
		i += 1
	#zbieramy zakres wyswietlanych dat
	dates = []
	d_divs = plan_div.find("div",{"class": "plan-row plan-header plan-header-harmonogram"}).findAll("div",{"class": "plan-element"})
	i = 0
	for d in d_divs:
		if 'id' in d.attrs:
			id = d.attrs['id']
			dates.append((i, id))
			i+=1

	#zbieramy wyswietlane komorki
	cells = []
	row_divs = plan_div.findAll("div", {"class": 'plan-row'})
	row_divs = row_divs[1:]
	i = 0
	for row in row_divs:
		data_user_id = None
		ids = {}
		print("processing row for user" , users[i])
		j = 0
		cell_divs = row.findAll("div", {"class": 'plan-element'})
		for c in cell_divs:
			a = c.find("a")
			if a is not None:
				if 'data-id' in a.attrs:
					data_id = a.attrs['data-id']
					ids[dates[j][1]] = data_id #zapamietujemy identyfikator pozycji w harmonogramie
				else:
					ids[dates[j][1]] = None
					if data_user_id is None: #znalezlismy identyfikator danego uzytkownika
						data_user_id = a.attrs['data-user-id']
			j += 1
		cells.append(ids)
		if data_user_id is not None: #skoro mamy identyfikator uzytkownika, to mozemy go zapamietac
			users[i].append(data_user_id)
		i += 1
	
	#zbudowanie wygodnego slownika z uzytkownikami
	users_dict = {}
	i = 0
	for u in users:
		if len(u) == 3:
			users_dict[u[2]] = cells[i]
		i += 1
	return (users_dict, users, dates, cells)
	

#funkcja do pobierania identyfikatora pozycji z przetworzonego harmonogramu
def get_timetableItemId(processed_timetable, userId, date):
	return processed_timetable[0][userId][date]


#funkcja do latwej edycji pozycji w harmonogramie dla wybranego uzytkownika i daty (sama znajduje id pozycji i przetwarza format daty)
def easily_edit_timetable_item_by_WWW(s, processed_timetable, userId, date, startTime, endTime, breakMinutes, comment, onlyComment,TimetableID):
	date_with_offset =  date[0:4] + '-' + date[4:6] + '-' + date[6:]  + 'T'+startTime+':00'
	timetableItemId = get_timetableItemId(processed_timetable, userId, date)
	akcja = edit_timetable_item_by_WWW(s, timetableItemId, userId, date_with_offset, startTime, endTime, breakMinutes, comment, onlyComment,TimetableID)
	return akcja

def easily_delete_timetable_item_by_WWW(s, processed_timetable, userId, date,TimetableID):
	timetableItemId = get_timetableItemId(processed_timetable, userId, date)
	delete_timetable_item_by_WWW(s,timetableItemId,TimetableID)

############PRZYKLAD UZYCIA
#timetableId = 4866 #identyfikator harmonogramu
#s = log_me_in_WWW() #zalogowanie, by moc wykonywac dalsze operacje
#harmonogram = get_timetable_by_WWW(s, timetableId) #scrapowanie harmonogramu z WWW
#plan_div = harmonogram.find("div",{"id":"plan-container"}) #znalezienie interesujacej warsty w harmonogramie
#processed_timetable = process_plan_div(plan_div) #przetworzenie harmonogramu do uzytecznych zmiennych

#przykladowe dane, potrzebne do zmiany wpisu w harmonogramie
#userId = 'cd1ff5e1-e4c5-4af4-8a56-1855ff39413a'
#date = '20210331'
#startTime = '06:45'
#endTime = '12:23'
#breakMinutes = 0
#comment = ''
#onlyComment = False
#akcja = easily_edit_timetable_item_by_WWW(s, processed_timetable, userId, date, startTime, endTime, breakMinutes, comment, onlyComment)



#przyklad stworzenia nowego wpisu w harmonogramie (uwaga na format daty!)
#akcja = create_timetable_item_by_WWW(s, timetableId, '3bc72509-c178-4d65-a3c7-33e493daf7d6', '2021-01-09', '07:00', '16:00', 0, '', False)

