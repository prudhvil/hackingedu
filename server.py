import os
from flask import Flask, jsonify, request

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

port = os.getenv('VCAP_APP_PORT', '8000')

if __name__ == '__main__':
	app.run(port = int(port), host = '0.0.0.0', debug = True)