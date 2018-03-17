"""
Routes and views for the flask application.
"""
import os
from datetime import datetime
from flask import render_template, request, jsonify, make_response
from NahravacSlov_Flask import app


#import json
#import base64
#import struct


@app.route('/')
@app.route('/index')
def home():
    """Renders the home page."""

    #userID = request.cookies.get('userID')
    #print('userID: {}'.format(userID))
    #if not userID: 
    #   print('new user')

    resp = make_response(render_template('index.html')) # vice lidi z jednoho zarizeni
    resp.set_cookie('userID', str(getNewUserId()))
    return resp
    
    return render_template('index.html')

    #return render_template(
    #    'index.html',
    #    #title='Home Page',
    #    #year=datetime.now().year,
    #)

@app.route('/_upload_rec', methods=['GET', 'POST'])
def save_rec():
    #app.logger.debug("Accessed _save_rec page with audio data")
    print("Accessed _upload_rec page with audio data")
	# flash('Just hit the _add_numbers function')
	# a = json.loads(request.args.get('a', 0, type=str))
    #data = json.loads(request.args.get('data', 0, type=str))
    #data = request.args.get('data', 0, type=str)

    #print(request.remote_addr)

    #request.get_data()

    userID = request.form['userID'] #.zfill(4)

    file = request.files['audio_file']
    filename = file.filename
    
    osoba_dir = os.path.join(app.config['UPLOAD_FOLDER'], userID)

    #print(osoba_dir)

    if not os.path.isdir(osoba_dir): os.mkdir(osoba_dir)

    file.save(os.path.join(osoba_dir, filename))


    #app.logger.debug("Data looks like " + data)
    #sample_rate = request.args.get('sampleRate', 0, type=int)

    return jsonify(result='ok')


def getNewUserId():
    #try:
    #    f = open("test.txt",encoding = 'utf-8')
    #    id = int(f.readline())
    #finally:
    #    f.close()

    id = 17
    fn = "new_id.txt"

    if not os.path.exists(fn):
        f = open(fn, "w", encoding = 'utf-8')
        f.write(str(id))
        f.close()

    with open(fn, 'r', encoding = 'utf-8') as f:
         last_id_str = f.readline()
         if last_id_str: id = int(last_id_str)

    with open(fn, 'w', encoding = 'utf-8') as f:
         f.write(str(id + 1))
        

    return id

