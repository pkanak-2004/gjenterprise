import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("customerToken") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("customerToken");
    const storedUser = localStorage.getItem("customerUser");

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem("customerToken");
        localStorage.removeItem("customerUser");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to login");
    }

    const userData = {
      name: data.name || email.split("@")[0],
      email: data.email || email,
      role: data.role || "CUSTOMER",
    };

    localStorage.setItem("customerToken", data.token);
    localStorage.setItem("customerUser", JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, phone, password) => {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to register");
    }

    const userData = {
      name: data.name || name,
      email: data.email || email,
      role: data.role || "CUSTOMER",
    };

    localStorage.setItem("customerToken", data.token);
    localStorage.setItem("customerUser", JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerUser");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!token,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
