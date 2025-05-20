from auth_data import users, hash_string_to_50

def authenticate(username, password):
    """
    Verify a user's credentials. Both username and password are hashed and compared
    against stored values:contentReference[oaicite:4]{index=4}.
    """
    # Hash the provided username to find the stored user entry.
    hashed_username = hash_string_to_50(username)
    user = users.get(hashed_username)
    if not user:
        # No such user (in hashed form).
        return None
    # Hash the provided password and compare to stored hash.
    hashed_password = hash_string_to_50(password)
    if user["password"] == hashed_password:
        return user["role"]
    else:
        return None
