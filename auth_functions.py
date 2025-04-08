from auth_data import users

def authenticate(username, password):
    
    user = users.get(username)
    if user and user["password"] == password:
        return user["role"]
    else:
        return None
