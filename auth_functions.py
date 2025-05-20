import mysql.connector
from utilities import hash_string_to_50

def authenticate(username, password):
    hashed_username = hash_string_to_50(username)
    hashed_password = hash_string_to_50(password)

    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="system_permissions"
        )
        cursor = conn.cursor()

        cursor.execute("""
            SELECT u.passwd, r.name 
            FROM users u
            JOIN roles r ON u.roles = r.id 
            WHERE u.userid = %s
        """, (hashed_username,))
        
        result = cursor.fetchone()
        
        if result and result[0] == hashed_password:
            return result[1]  # Return role name
        return None

    except mysql.connector.Error as e:  # REQUIRED except block
        print(f"Authentication error: {e}")
        return None

    finally:  # REQUIRED cleanup block
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()