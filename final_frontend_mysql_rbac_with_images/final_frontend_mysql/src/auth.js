import React, { createContext, useContext, useEffect, useState } from "react";
import { login, logout, fetchUserProfile } from "./services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("user");
      })
      .finally(() => setLoading(false));
  }, []);

  // UPDATED: Pass self_captcha as third parameter!
  const signIn = async (username, password, self_captcha) => {
    try {
      const res = await login(username, password, self_captcha);
      if (res.data && res.data.message === "Login successful") {
        const userInfo = { username: res.data.username, role: res.data.role };
        setUser(userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const signOut = async () => {
    await logout();
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
