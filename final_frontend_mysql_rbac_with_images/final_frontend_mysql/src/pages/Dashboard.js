import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth";
import permissions from "../roles/permissions";

const sampleProducts = [
  { name: "iPhone 15", image: "https://via.placeholder.com/150?text=iPhone+15" },
  // ... Add more products as needed
];

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4 text-white">Loading...</div>;
  if (!user)    return <Navigate to="/" />;

  const hasProductAccess = permissions[user.role]["Product Info"] !== "NA";
  const pages = Object.entries(permissions[user.role])
    .filter(([, perm]) => perm !== "NA")
    .map(([name]) => ({
      name,
      path: `/${name.toLowerCase().replace(/ /g, "-")}`
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Welcome, {user.username}</h2>

      {hasProductAccess && (
        <div className="mb-10">
          <h3 className="text-2xl font-semibold mb-4 text-gray-200">Available Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {sampleProducts.map((p, i) => (
              <div key={i} className="bg-[#23272f] rounded-2xl shadow-lg p-4 text-center border border-gray-800">
                <img src={p.image} alt={p.name} className="mx-auto mb-4 rounded-xl" />
                <p className="font-medium text-gray-100">{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pages.map((p, i) => (
          <Link
            key={i}
            to={p.path}
            className="p-5 bg-[#23272f] rounded-2xl shadow border border-gray-700 text-center text-lg text-gray-100 font-semibold hover:bg-[#20232a] transition"
          >
            {p.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/edit-profile" className="text-blue-400 hover:underline hover:text-green-400 transition">
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
