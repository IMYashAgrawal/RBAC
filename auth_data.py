import json
import os

USER_DATA_FILE = "users.json"

def load_users():
    
    if os.path.exists(USER_DATA_FILE):
        with open(USER_DATA_FILE, "r") as file:
            return json.load(file)
    return {} 

def save_users(users):

    with open(USER_DATA_FILE, "w") as file:
        json.dump(users, file, indent=4)

users = load_users()

def add_user(username, password):
    if username in users:
        return False  
    users[username] = {
        "password": password,
        "role": "Customer"
    }
    save_users(users) 
    return True
