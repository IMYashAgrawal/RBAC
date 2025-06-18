from utilities import hash_string_to_50
import mysql.connector

def fix_all_user_ids():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Tanishk@12",
        database="system_permissions"
    )
    cursor = conn.cursor(dictionary=True)

    # 1. Read all users
    cursor.execute("SELECT userid, passwd, roles FROM users")
    users = cursor.fetchall()

    for user in users:
        original_userid = user['userid']
        passwd = user['passwd']
        role_id = user['roles']

        # 2. Try to reverse-hash-check: if already hashed, skip
        if len(original_userid) == 50:
            print(f"Skipping already hashed user: {original_userid}")
            continue

        # 3. Hash the userid (username)
        hashed_id = hash_string_to_50(original_userid)
        print(f"Fixing user: {original_userid} → {hashed_id}")

        # 4. Delete old user and insert new one
        cursor.execute("DELETE FROM users WHERE userid = %s", (original_userid,))
        cursor.execute("INSERT INTO users (userid, passwd, roles) VALUES (%s, %s, %s)", (hashed_id, passwd, role_id))

    conn.commit()
    cursor.close()
    conn.close()
    print("All usernames hashed successfully.")

if __name__ == "__main__":
    fix_all_user_ids()
