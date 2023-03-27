# coding=utf-8
import socketio 
from os import environ 

ws = socketio.Client()

def Connection():  
     
        HOST = environ.get('SERVER_HOST', 'localhost')
        try:
            PORT = int(environ.get('SERVER_PORT', '5555'))
        except ValueError:
            PORT = 5555
        ws.connect('http://' + HOST + ':' + str(PORT) + '/',wait=False)
        ws.wait()
        

@ws.on('check')
def check(data):
    print('I received a message! => client ' + data['data'])
    

@ws.event
def connect():
    print("I'm connected! => client")

@ws.event
def connect_error():
    print("The connection failed! => client")

@ws.event
def disconnect():
    print("I'm disconnected! => client")


    
