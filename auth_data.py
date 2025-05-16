import json
import os
import re

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

def is_valid_username(username):
    # Must be alphanumeric and between 3 to 20 characters
    return bool(re.fullmatch(r"[A-Za-z0-9_]{3,20}", username))

def is_valid_password(password):
    # Minimum 8 characters, at least one uppercase, one lowercase, one digit, and one special character
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
        print("Invalid username. Must be 3–20 characters long and alphanumeric (underscores allowed).")
        return False
    if not is_valid_password(password):
        print("Invalid password. Must be at least 8 characters long, include uppercase, lowercase, digit, and special character.")
        return False
    if username in users:
        print("Username already exists.")
        return False

    users[username] = {
        "password": password,
        "role": "Customer"
    }
    save_users(users)
    print("User added successfully.")
    return True
