# coding=utf-8
"""
Fill schema in db commands / database must be a created
python manage_db_schema.py db init
python manage_db_schema.py db migrate
python manage_db_schema.py db upgrade

After migrate and Before run upgrade command please add 'import sqlalchemy_utils'  text to newly created *.py file
on catalog HrnestBoss\HrnestBoss\migrations\versions 
"""

from os import environ
import os
from flask_script import Manager
from flask_migrate import Migrate,MigrateCommand
from HrnestBoss import app, db


migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
