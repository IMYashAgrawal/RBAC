import mysql.connector
from utilities import hash_string_to_50
import re

def is_valid_username(username):
    return bool(re.fullmatch(r"[A-Za-z0-9_]{3,20}", username))

def is_valid_password(password):
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    if re.search(r"\s", password):
        return False
    return True

def add_user(username, password):
    if not is_valid_username(username):
        print("Invalid username. Must be 3–20 alphanumeric characters (underscores allowed).")
        return False
    if not is_valid_password(password):
        print("Invalid password. Must be at least 8 characters long, include uppercase, lowercase, digit, and special character.")
        return False

    hashed_username = hash_string_to_50(username)
    hashed_password = hash_string_to_50(password)

    conn = None  # Initialize conn to None
    try:
        conn = mysql.connector.connect( # Add connection parameters here
            host="localhost",
            user="root",
            password="Tanishk@12",
            database="system_permissions"
        )
        cursor = conn.cursor()

        # Get Customer role ID (should be 1)
        cursor.execute("SELECT id FROM roles WHERE name = 'Customer'")
        role_result = cursor.fetchone()
        
        if not role_result:
            print("Error: Customer role doesn't exist!")
            return False
            
        role_id = role_result[0]  # Get the integer ID

        # Check existing users using HASHED username
        cursor.execute("SELECT userid FROM users WHERE userid = %s", (hashed_username,))
        if cursor.fetchone():
            print("Username exists")
            return False

        # Insert with role ID
        cursor.execute(
            "INSERT INTO users (userid, passwd, roles) VALUES (%s, %s, %s)", # Changed %d to %s for roles
            (hashed_username, hashed_password, role_id)  # Use the ID here
        )
        conn.commit()
        return True
        
    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return False
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()
