import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from './auth';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Unauthorized from './pages/Unauthorized';
import RBACPage from './pages/RBACPage';
import OrderInfo from './pages/OrderInfo';
import ProductInfo from './pages/ProductInfo';
import UserProfiles from './pages/UserProfiles';
import InventoryData from './pages/InventoryData';
import PaymentInfo from './pages/PaymentInfo';
import ShippingData from './pages/ShippingData';
import Reviews from './pages/Reviews';
import Analytics from './pages/Analytics';
import Promotions from './pages/Promotions';
import AdminSettings from './pages/AdminSettings';
import LegalData from './pages/LegalData';

// --- Validation helpers ---
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

function LoginOrRegister() {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [view, setView] = useState('login');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  // Fetch math captcha on mount and when switching views
  useEffect(() => {
    fetchCaptcha();
  }, [view]);

  // Get captcha question from backend
  const fetchCaptcha = async () => {
    try {
      const res = await axios.get('/api/self-captcha', { withCredentials: true });
      setCaptchaQuestion(res.data.question);
      setCaptchaInput('');
      setCaptchaError('');
    } catch (err) {
      setCaptchaQuestion("Failed to load captcha");
    }
  };

  // Live validation effect
  useEffect(() => {
    const newErrors = {};
    if (form.username && !validateUsername(form.username)) {
      newErrors.username = "Username: min 4 chars, letters/numbers/_ only";
    }
    if (form.password && !validatePassword(form.password)) {
      newErrors.password = "Password: min 8 chars, 1 letter, 1 number, 1 special";
    }
    if (view === "register" && form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
  }, [form, view]);

  const isFormValid =
    validateUsername(form.username) &&
    validatePassword(form.password) &&
    (view === "login" || form.password === form.confirmPassword) &&
    captchaInput.length > 0;

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isFormValid) return;
    if (view === 'register') {
      try {
        const res = await axios.post('/api/register', {
          username: form.username,
          password: form.password,
          self_captcha: captchaInput.trim()
        }, { withCredentials: true });
        setMessage(res.data.message || 'Registered');
        fetchCaptcha();
      } catch (err) {
        setMessage(err.response?.data?.error || 'Error');
        if (err.response?.data?.error?.includes('CAPTCHA')) {
          setCaptchaError("Incorrect answer. Try again.");
          fetchCaptcha();
        }
      }
    } else {
      // Pass captchaInput to signIn!
      const ok = await signIn(form.username, form.password, captchaInput.trim());
      if (ok) {
        navigate('/home');
      } else {
        setMessage('Invalid credentials');
        fetchCaptcha();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#16181c] rounded-2xl shadow-2xl p-8 border border-gray-800"
      >
        <h1 className="text-3xl font-bold text-white mb-7 text-center tracking-wide drop-shadow-lg">
          {view === 'register' ? 'Register' : 'Login'}
        </h1>
        <input
          name="username"
          onChange={handleChange}
          value={form.username}
          placeholder="Username"
          className="w-full mb-1 px-4 py-3 bg-[#23272f] text-gray-100 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition"
        />
        {errors.username && <p className="text-red-400 mb-2 text-sm">{errors.username}</p>}
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={form.password}
          placeholder="Password"
          className="w-full mb-1 px-4 py-3 bg-[#23272f] text-gray-100 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition"
        />
        {/* Password strength meter (REGISTER only) */}
        {view === 'register' && form.password && (
          <div className="mb-2">
            <div className="w-full h-2 rounded bg-gray-700 mt-1">
              <div
                className={`h-2 rounded transition-all duration-300 ${getPasswordStrength(form.password).color}`}
                style={{
                  width: `${(getPasswordStrength(form.password).score / 6) * 100}%`,
                  minWidth: '8%'
                }}
              ></div>
            </div>
            <div className={`text-xs mt-1 font-semibold ${getStrengthTextColor(getPasswordStrength(form.password))}`}>
              {getPasswordStrength(form.password).label}
            </div>
          </div>
        )}
        {errors.password && <p className="text-red-400 mb-2 text-sm">{errors.password}</p>}
        {view === 'register' && (
          <>
            <input
              name="confirmPassword"
              type="password"
              onChange={handleChange}
              value={form.confirmPassword}
              placeholder="Confirm Password"
              className="w-full mb-1 px-4 py-3 bg-[#23272f] text-gray-100 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition"
            />
            {errors.confirmPassword && <p className="text-red-400 mb-2 text-sm">{errors.confirmPassword}</p>}
          </>
        )}
        {/* --- SELF CAPTCHA START --- */}
        <div className="flex items-center space-x-3 mt-2 mb-2">
          <span className="font-semibold">{captchaQuestion}</span>
          <button type="button" className="text-blue-400" onClick={fetchCaptcha} title="Reload Captcha">↻</button>
        </div>
        <input
          type="text"
          placeholder="Answer"
          value={captchaInput}
          onChange={e => setCaptchaInput(e.target.value)}
          className="w-full mb-1 px-4 py-2 bg-[#23272f] text-gray-100 border border-gray-700 rounded-xl focus:outline-none focus:border-green-500 transition"
        />
        {captchaError && <div className="text-red-400 text-sm text-center">{captchaError}</div>}
        {/* --- SELF CAPTCHA END --- */}
        <button
          type="submit"
          className={`w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold text-lg shadow-lg hover:scale-105 active:scale-95 transition ${!isFormValid ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={!isFormValid}
        >
          {view === 'register' ? 'Register' : 'Login'}
        </button>
        <p className="mt-6 text-center text-gray-400">
          {view === 'register' ? 'Have an account?' : 'No account?'}{' '}
          <button
            type="button"
            onClick={() => { setView(v => (v === 'register' ? 'login' : 'register')); fetchCaptcha(); }}
            className="text-blue-400 hover:underline hover:text-green-400 transition"
          >
            {view === 'register' ? 'Login' : 'Register'}
          </button>
        </p>
        {message && <p className="mt-2 text-center text-red-400">{message}</p>}
      </form>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginOrRegister />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/order-info" element={<OrderInfo />} />
          <Route path="/product-info" element={<ProductInfo />} />
          <Route path="/user-profiles" element={<UserProfiles />} />
          <Route path="/inventory-data" element={<InventoryData />} />
          <Route path="/payment-info" element={<PaymentInfo />} />
          <Route path="/shipping-data" element={<ShippingData />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
          <Route path="/legal-data" element={<LegalData />} />
          <Route path="/:page" element={<RBACPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

