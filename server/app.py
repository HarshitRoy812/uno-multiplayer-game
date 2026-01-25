from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import jwt
from datetime import datetime,timedelta,timezone
from werkzeug.security import generate_password_hash, check_password_hash 
from flask_socketio import SocketIO, join_room, leave_room, emit
import random
import string


JWT_SECRET = 'random'
JWT_ALG = 'HS256'

app = Flask(__name__)
CORS(app,resources = {r"/api/*": {'origins' : '*'}})
socketio = SocketIO(app, cors_allowed_origins = '*')

DB_NAME = 'database.db'

def init_db():
    
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    
    cur.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
    
    conn.commit()
    conn.close()
    
    
def generate_room_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits,k = 6))
    
    
# ------------- ROUTES --------        

@app.route('/api/register',methods = ['POST'])
def register():
    
    data = request.get_json() or {}
    
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    
    if not name or not email or not password:
        return jsonify({'ok' : False, 'error' : 'Insufficient credentials provided.'}),400
    
    password_hash = generate_password_hash(password)
    
    try:
        conn = sqlite3.connect(DB_NAME)
        cur = conn.cursor()
        
        cur.execute('INSERT INTO users (name,email,password_hash) VALUES (?,?,?)',(name,email,password_hash),)
        
        conn.commit()
        
        return jsonify({'ok' : True,'message' : 'Registered successfully!'}),201
    
    except sqlite3.IntegrityError:
        return jsonify({'ok' : False,'error' : 'Email already registered.'}),409
    
    finally:
        conn.close()
        
@app.route('/api/login',methods = ['POST'])
def login():
    
    data = request.get_json() or {}
    
    email = (data.get('email') or '').strip().lower() 
    password = data.get('password') or ''
    
    if not email or not password:
        return jsonify({'ok' : False, 'error' : 'Email and password required.'}),400
    
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    
    cur.execute('SELECT id, email, password_hash FROM users WHERE email = ?',(email,))
    
    row = cur.fetchone()
    conn.close()
    
    if not row or not check_password_hash(row[2],password):
        return jsonify({'ok' : False, 'error' : 'Invalid email or password.'}),401
    
    now = datetime.now(timezone.utc)
    
    payload = {
        'sub' : str(row[0]),
        'email' : row[1],
        'iat' : now,
        'exp' : now + timedelta(days = 7),
    }
    
    token = jwt.encode(payload,JWT_SECRET,algorithm = JWT_ALG)
    
    return jsonify({'ok' : True, 'token' : token}),200


@app.route('/api/me',methods = ['GET'])
def me():
    
    auth = request.headers.get('Authorization','')
    
    if not auth.startswith('Bearer '):
        return jsonify({'ok' : False,'error' : 'Missing token'}),401 
    
    token = auth.split(' ')[1]
    
    try:
        payload = jwt.decode(token,JWT_SECRET,algorithms = [JWT_ALG])
    except jwt.ExpiredSignatureError:
        return jsonify({'ok' : False,'error' : 'Token expired'}),401
    except jwt.InvalidTokenError:
        return jsonify({'ok' : False,'error' : 'Invalid token'}),401

    user_id = payload['sub']
    
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    
    cur.execute('SELECT id,name,email FROM users where id = ?',(user_id,))
    user = cur.fetchone()
    conn.close()
   
    if not user:
        return jsonify({'ok' : False,'error' : 'User not found'}),404
    
    return jsonify({
        'ok' : True,
        'user' : {
            'id' : user[0],
            'name' : user[1],
            'email' : user[2]
        }
    })
    
@socketio.on('connect')
def on_connect():
    print("client connected")

@socketio.on('create_room')
def create_room():
    room_code = generate_room_code()
    
    emit('room_created',{
        'room_code' : room_code
    })

if __name__ == '__main__':
    init_db()
    socketio.run(app,port = 5000,debug = True)  
