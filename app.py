from flask import Flask, render_template, request, redirect, url_for, session, flash
from auth_functions import authenticate
from auth_data import add_user
from rbac_functions import has_permission
import re
import logging
from security_logger import configure_logging

app = Flask(__name__)
app.secret_key = "supersecretkey"  # Use a secure key in production

# Configure SIEM logging
configure_logging(app)

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

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username").strip()
        password = request.form.get("password").strip()
        ip_address = request.remote_addr
        
        role = authenticate(username, password)
        if role:
            app.logger.info('Login success', extra={
                'event_type': 'AUTHENTICATION',
                'user': username,
                'ip_address': ip_address
            })
            session["username"] = username
            session["role"] = role
            return redirect(url_for("home"))
        else:
            app.logger.warning('Login failed', extra={
                'event_type': 'AUTHENTICATION_FAILURE',
                'user': username,
                'ip_address': ip_address
            })
            flash("Invalid credentials. Please try again.")
            return redirect(url_for("login"))

    return render_template("login.html")

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get("username").strip()
        password = request.form.get("password").strip()
        confirm_password = request.form.get("confirm_password").strip()
        ip_address = request.remote_addr

        if not is_valid_username(username):
            flash("Invalid username. Use 3–20 alphanumeric characters or underscores.")
            return redirect(url_for("signup"))

        if not is_valid_password(password):
            flash("Password must be at least 8 characters, include uppercase, lowercase, digit, and special character.")
            return redirect(url_for("signup"))

        if password != confirm_password:
            flash("Passwords do not match. Please try again.")
            return redirect(url_for("signup"))

        if add_user(username, password):
            app.logger.info('User registered', extra={
                'event_type': 'USER_REGISTRATION',
                'user': username,
                'ip_address': ip_address
            })
            flash("Account created successfully! You can now log in.")
            return redirect(url_for("login"))
        else:
            flash("Username already exists. Please choose a different one.")
            return redirect(url_for("signup"))

    return render_template("signup.html")

@app.route("/home", methods=["GET", "POST"])
def home():
    if "username" not in session:
        return redirect(url_for("login"))

    username = session.get("username")
    role = session.get("role")
    message = None
    ip_address = request.remote_addr

    if request.method == "POST":
        resource = request.form.get("resource").strip()
        access_type = request.form.get("access_type").strip()

        if has_permission(role, resource, access_type):
            app.logger.info('Access granted', extra={
                'event_type': 'ACCESS_CHECK',
                'user': username,
                'ip_address': ip_address,
                'details': f"{role} {access_type} on {resource}"
            })
            message = f"Access granted: {role} has {access_type} permission on {resource}."
        else:
            app.logger.warning('Access denied', extra={
                'event_type': 'ACCESS_DENIED',
                'user': username,
                'ip_address': ip_address,
                'details': f"{role} {access_type} on {resource}"
            })
            message = f"Access denied: {role} does NOT have {access_type} permission on {resource}."

    return render_template("home.html", username=username, role=role, message=message)

@app.route("/logout")
def logout():
    username = session.get("username", "unknown")
    ip_address = request.remote_addr
    session.clear()
    app.logger.info('User logged out', extra={
        'event_type': 'LOGOUT',
        'user': username,
        'ip_address': ip_address
    })
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",    # Or use "0.0.0.0" to expose publicly
        port=5000,           # Or another port if 5000 is in use
        debug=True,
        use_reloader=False  # Important: Prevents Flask from restarting and exiting in some environments
    )
