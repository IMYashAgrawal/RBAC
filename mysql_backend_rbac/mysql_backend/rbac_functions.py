import mysql.connector

def has_permission(role_name, component_name, required_permission):
    """
    Check if a role has the required permission (R or R/W) on a specific system component.
    """
    try:
        conn = mysql.connector.connect(
            host="localhost",         # Replace with your MySQL host
            user="root",   # Replace with your MySQL username
            password="Tanishk@12", # Replace with your MySQL password
            database="system_permissions"
        )
        cursor = conn.cursor()

        cursor.execute(" SELECT p.name FROM access_rules ar JOIN roles r ON ar.role_id = r.idz JOIN system_components sc ON ar.component_id = sc.id JOIN permissions p ON ar.permission_id = p.id WHERE r.name = %s AND sc.name = %s ", (role_name, component_name))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        if not result:
            return False

        actual_permission = result[0]

        if actual_permission == "R/W":
            return True
        elif actual_permission == "R" and required_permission == "R":
            return True
        else:
            return False

    except Exception as e:
        print("Error checking permission:", e)
        return False


