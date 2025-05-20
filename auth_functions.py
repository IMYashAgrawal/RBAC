from auth_data import users

def authenticate(username, password):
    # This function checks if the provided username and password match any user in the database.
    
    user = users.get(username)
    if user and user["password"] == password:
        return user["role"]
    else:
        return None
