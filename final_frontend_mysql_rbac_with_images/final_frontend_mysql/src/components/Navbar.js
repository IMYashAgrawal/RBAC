import React from "react";
import { useAuth } from "../auth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="navbar flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">RBAC E-commerce</div>

      {user ? (
        <div className="flex items-center space-x-4">
          <span>
            {user.username} ({user.role})
          </span>
          <button
            onClick={signOut}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <Link
            to="/login"
            className="hover:underline hover:text-gray-300"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="hover:underline hover:text-gray-300"
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
