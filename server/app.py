from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash 


JWT_SECRET = 'random'
JWT_ALG = 'HS256'

app = Flask(__name__)
CORS(app,resources = {r"/api/*": {'origins' : 'http://localhost:3000'}},supports_credentials=False)

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
    
    except sqlite3.IntegerityError:
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
    
    if not row or not check_password_hash(row['password_hash'],password):
        return jsonify({'ok' : False, 'error' : 'Invalid email or password.'}),401
    
    now = datetime.datetime.utcnow()
    
    payload = {
        'sub' : str(row['id']),
        'email' : row['email'],
        'iat' : now,
        'exp' : now + datetime.timedelta(days = 7)
    }
    
    token = jwt.encode(payload,JWT_SECRET,algorithm = JWT_ALG)
    
    return jsonify({'ok' : True, 'token' : token}),200


if __name__ == '__main__':
    init_db()
    app.run(debug = True)
