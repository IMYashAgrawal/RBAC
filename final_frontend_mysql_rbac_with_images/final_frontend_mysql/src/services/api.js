import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Required for session-based self-captcha!
});

// Login and signup now take a third 'self_captcha' param
export const login = (username, password, self_captcha) =>
  api.post("/api/login", { username, password, self_captcha });

export const signup = (username, password, self_captcha) =>
  api.post("/api/register", { username, password, self_captcha });

// Get the math captcha challenge/question
export const getSelfCaptcha = () =>
  api.get("/api/self-captcha").then(res => res.data);

export const logout = () => Promise.resolve();

export const fetchUserProfile = () => {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  if (!stored.username) {
    return Promise.reject(new Error("No username in localStorage"));
  }
  return api.get(`/api/profile?username=${stored.username}`);
};

export default api;
