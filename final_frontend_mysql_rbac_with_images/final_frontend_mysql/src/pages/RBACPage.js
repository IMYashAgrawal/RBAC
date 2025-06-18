import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../auth";
import permissions from "../roles/permissions";

const RBACPage = () => {
  const { page } = useParams();        // e.g. "product-info"
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4 text-white">Loading...</div>;
  if (!user)    return <Navigate to="/" />;

  // turn "product-info" → "Product Info"
  const displayName = page
    .split("-")
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  const perm = permissions[user.role]?.[displayName];

  // if they have no access, send them to /unauthorized
  if (!perm || perm === "NA") return <Navigate to="/unauthorized" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <div className="w-full max-w-xl bg-[#16181c] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-white">{displayName}</h2>
        <p className="text-lg text-gray-300">
          You have <span className="font-bold text-green-400">{perm}</span> access to this page.
        </p>
        {/* TODO: render the real content for {displayName} here */}
      </div>
    </div>
  );
};

export default RBACPage;
