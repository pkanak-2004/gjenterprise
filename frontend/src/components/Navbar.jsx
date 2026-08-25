import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenus = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <Link to="/" style={{ textDecoration: 'none' }} onClick={closeMenus}>
          <div className="navbar-logo">
            GJ Enterprise
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="navbar-links">
          <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
          <Link to="/about" className={isActive('/about') ? 'active' : ''}>About</Link>
          <Link to="/destinations" className={isActive('/destinations') ? 'active' : ''}>Destinations</Link>
          <Link to="/services" className={isActive('/services') ? 'active' : ''}>Services</Link>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>My Trips</Link>
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link>
        </div>

        {/* Right Actions */}
        <div className="navbar-right-actions">
          {isLoggedIn ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="navbar-user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                👤 <span className="navbar-user-name">{user?.name ? user.name.split(' ')[0] : 'Account'}</span> ▾
              </button>

              {userMenuOpen && (
                <div className="navbar-user-dropdown">
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '12px', color: '#64748b' }}>
                    {user?.email}
                  </div>
                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={closeMenus}
                  >
                    ✈️ My Bookings & Tours
                  </Link>
                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={closeMenus}
                  >
                    📝 My Enquiries
                  </Link>
                  <button
                    type="button"
                    className="dropdown-item logout"
                    onClick={() => {
                      logout();
                      closeMenus();
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
              className="navbar-signin-btn"
              onClick={() => {
                setAuthModalOpen(true);
                closeMenus();
              }}
            >
              Sign In
            </button>
          )}

          <Link to="/contact" className="navbar-button desktop-only" onClick={closeMenus}>
            Enquire Now
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Down Menu Overlay */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-links">
            <Link to="/" className={isActive('/') ? 'active' : ''} onClick={closeMenus}>
              🏠 Home
            </Link>
            <Link to="/about" className={isActive('/about') ? 'active' : ''} onClick={closeMenus}>
              ℹ️ About Us
            </Link>
            <Link to="/destinations" className={isActive('/destinations') ? 'active' : ''} onClick={closeMenus}>
              🏝️ Destinations
            </Link>
            <Link to="/services" className={isActive('/services') ? 'active' : ''} onClick={closeMenus}>
              ⚙️ Services
            </Link>
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''} onClick={closeMenus}>
              ✈️ My Trips & Bookings
            </Link>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''} onClick={closeMenus}>
              📞 Contact Us
            </Link>
          </div>

          <div className="navbar-mobile-actions">
            <Link to="/contact" className="navbar-mobile-enquire-btn" onClick={closeMenus}>
              💬 Enquire Now
            </Link>

            {isLoggedIn ? (
              <button
                type="button"
                className="navbar-mobile-logout-btn"
                onClick={() => {
                  logout();
                  closeMenus();
                }}
              >
                🚪 Logout ({user?.name || user?.email})
              </button>
            ) : (
              <button
                type="button"
                className="navbar-mobile-signin-btn"
                onClick={() => {
                  setAuthModalOpen(true);
                  closeMenus();
                }}
              >
                👤 Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}

export default Navbar;