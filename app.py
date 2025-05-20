# from flask import Flask, render_template, request, redirect, url_for, session, flash
# from auth_functions import authenticate
# from auth_data import add_user
# from rbac_functions import has_permission

# app = Flask(__name__)
# app.secret_key = "supersecretkey"  # Use a secure key in production.

# @app.route("/", methods=["GET", "POST"])
# def login():
#     """Login route: ask users for their credentials."""
#     if request.method == "POST":
#         username = request.form.get("username").strip()
#         password = request.form.get("password").strip()

#         role = authenticate(username, password)
#         if role:
#             session["username"] = username
#             session["role"] = role
#             return redirect(url_for("home"))
#         else:
#             flash("Invalid credentials. Please try again.")
#             return redirect(url_for("login"))
#     return render_template("login.html")

# @app.route("/signup", methods=["GET", "POST"])
# def signup():
#     """Sign-up route: allow users to create an account."""
#     if request.method == "POST":
#         username = request.form.get("username").strip()
#         password = request.form.get("password").strip()
#         confirm_password = request.form.get("confirm_password").strip()

#         if password != confirm_password:
#             flash("Passwords do not match. Please try again.")
#             return redirect(url_for("signup"))

#         if add_user(username, password):
#             flash("Account created successfully! You can now log in.")
#             return redirect(url_for("login"))
#         else:
#             flash("Username already exists. Please choose a different one.")
#             return redirect(url_for("signup"))

#     return render_template("signup.html")

# @app.route("/home", methods=["GET", "POST"])
# def home():
#     """Home route: display a dashboard for checking resource access."""
#     if "username" not in session:
#         return redirect(url_for("login"))

#     username = session.get("username")
#     role = session.get("role")
#     message = None

#     if request.method == "POST":
#         resource = request.form.get("resource")
#         access_type = request.form.get("access_type")
#         if has_permission(role, resource, access_type):
#             message = f"Access granted: {role} has {access_type} permission on {resource}."
#         else:
#             message = f"Access denied: {role} does NOT have {access_type} permission on {resource}."

#     return render_template("home.html", username=username, role=role, message=message)

# @app.route("/logout")
# def logout():
#     """Clear session data on logout."""
#     session.clear()
#     return redirect(url_for("login"))

# if __name__ == "__main__":
#     app.run(debug=True)









# from flask import Flask, render_template, request, redirect, url_for, session, flash
# from auth_functions import authenticate
# from auth_data import add_user
# from rbac_functions import has_permission
# import re  # For input validation

# app = Flask(__name__)
# app.secret_key = "supersecretkey"  # Use a secure key in production.

# # ---------------------------
# # Input Validation Functions
# # ---------------------------
# def is_valid_username(username):
#     # Username must be 3–20 characters, alphanumeric or underscores
#     return bool(re.fullmatch(r"[A-Za-z0-9_]{3,20}", username))

# def is_valid_password(password):
#     # Password must meet complexity requirements
#     if len(password) < 8:
#         return False
#     if not re.search(r"[A-Z]", password):
#         return False
#     if not re.search(r"[a-z]", password):
#         return False
#     if not re.search(r"\d", password):
#         return False
#     if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
#         return False
#     if re.search(r"\s", password):
#         return False
#     return True

# # ---------------------------
# # Routes
# # ---------------------------
# @app.route("/", methods=["GET", "POST"])
# def login():
#     """Login route: ask users for their credentials."""
#     if request.method == "POST":
#         username = request.form.get("username").strip()
#         password = request.form.get("password").strip()

#         role = authenticate(username, password)
#         if role:
#             session["username"] = username
#             session["role"] = role
#             return redirect(url_for("home"))
#         else:
#             flash("Invalid credentials. Please try again.")
#             return redirect(url_for("login"))
#     return render_template("login.html")

# @app.route("/signup", methods=["GET", "POST"])
# def signup():
#     """Sign-up route: allow users to create an account with validation."""
#     if request.method == "POST":
#         username = request.form.get("username").strip()
#         password = request.form.get("password").strip()
#         confirm_password = request.form.get("confirm_password").strip()

#         if not is_valid_username(username):
#             flash("Invalid username. Use 3–20 alphanumeric characters or underscores.")
#             return redirect(url_for("signup"))

#         if not is_valid_password(password):
#             flash("Password must be at least 8 characters, include uppercase, lowercase, digit, and special character.")
#             return redirect(url_for("signup"))

#         if password != confirm_password:
#             flash("Passwords do not match. Please try again.")
#             return redirect(url_for("signup"))

#         if add_user(username, password):
#             flash("Account created successfully! You can now log in.")
#             return redirect(url_for("login"))
#         else:
#             flash("Username already exists. Please choose a different one.")
#             return redirect(url_for("signup"))

#     return render_template("signup.html")

# @app.route("/home", methods=["GET", "POST"])
# def home():
#     """Home route: display a dashboard for checking resource access."""
#     if "username" not in session:
#         return redirect(url_for("login"))

#     username = session.get("username")
#     role = session.get("role")
#     message = None

#     if request.method == "POST":
#         resource = request.form.get("resource")
#         access_type = request.form.get("access_type")
#         if has_permission(role, resource, access_type):
#             message = f"Access granted: {role} has {access_type} permission on {resource}."
#         else:
#             message = f"Access denied: {role} does NOT have {access_type} permission on {resource}."

#     return render_template("home.html", username=username, role=role, message=message)

# @app.route("/logout")
# def logout():
#     """Clear session data on logout."""
#     session.clear()
#     return redirect(url_for("login"))

# if __name__ == "__main__":
#     app.run(debug=True)









from flask import Flask, render_template, request, redirect, url_for, session, flash
#using the render template for rendering html,redirect,url_forurl routing and request for handling request 
from auth_functions import authenticate
#using authenticate for checking username and password 
from auth_data import add_user
# using add_user for adding new user
from rbac_functions import has_permission
#using has_permission for checking the permission of the user
import re  
# For input validation

app = Flask(__name__)
#creating an instance of Flask class
app.secret_key = "supersecretkey"  # Use a secure key in production.


def is_valid_username(username):
    return bool(re.fullmatch(r"[A-Za-z0-9_]{3,20}", username))
# Username must be 3–20 characters, alphanumeric or underscores

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
# Password must meet all these creteria


@app.route("/", methods=["GET", "POST"])
#creating a route for login page
def login():
    if request.method == "POST":
        #taking the username and password from the login page
        username = request.form.get("username").strip()
        password = request.form.get("password").strip()
        #taking the username and password from the login page 
        role = authenticate(username, password)
        #checking the username and password is valid or not 
        if role:
            session["username"] = username
            session["role"] = role
            return redirect(url_for("home"))
        #if the username and password is valid then going to the home page
        else:
            flash("Invalid credentials. Please try again.")
            return redirect(url_for("login"))
        #if the username and password is not valid then going to the login page again

    return render_template("login.html")
#returning  the login page

@app.route("/signup", methods=["GET", "POST"])
#creating a route for signup page
def signup():
    if request.method == "POST":
        #taking the username and password and confirm_password(it must be same as password) from the signup page
        username = request.form.get("username").strip()
        password = request.form.get("password").strip()
        confirm_password = request.form.get("confirm_password").strip()

        if not is_valid_username(username):
            flash("Invalid username. Use 3–20 alphanumeric characters or underscores.")
            return redirect(url_for("signup"))
        #checking the username is valid or not by checking the creteria of username is passed or not

        if not is_valid_password(password):
            flash("Password must be at least 8 characters, include uppercase, lowercase, digit, and special character.")
            return redirect(url_for("signup"))
        #checking the password is valid or not by checking the creteria of password  is passed or not

        if password != confirm_password:
            flash("Passwords do not match. Please try again.")
            return redirect(url_for("signup"))

        if add_user(username, password):
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
    #checking the username is in session or not

    username = session.get("username")
    role = session.get("role")
    message = None
    #taking the username and role from the session

    if request.method == "POST":
        resource = request.form.get("resource").strip()
        access_type = request.form.get("access_type").strip()
        #taking the resource and access_type from the home page 

        # Use new RBAC backend (SQL)
        if has_permission(role, resource, access_type):
            message = f"Access granted: {role} has {access_type} permission on {resource}."
        else:
            message = f"Access denied: {role} does NOT have {access_type} permission on {resource}."

    return render_template("home.html", username=username, role=role, message=message)

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)
