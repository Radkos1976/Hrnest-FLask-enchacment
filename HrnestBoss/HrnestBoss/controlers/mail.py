# coding=utf-8
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from HrnestBoss import app

def send_activation_email(username,recevier,guid):
    linkForactivation=app.config['SERVICE_ADDRESS']
    mail_content = """<html><head></head><body><b>Dear {},</b><br><p>Please open the following link in web browser to activate your account in HRnestBoss<br></p><a href={}/activateAccount/{}/{}>Click for activate account</a></body></html>""".format(username, linkForactivation, recevier, str(guid) )
    Subject = 'Account activation.'
    result = sendMail(recevier,Subject,mail_content)
    return result
    

def send_resetAccount_email(username,recevier,guid):
    linkForactivation=app.config['SERVICE_ADDRESS']
    mail_content = """<html><head></head><body><b>Dear {},</b><br><p>Please open the following link in web browser to reset your credentials account in HRnestBoss</p><br><a href={}/new_credentials/{}/{}>Click for set new credentials of account</a></body></html>""".format(username, linkForactivation, recevier, str(guid) )
    Subject = 'Reset Password.'
    result = sendMail(recevier,Subject,mail_content)
    return result



def sendMail(recevier,Subject,mail_content):
    #The mail addresses and password
    sender_address = app.config['SENDER_ADDRESS']
    sender_pass = app.config['SENDER_PASS']
    receiver_address = recevier
    #Setup the MIME
    message = MIMEMultipart()
    message['From'] = sender_address
    message['To'] = receiver_address
    message['Subject'] = Subject
    #The body and the attachments for the mail
    message.attach(MIMEText(mail_content, 'html'))
    #Create SMTP session for sending the mail
    mail_session = smtplib.SMTP(app.config['SMTP_ADRESS'], app.config['SMTP_PORT']) #use mail with port
    mail_session.starttls() #enable security
    mail_session.login(sender_address, sender_pass) #login with mail_id and password
    text = message.as_string()
    mail_session.sendmail(sender_address, receiver_address, text)
    mail_session.quit()
    return True