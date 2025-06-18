from flask import Flask, request, jsonify, session
from flask_cors import CORS
from utilities import hash_string_to_50
import mysql.connector
import os
import random

app = Flask(__name__)
app.secret_key = 'your_super_secret_key_here'
CORS(app, supports_credentials=True)
app.config['SESSION_COOKIE_SAMESITE'] = "Lax"
app.config['SESSION_COOKIE_SECURE'] = False

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Tanishk@12',
    'database': 'system_permissions'
}

def get_db():
    return mysql.connector.connect(**DB_CONFIG)

# --- Self CAPTCHA Endpoint (Math Challenge) ---
@app.route('/api/self-captcha', methods=['GET'])
def get_self_captcha():
    a = random.randint(1, 10)
    b = random.randint(1, 10)
    question = f"What is {a} + {b}?"
    answer = str(a + b)
    session['self_captcha_answer'] = answer
    return jsonify({'question': question})

# --- Register ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    user_captcha = data.get('self_captcha', '')
    if not user_captcha or user_captcha.strip() != session.get('self_captcha_answer', ''):
        return jsonify({'error': 'Invalid CAPTCHA answer'}), 400

    username = data['username']
    password = data['password']
    role = 'Customer'

    hashed_username = hash_string_to_50(username)
    hashed_password = hash_string_to_50(password)

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT id FROM roles WHERE name = %s", (role,))
        role_id = cursor.fetchone()
        if not role_id:
            return jsonify({'error': 'Invalid role'}), 400

        cursor.execute(
            "INSERT INTO users (userid, passwd, roles, uname) VALUES (%s, %s, %s, %s)",
            (hashed_username, hashed_password, role_id[0], username)
        )
        db.commit()
        return jsonify({'message': 'User registered successfully'}), 201

    except mysql.connector.IntegrityError:
        return jsonify({'error': 'User already exists'}), 400
    finally:
        cursor.close()
        db.close()


# --- Login ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user_captcha = data.get('self_captcha', '')
    if not user_captcha or user_captcha.strip() != session.get('self_captcha_answer', ''):
        return jsonify({'error': 'Invalid CAPTCHA answer'}), 400

    username = data['username']
    password = data['password']

    hashed_username = hash_string_to_50(username)
    hashed_password = hash_string_to_50(password)

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            SELECT u.passwd, r.name 
            FROM users u
            JOIN roles r ON u.roles = r.id 
            WHERE u.userid = %s
        """, (hashed_username,))
        result = cursor.fetchone()

        if result and result[0] == hashed_password:
            return jsonify({
                'message': 'Login successful',
                'username': username,
                'role': result[1]
            }), 200

        return jsonify({'error': 'Invalid credentials'}), 401
    finally:
        cursor.close()
        db.close()

# --- Profile (unchanged) ---
@app.route('/api/profile', methods=['GET'])
def get_profile():
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Username required'}), 400

    hashed_username = hash_string_to_50(username)

    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT %s AS username, r.name AS role
            FROM users u
            JOIN roles r ON u.roles = r.id
            WHERE u.userid = %s
        """, (username, hashed_username))
        user = cursor.fetchone()

        if user:
            return jsonify(user), 200
        return jsonify({'error': 'User not found'}), 404
    finally:
        cursor.close()
        db.close()

# --- TEXT FILE API for Functionalities (unchanged) ---
TEXT_FILES = {
    "product_info": "product_info.txt",
    "order_info": "order_info.txt",
    "user_profiles": "user_profiles.txt",
    "inventory_data": "inventory_data.txt",
    "payment_info": "payment_info.txt",
    "shipping_data": "shipping_data.txt",
    "reviews": "reviews.txt",
    "analytics": "analytics.txt",
    "promotions": "promotions.txt",
    "admin_settings": "admin_settings.txt",
    "legal_data": "legal_data.txt"
}

@app.route("/api/text-file", methods=["GET"])
def get_text_file():
    name = request.args.get("name")
    if name not in TEXT_FILES:
        return jsonify({"error": "Invalid file name"}), 400
    path = TEXT_FILES[name]
    if not os.path.exists(path):
        open(path, "w").close()
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    return jsonify({"content": content}), 200

@app.route("/api/text-file", methods=["POST"])
def write_text_file():
    data = request.json
    name = data.get("name")
    content = data.get("content", "")
    if name not in TEXT_FILES:
        return jsonify({"error": "Invalid file name"}), 400
    path = TEXT_FILES[name]
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return jsonify({"message": "File updated."}), 200


# --- Get all users with roles ---
@app.route('/api/users-roles', methods=['GET'])
def get_users_roles():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT u.userid, u.uname, r.id as role_id, r.name as role_name
            FROM users u
            JOIN roles r ON u.roles = r.id
        """)
        users = cursor.fetchall()
        return jsonify(users), 200
    finally:
        cursor.close()
        db.close()

# --- Update user role ---
@app.route('/api/update-role', methods=['POST'])
def update_role():
    data = request.json
    userid = data.get('userid')
    new_role_id = data.get('role_id')

    if not userid or not new_role_id:
        return jsonify({'error': 'Missing userid or role_id'}), 400

    db = get_db()
    cursor = db.cursor()
    try:
        # Verify role_id exists
        cursor.execute("SELECT id FROM roles WHERE id = %s", (new_role_id,))
        if not cursor.fetchone():
            return jsonify({'error': 'Invalid role_id'}), 400

        # Update role for user
        cursor.execute("UPDATE users SET roles = %s WHERE userid = %s", (new_role_id, userid))
        db.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'message': 'Role updated successfully'}), 200
    finally:
        cursor.close()
        db.close()

if __name__ == "__main__":
    app.run(debug=True)
