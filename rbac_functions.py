from rbac_data import rbac

def has_permission(role, resource, access_type="R"):
  
    role_perms = rbac.get(role)
    if role_perms is None:
        print(f"Role '{role}' not found.")
        return False  

    perm = role_perms.get(resource, "NA")
    
    if access_type == "R":
        return perm in ("R", "R/W")
    elif access_type == "W":
        return perm == "R/W"
    
    return False
