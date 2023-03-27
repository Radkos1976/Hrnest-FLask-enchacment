import os

#Po uzupełnieiniu zmienić nazwę pliku na app_config.py

#Enable Microsoft Account Connetion => must by established https conection by reverse proxy 
# https://socket.io/docs/v3/reverse-proxy and https://stackoverflow.com/questions/62702886/setting-up-proxy-headers-in-iis-for-flask-application
ENABLE_MSAL= False

#Not loged users have access for read
ENABLE_ANYMOUS_USERS = True

#Microsoft DIrectory Settings
CLIENT_SECRET = "token zarejestrowanej aplikacji w Microsoft Azure Active directory"
AUTHORITY = "https://login.microsoftonline.com/common"# nie zmieniać
CLIENT_ID = "ID Klienta Microsoft Azure"
SCOPE = ["User.ReadBasic.All"] # nie zmieniać
SESSION_TYPE = "filesystem" # nie zmieniać
REDIRECT_PATH = "/getAToken" # nie zmieniać
ENDPOINT = 'https://graph.microsoft.com/v1.0/users'  #Nie zmieniać

#Email Settings
SENDER_ADDRESS = 'email'
SENDER_PASS = "password"
SMTP_ADRESS = 'smtp.gmail.com'
SMTP_PORT = 587
SERVICE_ADDRESS = 'http://localhost:3000' #nazwa serwera widoczna dla użytkowników

#Database settings
DATABASE_URL='sqlite:///HrnestBossdev.db?check_same_thread=False'
