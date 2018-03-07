"""
The flask application package.
"""
#import os
from flask import Flask
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] =  'upload' #os.sep + 'upload'

import NahravacSlov_Flask.views
