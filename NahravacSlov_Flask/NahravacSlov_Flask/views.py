"""
Routes and views for the flask application.
"""
import os
from datetime import datetime
from flask import render_template, request, jsonify
from NahravacSlov_Flask import app
import json
import base64
import struct

@app.route('/')
@app.route('/index')
def home():
    """Renders the home page."""
    return render_template(
        'index.html',
        #title='Home Page',
        #year=datetime.now().year,
    )

@app.route('/_save_rec', methods=['GET', 'POST'])
def save_rec():
    #app.logger.debug("Accessed _save_rec page with audio data")
    print("Accessed _save_rec page with audio data")
	# flash('Just hit the _add_numbers function')
	# a = json.loads(request.args.get('a', 0, type=str))
    #data = json.loads(request.args.get('data', 0, type=str))
    #data = request.args.get('data', 0, type=str)

    print(request.remote_addr)

    #request.get_data()
    print(request.form)

    file = request.files['audio_file']
    filename = file.filename
    print(file)

    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))


    #app.logger.debug("Data looks like " + data)
    #sample_rate = request.args.get('sampleRate', 0, type=int)

    return jsonify(result='ok')


#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

@app.route('/contact')
def contact():
    """Renders the contact page."""
    return render_template(
        'contact.html',
        title='Contact',
        year=datetime.now().year,
        message='Your contact page.'
    )

@app.route('/about')
def about():
    """Renders the about page."""
    return render_template(
        'about.html',
        title='About',
        year=datetime.now().year,
        message='Your application description page.'
    )
