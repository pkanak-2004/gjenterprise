import React from "react";
import { Link } from "react-router-dom";
import "./Services.css";

const CORE_SERVICES = [
  {
    id: 1,
    icon: "🏨",
    badge: "PREMIUM STAYS",
    title: "Curated Hotels & Luxury Resorts",
    desc: "Handpicked 4-star & 5-star properties, private pool villas, and heritage stays with guaranteed hygiene and scenic views.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    features: [
      "Verified 4 & 5-Star Partner Resorts",
      "Complimentary Daily Breakfast Buffet",
      "Early Check-in & Late Checkout Priority",
      "Honeymoon Suite & Pool Villa Upgrades",
    ],
    priceHint: "Best rates direct from hoteliers",
  },
  {
    id: 2,
    icon: "🚗",
    badge: "PRIVATE CHAUFFEUR",
    title: "Dedicated AC Cab & Fleet Rentals",
    desc: "Sanitized private vehicles with background-verified, polite chauffeurs for airport transfers, local sightseeing & outstation tours.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
    features: [
      "Zero Sharing, 100% Private AC Vehicles",
      "Sedans, Innova Crysta & Tempo Travellers",
      "All Tolls, Parking & Driver Allowances Included",
      "Airport & Railway Station Pickup/Drop",
    ],
    priceHint: "Transparent per-day pricing",
  },
  {
    id: 3,
    icon: "✈️",
    badge: "TICKETING DESK",
    title: "Domestic & International Flights",
    desc: "Fast, hassle-free flight bookings with special group discounts, flexible date change support, and extra baggage assistance.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
    features: [
      "Non-Stop & Preferred Airline Routing",
      "Corporate & Family Group Fare Discounts",
      "Web Check-in & Priority Seat Selection",
      "Instant E-Tickets & Rescheduling Support",
    ],
    priceHint: "Zero hidden convenience fees",
  },
  {
    id: 4,
    icon: "💍",
    badge: "ROMANCE & HONEYMOON",
    title: "Bespoke Honeymoon Planning",
    desc: "Unforgettable romantic getaways complete with private candlelight dinners, yacht cruises, flower bed setups, and couple spa sessions.",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80",
    features: [
      "Overwater Villas & Secluded Beach Resorts",
      "Complimentary Candlelight Beach Dinner",
      "Flower Bed Decor & Welcome Cake",
      "Couples Spa & Sunset Cruise Passes",
    ],
    priceHint: "Customized for couples",
  },
  {
    id: 5,
    icon: "🏢",
    badge: "CORPORATE & MICE",
    title: "Corporate Retreats & Offsites",
    desc: "End-to-end corporate event logistics, annual dealer meets, team building retreats, and conference hall bookings with audio-visual setups.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
    features: [
      "Bulk Flight & Dedicated Coach Logistics",
      "Conference Halls & High-Tech AV Equipment",
      "Curated Team Building Activities & Gala Dinners",
      "100% GST Invoices & Input Credit Support",
    ],
    priceHint: "Special corporate volume rates",
  },
  {
    id: 6,
    icon: "🛂",
    badge: "DOCUMENTATION",
    title: "Visa Assistance & Travel Insurance",
    desc: "Complete overseas documentation support, tourist visa processing, embassy appointment booking, and comprehensive travel insurance.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80",
    features: [
      "Fast-Track E-Visa & Sticker Visa Filing",
      "Documentation Audit & Appointment Scheduling",
      "Overseas Medical & Baggage Loss Insurance",
      "99.2% Visa Approval Success Rate",
    ],
    priceHint: "Complete paperwork assistance",
  },
];

function Services() {
  return (
    <div className="services-page-wrapper">
      {/* 1. HERO SECTION */}
      <section className="services-hero-banner">
        <div className="services-hero-container">
          <span className="services-pill-badge">COMPREHENSIVE TRAVEL SOLUTIONS</span>
          <h1>Your Journey. Our Responsibility.</h1>
          <p>
            From luxury stays and private sanitized cabs to corporate offsites and international
            visas, GJ Enterprise handles every detail with perfection.
          </p>

          {/* Key Stats */}
          <div className="services-hero-stats">
            <div className="srv-stat-box">
              <span className="srv-stat-val">15,000+</span>
              <span className="srv-stat-desc">Travellers Served</span>
            </div>
            <div className="srv-stat-box">
              <span className="srv-stat-val">500+</span>
              <span className="srv-stat-desc">Corporate Retreats</span>
            </div>
            <div className="srv-stat-box">
              <span className="srv-stat-val">100%</span>
              <span className="srv-stat-desc">Verified Partners</span>
            </div>
            <div className="srv-stat-box">
              <span className="srv-stat-val">24x7</span>
              <span className="srv-stat-desc">On-Ground Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE SERVICES SHOWCASE (FULL WIDTH 94%) */}
      <section className="core-services-section">
        <div className="services-section-head">
          <span className="head-pill-blue">WHAT WE OFFER</span>
          <h2>Specialized Travel Services</h2>
          <p>
            Whether planning a family holiday, romantic escape, or company offsite, our bespoke
            services ensure comfort and peace of mind.
          </p>
        </div>

        <div className="services-cards-grid">
          {CORE_SERVICES.map((srv) => (
            <div key={srv.id} className="service-card-luxury">
              <div className="srv-card-img-wrap">
                <img
                  src={srv.image}
                  alt={srv.title}
                  className="srv-card-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <span className="srv-tag-badge">{srv.badge}</span>
              </div>

              <div className="srv-card-body">
                <div className="srv-header-row">
                  <div className="srv-icon-box">{srv.icon}</div>
                  <h3 className="srv-title">{srv.title}</h3>
                </div>

                <p className="srv-desc">{srv.desc}</p>

                <ul className="srv-features-list">
                  {srv.features.map((feat, idx) => (
                    <li key={idx}>
                      <span className="srv-check-icon">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="srv-card-footer">
                  <span className="srv-price-hint">{srv.priceHint}</span>
                  <Link
                    to={`/contact?service=${encodeURIComponent(srv.title)}`}
                    className="srv-enquire-btn"
                  >
                    Enquire Now →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THE ENTERPRISE SERVICE PROMISE */}
      <section className="service-promise-section">
        <div className="services-section-head">
          <span className="head-pill-blue">SERVICE GUARANTEE</span>
          <h2>The GJ Enterprise Promise</h2>
          <p>We pride ourselves on reliability, transparency, and top-tier customer satisfaction.</p>
        </div>

        <div className="promise-grid">
          <div className="promise-card">
            <div className="promise-icon-circ">🛡️</div>
            <h3>100% Verified Partners</h3>
            <p>Every hotel, houseboat, and chauffeur is pre-audited for hygiene, safety, and hospitality.</p>
          </div>

          <div className="promise-card">
            <div className="promise-icon-circ">⚡</div>
            <h3>Quotations in 2 Hours</h3>
            <p>Direct transparent quotation with detailed inclusions and zero hidden agent commissions.</p>
          </div>

          <div className="promise-card">
            <div className="promise-icon-circ">🎧</div>
            <h3>24/7 Dedicated Concierge</h3>
            <p>Direct WhatsApp and phone helpline for any flight changes, special meals, or on-trip needs.</p>
          </div>

          <div className="promise-card">
            <div className="promise-icon-circ">🔄</div>
            <h3>Flexible Date Rescheduling</h3>
            <p>Hassle-free date change support and transparent GST credit notes in unforeseen events.</p>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="services-cta-banner">
        <h2>Ready to Plan Your Custom Journey?</h2>
        <p>
          Speak directly with our senior travel specialists. We will craft a customized itinerary
          tailored to your exact budget, schedule, and preferences.
        </p>
        <div className="services-cta-btns">
          <Link to="/contact" className="btn-srv-white">
            Plan Your Journey Now →
          </Link>
          <Link to="/destinations" className="btn-srv-outline">
            Browse All 12+ Tour Packages
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Services;