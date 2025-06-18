import React from 'react';
import { Link } from 'react-router-dom';

const AllPagesPreview = () => {
  const pages = [
    "dashboard",
    "productInfo",
    "orderInfo",
    "userProfiles",
    "inventoryData",
    "paymentInfo",
    "shippingData",
    "reviews",
    "analytics",
    "promotions",
    "adminSettings",
    "legalData"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-4">
      <div className="w-full max-w-xl bg-[#16181c] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center"> Preview All Pages</h1>
        <ul className="list-disc list-inside space-y-3 text-gray-200">
          {pages.map((page) => (
            <li key={page}>
              <Link
                to={`/${page}`}
                className="text-blue-400 hover:underline hover:text-green-400 transition"
              >
                /{page}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllPagesPreview;
