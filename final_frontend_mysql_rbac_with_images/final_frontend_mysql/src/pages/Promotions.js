import React, { useEffect, useState } from "react";
import axios from "axios";

const ROLES = [
  { id: 10, name: "Admin" },
  { id: 1, name: "Customer" },
  { id: 5, name: "Customer Service" },
  { id: 4, name: "Delivery Personnel" },
  { id: 7, name: "Finance Team" },
  { id: 8, name: "IT Team" },
  { id: 9, name: "Legal Team" },
  { id: 6, name: "Marketing Team" },
  { id: 2, name: "Vendor" },
  { id: 3, name: "Warehouse Staff" },
];

const Promotions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.get("/api/users-roles");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userid, newRoleId) => {
    setUpdatingUserId(userid);
    setError("");
    setMessage("");
    try {
      await axios.post("/api/update-role", { userid, role_id: newRoleId });
      setUsers((prev) =>
        prev.map((user) =>
          user.userid === userid
            ? {
                ...user,
                role_id: newRoleId,
                role_name: ROLES.find((r) => r.id === newRoleId)?.name || user.role_name,
              }
            : user
        )
      );
      setMessage("Promotions updated");
    } catch (err) {
      setError("Failed to update role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleUpdateChanges = () => {
    fetchUsers();
  };

  if (loading) return <p className="text-gray-300 p-4">Loading users...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">User Role Promotions</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800 p-4">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-700 text-white">
              {/* Changed header text from User ID (Hashed) to Username */}
              <th className="border border-gray-600 p-2">Username</th>
              <th className="border border-gray-600 p-2">Current Role</th>
              <th className="border border-gray-600 p-2">Update Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4">
                  No users found.
                </td>
              </tr>
            )}
            {users.map(({ userid, uname, role_id, role_name }) => (
              <tr key={userid} className="hover:bg-gray-700">
                {/* Show uname instead of hashed userid */}
                <td className="border border-gray-600 p-2">{uname || "N/A"}</td>
                <td className="border border-gray-600 p-2">{role_name}</td>
                <td className="border border-gray-600 p-2">
                  <select
                    value={role_id}
                    onChange={(e) => handleRoleChange(userid, Number(e.target.value))}
                    disabled={updatingUserId === userid}
                    className="bg-gray-800 text-white p-1 rounded"
                  >
                    {ROLES.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleUpdateChanges}
          className="px-6 py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition"
        >
          Update Changes
        </button>
      </div>

      {message && (
        <p className="mt-4 text-center text-green-400 font-medium">{message}</p>
      )}
    </div>
  );
};

export default Promotions;
