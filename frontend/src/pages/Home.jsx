import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  // Search filter state
  const [searchDestination, setSearchDestination] = useState('');
  const [searchMonth, setSearchMonth] = useState('');
  const [searchTravellers, setSearchTravellers] = useState('2');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchDestination) {
      navigate(`/destinations?search=${encodeURIComponent(searchDestination)}`);
    } else {
      navigate('/destinations');
    }
  };

  return (
    <div className="home-page-wrapper">
      {/* 1. HERO SECTION WITH SEARCH BAR */}
      <section className="home-hero">
        <div className="home-hero-container">
          <span className="hero-pill-badge">Bespoke Travel Solutions Since 2015</span>
          <h1>Your Dream Holiday, Handcrafted to Perfection</h1>
          <p>
            Experience handpicked 4-star luxury stays, sanitized private AC chauffeur transfers,
            and 24/7 dedicated on-ground concierge support.
          </p>

          {/* Quick Search Card */}
          <form className="hero-search-card" onSubmit={handleSearchSubmit}>
            <div className="search-field">
              <label>Destination</label>
              <select
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
              >
                <option value="">Where to? (e.g. Kashmir, Goa, Dubai)</option>
                <option value="Kashmir">Kashmir (Houseboat & Gulmarg)</option>
                <option value="Manali">Manali & Solang Snow</option>
                <option value="Goa">Goa (Beaches & Cruise)</option>
                <option value="Dubai">Dubai (Burj Khalifa & Safari)</option>
                <option value="Kerala">Kerala (Backwaters & Munnar)</option>
                <option value="Bali">Bali (Villas & Nusa Penida)</option>
                <option value="Maldives">Maldives (Overwater Bungalow)</option>
                <option value="Jaipur">Jaipur (Royal Heritage)</option>
                <option value="Shimla">Shimla (Queen of Hills)</option>
              </select>
            </div>

            <div className="search-field">
              <label>Travel Month</label>
              <select
                value={searchMonth}
                onChange={(e) => setSearchMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                <option value="April 2026">April 2026</option>
                <option value="May 2026">May 2026 (Summer Special)</option>
                <option value="June 2026">June 2026</option>
                <option value="July 2026">July 2026 (Monsoon)</option>
                <option value="Aug 2026">August 2026</option>
                <option value="Sept 2026">September 2026</option>
                <option value="Oct-Dec 2026">Festive & Winter (Oct-Dec)</option>
              </select>
            </div>

            <div className="search-field">
              <label>Travellers</label>
              <select
                value={searchTravellers}
                onChange={(e) => setSearchTravellers(e.target.value)}
              >
                <option value="1">1 Solo Traveller</option>
                <option value="2">2 Adults (Couple)</option>
                <option value="3">3-4 Guests (Small Family)</option>
                <option value="5+">5+ Guests (Family / Group)</option>
              </select>
            </div>

            <button type="submit" className="search-btn-hero">
              Explore Packages 🔍
            </button>
          </form>

          {/* Key Stats Bar */}
          <div className="home-hero-stats">
            <div className="hero-stat-box">
              <span className="stat-val">15,000+</span>
              <span className="stat-desc">Delighted Explorers</span>
            </div>
            <div className="hero-stat-box">
              <span className="stat-val">50+</span>
              <span className="stat-desc">Curated Destinations</span>
            </div>
            <div className="hero-stat-box">
              <span className="stat-val">100%</span>
              <span className="stat-desc">Customizable Itineraries</span>
            </div>
            <div className="hero-stat-box">
              <span className="stat-val">24x7</span>
              <span className="stat-desc">Live On-Trip Assistance</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW TRAVEL WITH US WORKS (3-STEP PROCESS) */}
      <section className="how-it-works-section">
        <div className="section-head-center">
          <span className="head-pill">SEAMLESS HOLIDAY PLANNING</span>
          <h2>How Traveling with GJ Enterprise Works</h2>
          <p>We take care of every booking, transfer, and itinerary detail from start to finish.</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-num">01</div>
            <div className="step-icon">🗺️</div>
            <h3>Choose Destination & Dates</h3>
            <p>
              Tell us your travel dream or select from our verified domestic and international
              holiday packages.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">02</div>
            <div className="step-icon">📋</div>
            <h3>Get Tailor-Made Itinerary</h3>
            <p>
              Our dedicated travel architect plans your 4-star stays, private sanitized AC cab, and
              sightseeing within 2 hours.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">03</div>
            <div className="step-icon">🎟️</div>
            <h3>Instant Vouchers & Enjoy</h3>
            <p>
              Download official PDF itinerary vouchers and travel with 24/7 dedicated on-ground
              concierge support.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SPOTLIGHT DESTINATION BANNER */}
      <section className="spotlight-banner-section">
        <div className="spotlight-card">
          <div className="spotlight-text-col">
            <span className="spotlight-tag">🌟 DESTINATION OF THE MONTH</span>
            <h2>Kashmir: The Crown of Himalayas</h2>
            <p className="spotlight-desc">
              Experience romantic Dal Lake houseboat stays, snow gondola cable car rides in Gulmarg,
              and pristine pine valleys of Pahalgam with private AC cab transfers.
            </p>
            <div className="spotlight-price-row">
              <div>
                <span className="price-label">All-Inclusive 6D/5N from</span>
                <span className="price-val">₹18,999</span>
              </div>
              <Link to="/destinations?search=Kashmir" className="spotlight-btn">
                View Package Details →
              </Link>
            </div>
          </div>

          <div className="spotlight-img-col">
            <img
              src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1000&q=80"
              alt="Kashmir Valley"
              className="spotlight-img"
            />
          </div>
        </div>
      </section>

      {/* 4. DIGITAL PLATFORM ADVANTAGE (WHY BOOK WITH US) */}
      <section className="platform-advantage-section">
        <div className="section-head-center">
          <span className="head-pill">ENTERPRISE PLATFORM</span>
          <h2>The Smart Way to Book Your Travels</h2>
          <p>Everything you need for a safe and memorable journey in one unified customer portal.</p>
        </div>

        <div className="advantage-grid">
          <div className="adv-card">
            <div className="adv-icon">📄</div>
            <h3>Instant PDF Quotations</h3>
            <p>Download official GST invoices, verified hotel confirmations, and day-by-day travel plans directly.</p>
          </div>

          <div className="adv-card">
            <div className="adv-icon">🚗</div>
            <h3>Dedicated Private Cabs</h3>
            <p>Zero sharing, sanitized vehicles with professional background-verified chauffeurs waiting at the airport.</p>
          </div>

          <div className="adv-card">
            <div className="adv-icon">🛡️</div>
            <h3>24x7 Safety Concierge</h3>
            <p>Direct WhatsApp and phone assistance for emergency rescheduling, special meals, or on-trip requests.</p>
          </div>

          <div className="adv-card">
            <div className="adv-icon">💳</div>
            <h3>100% Transparent Rates</h3>
            <p>Guaranteed best prices direct from local operators without middleman commission or surprise charges.</p>
          </div>
        </div>
      </section>

      {/* 5. GATEWAY TO COMPLETE DIRECTORY */}
      <section className="explore-gateway-section">
        <div className="gateway-content">
          <h2>Ready to Discover 50+ Dream Destinations?</h2>
          <p>
            Explore our comprehensive package catalog with detailed day-by-day itineraries, transparent
            pricing, and customer reviews.
          </p>
          <div className="gateway-btn-row">
            <Link to="/destinations" className="gateway-primary-btn">
              Browse All Tour Packages →
            </Link>
            <Link to="/services" className="gateway-secondary-btn">
              Explore Specialized Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;