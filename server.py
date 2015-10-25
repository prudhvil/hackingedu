import os
from flask import Flask, jsonify, request
import requests
import json
from watson_developer_cloud import ToneAnalyzerV2Experimental as ToneAnalyzer

app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/save',methods=['POST'])
def save_cv():
    cv = request.json['value']
    with open('docs.txt','a') as f:
        f.write(cv)
        f.write('\n|\n')
    return 'success'

@app.route('/tone', methods=['POST'])
def tone():
    tone_analyzer = ToneAnalyzer(username='',
                             password='')
    cv = request.json['value']
    return json.loads(tone_analyzer.tone(text=cv))

port = os.getenv('VCAP_APP_PORT', '8000')

if __name__ == '__main__':
    app.run(port = int(port), host = '0.0.0.0', debug = True)