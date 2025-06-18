import React from "react";

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
    <div className="bg-[#16181c] p-10 rounded-2xl shadow-2xl border border-gray-800 text-center">
      <h1 className="text-4xl font-bold text-red-400 mb-4">403 - Unauthorized</h1>
      <p className="text-gray-300">You do not have permission to access this page.</p>
    </div>
  </div>
);

export default Unauthorized;
