from matrix import rbac

def has_permission(role, resource, access_type="R"):

    role_perms = rbac.get(role)
    if role_perms is None:
        print(f"No such role: {role}")
        return False
    
    perm = role_perms.get(resource, "NA")
    
    if access_type == "R":
        return perm in ("R", "R/W")
    elif access_type == "W":
        return perm == "R/W"
    
    return False

print("Does Customer have write permissions on Order Info?",
      has_permission("Customer", "Order Info", "W"))  # Expected: True

print("Does Vendor have read access on User Profiles?",
      has_permission("Vendor", "User Profiles", "R"))  # Expected: False
