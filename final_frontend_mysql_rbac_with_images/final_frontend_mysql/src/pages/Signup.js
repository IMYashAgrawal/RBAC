import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signup, getCaptchaUrl } from "../services/api";

function validateUsername(username) {
  return /^[a-zA-Z0-9_]{4,}$/.test(username);
}
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

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaUrl, setCaptchaUrl] = useState(getCaptchaUrl());
  const [errors, setErrors] = useState({});
  const [captchaError, setCaptchaError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const newErrors = {};
    if (username && !validateUsername(username)) {
      newErrors.username = "Username: min 4 chars, letters/numbers/_ only";
    }
    if (password && !validatePassword(password)) {
      newErrors.password = "Password: min 8 chars, 1 letter, 1 number, 1 special";
    }
    if (confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
  }, [username, password, confirmPassword]);

  const refreshCaptcha = () => setCaptchaUrl(getCaptchaUrl());

  const isFormValid =
    validateUsername(username) &&
    validatePassword(password) &&
    password === confirmPassword &&
    captcha.length === 5;

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      await signup(username, password, captcha);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      setCaptchaError(
        error?.response?.data?.error === "Invalid CAPTCHA"
          ? "Incorrect CAPTCHA. Try again."
          : "Signup failed. Please try again."
      );
      setCaptcha("");
      refreshCaptcha();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <div className="w-full max-w-md bg-[#16181c] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-7 text-center tracking-wide drop-shadow-lg">
          Sign Up
        </h1>
        <form className="space-y-5" onSubmit={handleSignup}>
          <input
            className="w-full px-4 py-3 bg-[#23272f] text-gray-100 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          {errors.username && <p className="text-red-400 text-sm">{errors.username}</p>}
          <input
            className="w-full px-4 py-3 bg-[#23272f] text-gray-100 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          {password && (
            <div className="mb-2">
              <div className="w-full h-2 rounded bg-gray-700 mt-1">
                <div
                  className={`h-2 rounded transition-all duration-300 ${getPasswordStrength(password).color}`}
                  style={{
                    width: `${(getPasswordStrength(password).score / 6) * 100}%`,
                    minWidth: '8%'
                  }}
                ></div>
              </div>
              <div className={`text-xs mt-1 font-semibold ${getStrengthTextColor(getPasswordStrength(password))}`}>
                {getPasswordStrength(password).label}
              </div>
            </div>
          )}
          {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          <input
            className="w-full px-4 py-3 bg-[#23272f] text-gray-100 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
          {/* --- CAPTCHA WIDGET START --- */}
          <div className="flex items-center space-x-3">
            <img src={captchaUrl} alt="captcha" className="h-12 rounded border" />
            <button type="button" className="text-blue-400" onClick={refreshCaptcha} title="Reload Captcha">↻</button>
          </div>
          <input
            className="w-full px-4 py-2 bg-[#23272f] text-gray-100 border border-gray-700 rounded-xl focus:outline-none focus:border-green-500 transition"
            type="text"
            placeholder="Enter CAPTCHA above"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value.toUpperCase())}
            maxLength={5}
            required
          />
          {captchaError && (
            <div className="text-red-400 text-sm text-center">{captchaError}</div>
          )}
          {/* --- CAPTCHA WIDGET END --- */}
          <button
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold text-lg shadow-lg hover:scale-105 active:scale-95 transition ${!isFormValid ? "opacity-60 cursor-not-allowed" : ""}`}
            type="submit"
            disabled={!isFormValid}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
