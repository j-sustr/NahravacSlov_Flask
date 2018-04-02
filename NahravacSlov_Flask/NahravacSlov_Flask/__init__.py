"""
The flask application package.
"""
#import os
from flask import Flask
#from flask_mail import Mail

app = Flask(__name__)

#mail_pswd = ''
#with open('mail_pswd.txt', 'r', encoding = 'utf-8') as fp:
#         mail_pswd = fp.readline()

#app.config.update(dict(
#    MAIL_SERVER = 'smtp.seznam.cz',
#    MAIL_USERNAME = 'projektsgi@email.cz',
#    MAIL_PASSWORD = mail_pswd,
#    MAIL_DEFAULT_SENDER = 'projektsgi@email.cz',
#))

#mail = Mail(app)

app.config['UPLOAD_FOLDER'] =  'upload' #os.sep + 'upload'

#app.debug = False

import NahravacSlov_Flask.views
