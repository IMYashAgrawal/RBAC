from flask import Flask, render_template, request, redirect, url_for, session, flash
from auth_functions import authenticate
from auth_data import add_user
from rbac_functions import has_permission

app = Flask(__name__)
app.secret_key = "supersecretkey"  # Use a secure key in production.

@app.route("/", methods=["GET", "POST"])
def login():
    """Login route: ask users for their credentials."""
    if request.method == "POST":
        username = request.form.get("username").strip()
        password = request.form.get("password").strip()

        role = authenticate(username, password)
        if role:
            session["username"] = username
            session["role"] = role
            return redirect(url_for("home"))
        else:
            flash("Invalid credentials. Please try again.")
            return redirect(url_for("login"))
    return render_template("login.html")

@app.route("/signup", methods=["GET", "POST"])
def signup():
    """Sign-up route: allow users to create an account."""
    if request.method == "POST":
        username = request.form.get("username").strip()
        password = request.form.get("password").strip()
        confirm_password = request.form.get("confirm_password").strip()

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
    """Home route: display a dashboard for checking resource access."""
    if "username" not in session:
        return redirect(url_for("login"))

    username = session.get("username")
    role = session.get("role")
    message = None

    if request.method == "POST":
        resource = request.form.get("resource")
        access_type = request.form.get("access_type")
        if has_permission(role, resource, access_type):
            message = f"Access granted: {role} has {access_type} permission on {resource}."
        else:
            message = f"Access denied: {role} does NOT have {access_type} permission on {resource}."

    return render_template("home.html", username=username, role=role, message=message)

@app.route("/logout")
def logout():
    """Clear session data on logout."""
    session.clear()
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)
