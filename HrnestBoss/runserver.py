"""
This script runs the HrnestBoss application using a development server.
"""
# coding=utf-8

import multiprocessing
from os import environ
from HrnestBoss import socket_,app
#import HrnestBoss.routes.Ws as ws

def run_flask_app():        
        HOST = environ.get('SERVER_HOST', 'localhost')
        try:
            PORT = int(environ.get('SERVER_PORT', '3000'))
        except ValueError:
            PORT = 3000
        #app.run(HOST, PORT)
        socket_.run(app,host=HOST,port=PORT)
#def Run_ws_serv():        
#        ws.Connection()

if __name__ == '__main__': 
    
    run_flask_app()
    #flaskapp = multiprocessing.Process(target=run_flask_app)
    #flaskapp.start()
     
    #websocket =multiprocessing.Process(target=Run_ws_serv)    
    #websocket.star ()

    #flaskapp.join()
    #websocket.join()