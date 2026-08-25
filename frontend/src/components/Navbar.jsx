import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="navbar-logo">
            GJ Enterprise
          </div>
        </Link>

        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/destinations">Destinations</Link>
          <Link to="/services">Services</Link>
          <Link to="/dashboard">My Trips</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isLoggedIn ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  background: '#eff6ff',
                  border: '1.5px solid #bfdbfe',
                  color: '#1e3a8a',
                  padding: '8px 16px',
                  borderRadius: '25px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                👤 {user?.name || 'My Account'} ▾
              </button>

              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '42px',
                    right: 0,
                    background: '#ffffff',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                    borderRadius: '10px',
                    padding: '8px 0',
                    minWidth: '160px',
                    zIndex: 1001,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '12px', color: '#64748b' }}>
                    {user?.email}
                  </div>
                  <Link
                    to="/dashboard"
                    style={{
                      display: 'block',
                      padding: '8px 16px',
                      color: '#1e3a8a',
                      fontWeight: '700',
                      textDecoration: 'none',
                      fontSize: '14px',
                    }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    ✈️ My Bookings & Tours
                  </Link>
                  <Link
                    to="/dashboard"
                    style={{
                      display: 'block',
                      padding: '8px 16px',
                      color: '#334155',
                      textDecoration: 'none',
                      fontSize: '14px',
                    }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    📝 My Enquiries
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              style={{
                background: 'transparent',
                border: '1.5px solid #1e3a8a',
                color: '#1e3a8a',
                padding: '9px 18px',
                borderRadius: '25px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Sign In
            </button>
          )}

          <Link to="/contact" className="navbar-button">
            Enquire Now
          </Link>
        </div>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}

export default Navbar;