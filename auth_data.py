import json
import os
import re
import hashlib
import base64

USER_DATA_FILE = "users.json"
# This file manages user data (now storing hashed credentials).

def hash_string_to_50(input_str):
    """
    Compute SHA-256 hash of input_str and encode it in URL-safe Base64.
    Then truncate or pad the result to exactly 50 characters.
    """
    # SHA-256 produces 32 bytes.
    digest = hashlib.sha256(input_str.encode('utf-8')).digest()
    # URL-safe Base64 encoding (gives ~43 chars plus '=' padding).
    b64 = base64.urlsafe_b64encode(digest).decode('utf-8')
    # Remove any '=' padding from the end.
    b64 = b64.rstrip("=")
    # Ensure exactly 50 characters by padding or truncating.
    if len(b64) > 50:
        # Truncate if somehow longer (unlikely with SHA-256).
        b64 = b64[:50]
    else:
        # Pad with 'A' (a valid Base64 char) if shorter than 50.
        b64 = b64.ljust(50, 'A')
    return b64

def load_users():
    """
    Load the users from JSON file. If any usernames/passwords are in plain text
    (detected by length ≠ 50), convert them to hashed form and save.
    """
    if os.path.exists(USER_DATA_FILE):
        with open(USER_DATA_FILE, "r") as file:
            data = json.load(file)
        updated = {}
        for uname, info in data.items():
            # If the username is not already a 50-char hash, migrate it.
            if len(uname) != 50:
                # Hash the username and password for migration.
                hashed_uname = hash_string_to_50(uname)
                hashed_pass = hash_string_to_50(info["password"])
                # Preserve the role field as-is.
                updated[hashed_uname] = {"password": hashed_pass, "role": info["role"]}
            else:
                # Already hashed (formatted) username; keep as-is.
                updated[uname] = info
        # If we performed any migrations, save the updated data.
        if updated != data:
            save_users(updated)
        return updated
    return {}

def save_users(users):
    """Write the users dict to the JSON file (using indentation for readability)."""
    with open(USER_DATA_FILE, "w") as file:
        json.dump(users, file, indent=4)

# Load or migrate users at module import.
users = load_users()

def is_valid_username(username):
    # Must be alphanumeric or underscore, 3–20 chars.
    return bool(re.fullmatch(r"[A-Za-z0-9_]{3,20}", username))

def is_valid_password(password):
    # Minimum 8 chars, with uppercase, lowercase, digit, special char.
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
    """
    Validate and add a new user. Store only hashed username and hashed password.
    """
    # Validate the raw username/password first.
    if not is_valid_username(username):
        print("Invalid username. Must be 3–20 characters long and alphanumeric (underscores allowed).")
        return False
    if not is_valid_password(password):
        print("Invalid password. Must be at least 8 characters long, include uppercase, lowercase, digit, and special character.")
        return False

    # Hash credentials before storing:contentReference[oaicite:3]{index=3}.
    hashed_username = hash_string_to_50(username)
    hashed_password = hash_string_to_50(password)

    # Check if the hashed username already exists.
    if hashed_username in users:
        print("Username already exists.")
        return False

    # Store the hashed username and password.
    users[hashed_username] = {
        "password": hashed_password,
        "role": "Customer"
    }
    save_users(users)
    print("User added successfully.")
    return True
