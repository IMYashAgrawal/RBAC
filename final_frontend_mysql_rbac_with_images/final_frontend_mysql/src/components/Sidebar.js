import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import permissions from "../roles/permissions";

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const userPermissions = permissions[user.role] || [];

  const navItems = {
    dashboard: "Dashboard",
    productInfo: "Products",
    orderInfo: "Orders",
    userProfiles: "User Profiles",
    inventoryData: "Inventory",
    paymentInfo: "Payments",
    shippingData: "Shipping",
    reviews: "Reviews",
    analytics: "Analytics",
    promotions: "Promotions",
    adminSettings: "Admin Settings",
    legalData: "Legal",
  };

  return (
    <nav className="sidebar">
      <ul>
        {userPermissions.map((perm) => (
          <li key={perm}>
            <Link to={`/${perm}`}>{navItems[perm]}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;