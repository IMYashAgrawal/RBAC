import React, { useState, useEffect } from "react";
import { login, getSelfCaptcha } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function validateUsername(username) {
  return /^[a-zA-Z0-9_]{4,}$/.test(username);
}
function validatePassword(password) {
  return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(password);
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [errors, setErrors] = useState({});
  const [captchaError, setCaptchaError] = useState('');
  const navigate = useNavigate();

  // Fetch math captcha on mount/refresh
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    const res = await getSelfCaptcha();
    setCaptchaQuestion(res.question);
    setCaptchaInput('');
    setCaptchaError('');
  };

  useEffect(() => {
    const newErrors = {};
    if (username && !validateUsername(username)) {
      newErrors.username = "Username: min 4 chars, letters/numbers/_ only";
    }
    if (password && !validatePassword(password)) {
      newErrors.password = "Password: min 8 chars, 1 letter, 1 number, 1 special";
    }
    setErrors(newErrors);
  }, [username, password]);

  const isFormValid =
    validateUsername(username) &&
    validatePassword(password) &&
    captchaInput.length > 0;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      await login(username, password, captchaInput.trim());
      navigate("/dashboard");
    } catch (err) {
      setCaptchaError(
        err?.response?.data?.error?.includes("CAPTCHA")
          ? "Incorrect answer. Try again."
          : "Login failed."
      );
      fetchCaptcha(); // Refresh challenge after error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <div className="w-full max-w-md bg-[#16181c] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-7 text-center tracking-wide drop-shadow-lg">
          Login
        </h1>
        <form className="space-y-5" onSubmit={handleLogin}>
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
            autoComplete="current-password"
          />
          {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          <div className="flex items-center space-x-3">
            <span className="font-semibold">{captchaQuestion}</span>
            <button type="button" className="text-blue-400" onClick={fetchCaptcha} title="Reload Captcha">↻</button>
          </div>
          <input
            className="w-full px-4 py-2 bg-[#23272f] text-gray-100 border border-gray-700 rounded-xl focus:outline-none focus:border-green-500 transition"
            type="text"
            placeholder="Answer"
            value={captchaInput}
            onChange={e => setCaptchaInput(e.target.value)}
            required
          />
          {captchaError && (
            <div className="text-red-400 text-sm text-center">{captchaError}</div>
          )}
          <button
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold text-lg shadow-lg hover:scale-105 active:scale-95 transition ${!isFormValid ? "opacity-60 cursor-not-allowed" : ""}`}
            type="submit"
            disabled={!isFormValid}
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline hover:text-green-400 transition">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
