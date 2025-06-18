import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../auth";

function validatePassword(password) {
  return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(password);
}
function getPasswordStrength(password) {
  let score = 0;
  if (!password) return { score, label: "Too short", color: "bg-red-500" };
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&#]/.test(password)) score++;
  if (password.length >= 12) score++;
  if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Moderate", color: "bg-yellow-500" };
  if (score === 5) return { score, label: "Strong", color: "bg-green-400" };
  return { score, label: "Very Strong", color: "bg-blue-500" };
}
function getStrengthTextColor(strength) {
  switch (strength.label) {
    case "Weak":
      return "text-red-400";
    case "Moderate":
      return "text-yellow-400";
    case "Strong":
      return "text-green-400";
    case "Very Strong":
      return "text-blue-400";
    default:
      return "text-red-400";
  }
}

const EditProfile = () => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (newPassword && !validatePassword(newPassword)) {
      setError("Password: min 8 chars, 1 letter, 1 number, 1 special");
    } else {
      setError("");
    }
  }, [newPassword]);

  const handleChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) {
      setError("Password: min 8 chars, 1 letter, 1 number, 1 special");
      return;
    }
    try {
      const res = await axios.post("/api/update-password", {
        username: user.username,
        newPassword,
      });
      setMessage(res.data.message);
      setNewPassword("");
    } catch {
      setMessage("Failed to update password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-4">
      <div className="w-full max-w-md bg-[#16181c] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-7 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={newPassword}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full px-4 py-3 mb-2 bg-[#23272f] text-gray-100 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition"
          />
          {/* Password strength meter */}
          {newPassword && (
            <div className="mb-2">
              <div className="w-full h-2 rounded bg-gray-700 mt-1">
                <div
                  className={`h-2 rounded transition-all duration-300 ${getPasswordStrength(newPassword).color}`}
                  style={{
                    width: `${(getPasswordStrength(newPassword).score / 6) * 100}%`,
                    minWidth: '8%'
                  }}
                ></div>
              </div>
              <div className={`text-xs mt-1 font-semibold ${getStrengthTextColor(getPasswordStrength(newPassword))}`}>
                {getPasswordStrength(newPassword).label}
              </div>
            </div>
          )}
          {error && <p className="text-red-400 mb-2 text-sm">{error}</p>}
          <button
            type="submit"
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold text-lg shadow-lg hover:scale-105 active:scale-95 transition ${error || !newPassword ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={!!error || !newPassword}
          >
            Update Password
          </button>
        </form>
        {message && <p className="mt-4 text-green-400 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default EditProfile;
