import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AuthModal.css";

function AuthModal({ isOpen, onClose, initialMode = "login", customPrompt = "", onSuccess = null }) {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === "login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLoginMode) {
        await login(formData.email, formData.password);
      } else {
        await register(
          formData.name,
          formData.email,
          formData.phone,
          formData.password
        );
      }
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="auth-modal-header">
          <span className="auth-brand-badge">GJ Enterprise</span>
          <h2>{isLoginMode ? "Welcome Back" : "Create Account"}</h2>
          {customPrompt ? (
            <div style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#1e3a8a",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "600",
              margin: "12px 0 6px",
              textAlign: "center"
            }}>
              {customPrompt}
            </div>
          ) : (
            <p>
              {isLoginMode
                ? "Sign in to manage your bookings and enquiries"
                : "Register to unlock exclusive travel packages & track bookings"}
            </p>
          )}
        </div>

        {error && <div className="auth-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLoginMode && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Kumar"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. user@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {!isLoginMode && (
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 9876543210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading
              ? "Please wait..."
              : isLoginMode
              ? "Sign In →"
              : "Create Account →"}
          </button>

          {isLoginMode && (
            <button
              type="button"
              className="btn-demo-autofill"
              onClick={() => {
                setFormData({
                  ...formData,
                  email: "customer@gjenterprise.com",
                  password: "Customer@123",
                });
              }}
              style={{
                width: "100%",
                background: "#f1f5f9",
                border: "1px dashed #cbd5e1",
                color: "#475569",
                padding: "8px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "700",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              ⚡ Fill Sample Customer (customer@gjenterprise.com)
            </button>
          )}
        </form>

        <div className="auth-toggle-mode">
          <p>
            {isLoginMode
              ? "Don't have an account yet?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              className="toggle-link"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError("");
              }}
            >
              {isLoginMode ? "Register here" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
