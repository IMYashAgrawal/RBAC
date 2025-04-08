from authFunction import authenticate
from permissionFunction import has_permission

def main():
    print("Welcome to the Application!")
    
    # Simple login prompt
    username = input("Username: ").strip()
    password = input("Password: ").strip()
    
    # Authenticate user and get role
    role = authenticate(username, password)
    if role is None:
        print("Invalid credentials. Access denied.")
        return
    
    print(f"Welcome, {username}! Your role is: {role}")
    
    # Example: Let’s say the user wants to write to 'Order Info'
    resource = "Order Info"
    access_type = "W"  # Check for write permission
    
    print(f"\nAttempting to perform a '{access_type}' operation on '{resource}'...")
    if has_permission(role, resource, access_type):
        print(f"Access granted: {role} has the required permissions on {resource}.")
    else:
        print(f"Access denied: {role} does NOT have the required permissions on {resource}.")
        
if __name__ == "__main__":
    main()
