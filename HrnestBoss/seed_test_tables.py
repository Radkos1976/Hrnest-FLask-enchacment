# coding=utf-8
from os import environ
import os
import datetime
from datetime import timedelta, date
from HrnestBoss import app, db
from HrnestBoss.DbModel.models import users,work_group,timetable,shift_type,user2timetable,shift
import uuid

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n) 
        
Conf_type=os.getenv("Conf_type")
print(Conf_type)
if Conf_type=='Development' or Conf_type==None:
    pers_name = ['Brzęczyszczykiewicz Grzegorz','Batory Stefan','Dolas Franek','Bartłomiej Drągowski','Łukasz Fabiański','Łukasz Skorupski','Wojciech Szczęsny','Jan Bednarek','Bartosz Bereszyński','Paweł Bochniewicz','Kamil Glik','Żybura Mateusz','Zienkiewicz Tomasz','Zawór Martyna','Zaniewski Bartosz','Zachorowski Tomasz','Wyrzykowska Justyna','Wyłucki Jakub','Wójcik Martyna','Wnuk Piotr','Włoszek Emil','Witak Marek','Wiśniewska Marta','Widomski Dariusz','Weryńska Anna','Wawrzyniak Malwina','Waśko Mateusz','Wańczyk Michał','Wałaszek Iwona','Wakulak Marek','Uzarowicz Karolina','Tworzydło Rafał','Tworus Damian','Tulkowska Weronika','Tkaczyk Dawid','Tępczyk Weronika','Tarnowski Grzegorz','Święcki Mariusz','Śpiewak Ewa','Ślusarczyk Maciej','Szymczak Michał','Szkop Monika','Szkop Krzysztof','Szelągiewicz Małgorzata','Szczepański Hubert','Szafrańska Paulina','Szadkowska Kinga','Strzałkowska Ewa','Stępień Marta','Stańczuk Hubert','Stachowiak Maciej','Sprysak Arkadiusz','Spaltabaka-Gędek Ewelina','Solecka Olga','Sobieski Adam','Smolik Karolina','Skowrońska Karolina','Siwiak Małgorzata','Sitkiewicz Arkadiusz','Sałęga Arkadiusz','Sałata Maciej','Rymer Dawid','Rybacki Piotr','Ruminowicz Marcin','Rudnicka Kinga','Rudnicka Anna','Roman Tomasz','Rolek Marta','Rojek Stefan','Robaczyński Paweł','Radziszewski Kamil','Pyl Andrzej','Proskurnicki Dawid','Prokopowicz Rafał','Prochowicz Piotr','Półtorak Marcin','Półtorak Anna','Poliszkiewicz Ewelina','Poliszkiewicz Andrzej','Polanowicz Tomasz','Podwysocka Katarzyna','Płonka Mateusz','Płonka Aleksander','Płocica-Wiśniewska Agnieszka','Piszczek Karolina','Piszczek Daniel','Petrykowski Hubert','Petka Katarzyna','Pejs Katarzyna','Pawliszewska Joanna','Pawlak Justyna','Pasternak Sylwia','Paska Sylwia','Panas Arkadiusz','Pacewicz Arkadiusz','Owczarczyk Jarosław','Ostaszewski Mariusz','Obarski Krzysztof','Nowak Paweł','Niksińska Anna','Neumann Marek','Nesteruk Wojciech','Narczyk Dominika','Musiał Dominika','Mucharski Michał','Mucha(Piersa) Zuzanna','Morawski Marcin','Mizak Anna','Milewski Marcin','Mielczarek Agata','Michaluk Przemysław','Mazurek Marek','Mazur Robert','Mazepa Katarzyna','Masiarek Kinga','Marcinkowska Barbara','Malinowski Jakub','Malinowska Agata','Majchrowska Katarzyna','Łokiński Marcin','Łataś Marta','Łata Tobiasz','Łakomy Aleksandra','Łabędź Adrian','Lutkiewicz Justyna','Lubańska Mirella','Lizner Damian','Linde Katarzyna','Lewandowska Paulina','Lelewski Marcin','Kwiatkowski Mateusz','Kubat Beata','Księżak Aleksandra','Kryszak Marek','Krawczak Paweł','Krawczak Joanna','Krawczak Ewa','Kowalski Marcin','Kowalczyk Aleksandra','Kot Michał','Kot Dominika','Kosiorek Jacek','Kopeć Michał Maciej','Koński Artur','Konopka Mariusz','Konopa Sebastian','Konopa Karolina','Kondraciuk Olga','Kogut Paulina','Kocór Urszula','Kobyliński Mateusz','Kiełczewski Kacper','Kieliszek Marcin','Kielec Katarzyna','Kędziora Rafał','Karwowski Paweł','Karczewski Maciej','Karczewski Artur','Kalata Agnieszka','Juniewicz Joanna','Jaworska Ewelina','Jaworowski Tomasz','Jaskanis Piotr','Januszewicz Robert','Janaszek Agata','Jałocha Urszula','Grzejda Olga','Grządziel Maciej','Gryka Mateusz','Grygo Justyna','Grochowska Dominika','Grochocki Piotr','Górka Gabriela','Góral(Mazur) Justyna','Góral Daniel','Gołaś Tomasz','Gołaszewska Agnieszka','Golędzinowski Bartosz','Godlewska Renata','Głowiński Sebastian','Głowacki Adam','Gembala Julita','Gąska Adam','Gawrońska Paulina','Gajek Dominika','Gabrel Mariusz','Furtak Justyna','Furmańczyk Kamil','Florczyk Adrian','Flont Aneta','Filiks Sylwia','Fijałkowska Kamila','Figurski Sebastian','Ferenc Rafał','Erenfeicht(Małek) Weronika','Dziubińska Karolina','Dratkiewicz(Dominik) Magdalena','Dratkiewicz Michał','Draganiak Wiesława','Dragan Anna','Dobrowolski Łukasz','Dobrowolska Anna','Delegacz Paulina','Dąbrowski Mateusz','Dąbrowska Magdalena','Czupryna Tomasz','Czernecka Anna','Czarnocka Anita','Cuprjak Michał','Cisło Michalina','Cisak Artur','Cieślukiewicz Monika','Cieślak Lech','Chojnacka-Banaszkiewicz Aneta','Chamernik Karolina','Chaber Tomasz','Butkiewicz Paulina','Bugalski Michał','Budrewicz Mateusz','Budrewicz Maciej','Błaszczak Katarzyna','Bielski Tobiasz','Białobrzeski Kamil','Benirowski Paweł','Bartołd Michał','Bardyga Wojciech','Antoniak Damian','Ankersztajn Paweł','Andrzejewska Małgorzata','Alieksieienko Maksym','Aleksyeyenko Nikita']
    TypesWork=['1','2','1n','n2','nb','SNET','s','z','QC','Szkol','u','LD','']
    Timetales=['Hrnest_Main','Hrnest_Past','Hrnest_Future','Draft']
    #Seed Shift types
    for shiftTp in TypesWork:
        shfT=shift_type.query.filter(shift_type.name==shiftTp).all()
        if len(shfT)==0:
            a=shift_type(name=shiftTp,description="TypeDescr " + shiftTp)
            db.session.add(a)
        db.session.commit()
    #Seed Timetables
    tblT=timetable.query.filter(timetable.title=='Present Table').all()
    if len(tblT)==0:
        p=timetable(hrnest_id=1462,title='Present Table',date_from=datetime.datetime.strptime('2021-01-01','%Y-%m-%d'),date_to=datetime.datetime.strptime('2021-12-31','%Y-%m-%d'))
        db.session.add(p) 
    tblT=timetable.query.filter(timetable.title=='Hrnest_Past').all()
    if len(tblT)==0:
        p=timetable(hrnest_id=1320,title='Hrnest_Past',date_from=datetime.datetime.strptime('2020-01-01','%Y-%m-%d'),date_to=datetime.datetime.strptime('2020-12-31','%Y-%m-%d'))
        db.session.add(p) 
    tblT=timetable.query.filter(timetable.title=='Hrnest_Future').all()
    if len(tblT)==0:
        p=timetable(hrnest_id=1580,title='Hrnest_Future',date_from=datetime.datetime.strptime('2022-01-01','%Y-%m-%d'),date_to=datetime.datetime.strptime('2022-12-31','%Y-%m-%d'))
        db.session.add(p)
    tblTl=timetable.query.filter(timetable.title=='Draft').all()
    if len(tblT)==0:
        p=timetable(title='Draft',date_from=datetime.datetime.strptime('2021-01-01','%Y-%m-%d'),date_to=datetime.datetime.strptime('2021-02-28','%Y-%m-%d'))
        db.session.add(p)
    db.session.commit()
    #Seed Persons
    for person in pers_name:
        First_name=person[int(person.index(' ',1)+1):len(person)].upper()
        Last_name=person[0:int(person.index(' ',1))].upper()
        Emp_tbe =  users.query.filter(users.first_name==First_name).\
            filter(users.last_name==Last_name).all()
        if len(Emp_tbe)>0:
            id=Emp_tbe[0].id
        else:
            guid =uuid.uuid1()
            itemID=person[0:3].upper() + person[int(person.index(' ',1)+1):int(person.index(' ',1)+2)].upper()
            p=users(uid=guid,emp_id=itemID,first_name=First_name,last_name=Last_name)
            db.session.add(p)
            db.session.commit()
    #Seed Persons shifts
    tblT=timetable.query.all()
    for time in tblT:
        Emp_tbe =  users.query.all()
        for employe in Emp_tbe:
           qry=user2timetable.query.filter(user2timetable.user_id==employe.id).\
               filter(user2timetable.timetable_id==time.id).all()
           if len(qry)==0:
                guid =uuid.uuid1()
                p= user2timetable(id=guid,user_id=employe.id,timetable_id=time.id)
                db.session.add(p)
                db.session.commit()
    # seed shift data by aprox. 270000 rekords - LONG RUNING ADD
    shfT=shift_type.query.all()
    maxz=len(shfT)
    
    za=0
    usr2tbl=db.session.query(user2timetable,timetable).join(timetable,timetable.id==user2timetable.timetable_id).all()
    for allusr in usr2tbl:
        sh=shift.query.filter(shift.user_id==allusr.user2timetable.id).all()
        if len(sh)==0:
            print('Populating ' + str(allusr.user2timetable.id) + '  TIMETABLE Name:' + allusr.timetable.title + '  Calendar dates:'+ str(allusr.timetable.date_from) + ' to ' + str(allusr.timetable.date_to) )
            for active_date in daterange(allusr.timetable.date_from, allusr.timetable.date_to):             
                guid =uuid.uuid1()
                p=shift(id=guid,user_id=allusr.user2timetable.id,date=active_date,type_id=shfT[za].id)
                za=za+1
                if za==maxz:za=0
                db.session.add(p)
        db.session.commit()