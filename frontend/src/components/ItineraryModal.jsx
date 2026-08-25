import React from "react";
import { Link } from "react-router-dom";
import "./ItineraryModal.css";

function ItineraryModal({ tourPackage, packageData, onClose }) {
  const pkg = tourPackage || packageData;
  if (!pkg) return null;

  const itineraryDays = pkg.itinerary
    ? (pkg.itinerary.includes("\n")
        ? pkg.itinerary.split("\n")
        : pkg.itinerary.split("|")
      )
        .map((day) => day.trim())
        .filter(Boolean)
    : [
        "Day 1: Arrival, Airport / Station Pickup & Hotel Check-in",
        "Day 2: Full Day Iconic City Sightseeing & Guided Heritage Tour",
        "Day 3: Adventure Exploration, Local Cultural Shows & Night Market",
        "Day 4: Leisure Morning, Souvenir Shopping & Departure Transfer",
      ];

  const inclusionsList = pkg.inclusions
    ? pkg.inclusions.split(",").map((i) => i.trim()).filter(Boolean)
    : [
        "4-Star Luxury Hotel Accommodation",
        "Daily Breakfast & Dinner Buffet",
        "AC Private Vehicle for All Transfers",
        "Driver Allowance, Toll & Parking Fees",
      ];

  const exclusionsList = pkg.exclusions
    ? pkg.exclusions.split(",").map((e) => e.trim()).filter(Boolean)
    : [
        "Flight / Train Tickets",
        "Personal Expenses & Shopping",
        "Optional Adventure / Water Sports",
        "Travel Insurance",
      ];

  return (
    <div className="itinerary-modal-overlay" onClick={onClose}>
      <div
        className="itinerary-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Modal Banner */}
        <div className="modal-banner">
          <img
            src={
              pkg.imageUrl ||
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
            }
            alt={pkg.destination || pkg.title}
          />
          <div className="modal-banner-content">
            <span className="modal-category-badge">
              {pkg.category || "Tour Package"}
            </span>
            <h2>{pkg.destination || pkg.title}</h2>
            <p className="modal-duration">⏱️ {pkg.duration || "Custom Duration"}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Price & Rating Header */}
          <div className="modal-pricing-bar">
            <div>
              <span className="price-label">Starting from</span>
              <h3 className="modal-price">
                ₹{Number(pkg.price || 0).toLocaleString("en-IN")}
                <span className="per-person"> / person</span>
              </h3>
            </div>
            <div className="rating-pill">
              ⭐ {pkg.rating || 4.9} ({pkg.reviewsCount || 120}+ reviews)
            </div>
          </div>

          {/* Description */}
          <p className="modal-description">{pkg.description}</p>

          {/* Day by Day Itinerary */}
          <div className="itinerary-timeline-section">
            <h4>📅 Day-by-Day Itinerary</h4>
            <div className="timeline-list">
              {itineraryDays.map((dayText, index) => {
                const parts = dayText.split(":");
                const dayTitle = parts[0] || `Day ${index + 1}`;
                const dayDesc = parts.slice(1).join(":") || dayText;

                return (
                  <div className="timeline-item" key={index}>
                    <div className="timeline-marker">{index + 1}</div>
                    <div className="timeline-content">
                      <h5>{dayTitle.trim()}</h5>
                      <p>{dayDesc.trim()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="inclusions-grid">
            <div className="inclusions-box">
              <h4>✅ Inclusions</h4>
              <ul>
                {inclusionsList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="exclusions-box">
              <h4>❌ Exclusions</h4>
              <ul>
                {exclusionsList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <Link
              to={`/contact?destination=${encodeURIComponent(
                pkg.destination || pkg.title || ""
              )}&service=Tour+Packages`}
              className="modal-enquire-btn"
              onClick={onClose}
            >
              Enquire & Book Package →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItineraryModal;
