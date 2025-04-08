from flask import Flask, render_template, request, redirect, url_for, session, flash
from authFunction import authenticate
from permissionFunction import has_permission

app = Flask(__name__)
app.secret_key = "supersecretkey"  # Recall: In production, use a secure key and environment variables.

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
