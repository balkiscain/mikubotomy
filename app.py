from flask import Flask, render_template, request, redirect, url_for
import csv
from datetime import datetime
import os

app = Flask(__name__)

# Ensure the data directory exists
os.makedirs(os.path.join(app.instance_path, 'data'), exist_ok=True)
RESPONSES_FILE = os.path.join(app.instance_path, 'data', 'responses.csv')

def save_response(name, response):
    file_exists = os.path.isfile(RESPONSES_FILE)
    with open(RESPONSES_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['timestamp', 'name', 'response'])
        writer.writerow([datetime.now().isoformat(), name, response])

def get_responses():
    if not os.path.isfile(RESPONSES_FILE):
        return []
    with open(RESPONSES_FILE, 'r') as f:
        reader = csv.DictReader(f)
        return list(reader)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/respond', methods=['POST'])
def respond():
    name = request.form.get('name', 'Guest').strip()
    if not name:
        name = 'Guest'
    choice = request.form.get('response')
    
    if choice in ['accepted', 'denied']:
        save_response(name, choice)
        return redirect(url_for('response', choice=choice, name=name))
    return redirect(url_for('index'))

@app.route('/response')
def response():
    choice = request.args.get('choice')
    name = request.args.get('name', 'Guest')
    return render_template('response.html', choice=choice, name=name)

@app.route('/summary')
def summary():
    from datetime import datetime
    responses = get_responses()
    now = datetime.now()
    return render_template('summary.html', responses=responses, now=now)

if __name__ == '__main__':
    # Create instance folder if it doesn't exist
    os.makedirs(app.instance_path, exist_ok=True)
    app.run(host='0.0.0.0', port=10000)
