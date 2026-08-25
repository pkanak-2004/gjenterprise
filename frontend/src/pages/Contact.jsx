import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./Contact.css";

const POPULAR_DESTINATIONS = [
  "Goa",
  "Manali",
  "Shimla",
  "Dubai",
  "Maldives",
  "Jaipur",
  "Kashmir",
  "Kerala",
  "Bali",
  "Ladakh",
  "Andaman",
  "Singapore",
  "Other / Custom Trip",
];

const HOTEL_TIERS = [
  "🏨 4-Star Luxury Resort (Recommended)",
  "👑 5-Star Heritage / Premium Palace",
  "🌿 Boutique Private Villa / Homestay",
  "💎 3-Star Deluxe Comfort Hotel",
];

const CAB_OPTIONS = [
  "🚗 Private Dedicated AC Sedan / SUV (Airport + Full Sightseeing)",
  "🚐 Tempo Traveller (12-16 Seater for Group/Family)",
  "🛬 Airport & Station Pickup/Drop Only",
  "🚶 Self-Arranged / No Cab Needed",
];

const MEAL_PLANS = [
  "🍳 MAP Plan: Daily Breakfast & Dinner Buffet (Recommended)",
  "🍽️ AP Plan: All Meals (Breakfast + Lunch + Dinner)",
  "☕ CP Plan: Daily Breakfast Only",
  "🥗 Pure Vegetarian / Jain Food Catering",
];

function Contact() {
  const [searchParams] = useSearchParams();

  const selectedService = searchParams.get("service") || "";
  const selectedDestination = searchParams.get("destination") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: selectedDestination || "Kashmir",
    travelDate: "",
    duration: "5 Days / 4 Nights",
    adultsCount: 2,
    childrenCount: 0,
    roomsCount: 1,
    hotelCategory: "🏨 4-Star Luxury Resort (Recommended)",
    cabType: "🚗 Private Dedicated AC Sedan / SUV (Airport + Full Sightseeing)",
    mealPlan: "🍳 MAP Plan: Daily Breakfast & Dinner Buffet (Recommended)",
    budgetRange: "₹25,000 - ₹50,000 per person",
    message: "",
    // Add-on services
    flightsRequired: false,
    sightseeingPass: true,
    honeymoonSpecial: false,
    insurance: true,
    adventurePass: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [lastCreatedBookingRef, setLastCreatedBookingRef] = useState("");

  useEffect(() => {
    const dest = searchParams.get("destination") || "";
    const srv = searchParams.get("service") || "";
    if (dest || srv) {
      setFormData((prev) => ({
        ...prev,
        destination: dest || prev.destination,
        message: srv ? `Enquiry for ${srv}` : prev.message,
      }));

      setTimeout(() => {
        const formElement = document.querySelector(".enquiry-form-wrapper");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Estimate total price based on choices
  const calculateEstimatedPrice = () => {
    const basePerAdult = 24999;
    const basePerChild = 12500;
    const adults = Number(formData.adultsCount || 2);
    const children = Number(formData.childrenCount || 0);

    let total = adults * basePerAdult + children * basePerChild;

    if (formData.hotelCategory.includes("5-Star")) {
      total += adults * 10000;
    } else if (formData.hotelCategory.includes("Villa")) {
      total += adults * 7500;
    }

    if (formData.flightsRequired) {
      total += (adults + children) * 8500;
    }

    if (formData.honeymoonSpecial) {
      total += 4999;
    }

    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const addonsList = [];
      if (formData.flightsRequired) addonsList.push("Flight Booking");
      if (formData.sightseeingPass) addonsList.push("Sightseeing Passes");
      if (formData.honeymoonSpecial) addonsList.push("Honeymoon Inclusions");
      if (formData.insurance) addonsList.push("Travel Insurance");
      if (formData.adventurePass) addonsList.push("Adventure/Water Sports");

      const compiledSummary = `Guests: ${formData.adultsCount} Adults, ${formData.childrenCount} Children (${formData.roomsCount} Rooms) | Stay: ${formData.hotelCategory} | Cab: ${formData.cabType} | Meal: ${formData.mealPlan} | Add-ons: ${addonsList.join(", ") || "None"} | Note: ${formData.message || "Custom Tour"}`;
      const estimatedTotal = calculateEstimatedPrice();
      const destPrefix = (formData.destination || "TRV").slice(0, 3).toUpperCase();
      const generatedRef = `GJE-${destPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Submit Enquiry to /api/enquiries
      const enquiryPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: `${formData.destination} Tour Package (${formData.adultsCount} Adults)`,
        destination: formData.destination,
        travelDate: formData.travelDate,
        message: compiledSummary,
      };

      const response = await fetch("http://localhost:8080/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiryPayload),
      });

      // 2. Submit formal Booking to /api/bookings with exact guest count & service preferences
      try {
        await fetch("http://localhost:8080/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingReference: generatedRef,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            travelDate: formData.travelDate || new Date().toISOString().split("T")[0],
            adultsCount: Number(formData.adultsCount),
            childrenCount: Number(formData.childrenCount),
            totalPrice: estimatedTotal,
            advancePaid: 0,
            status: "PENDING",
            specialRequests: compiledSummary,
          }),
        });
      } catch (bkErr) {
        console.log("Auto-booking sync:", bkErr);
      }

      if (response.ok) {
        setSubmitSuccess(true);
        setLastCreatedBookingRef(generatedRef);
      } else {
        alert("Something went wrong. Please check your details and try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* 1. HERO SECTION */}
      <section className="contact-hero-banner">
        <div className="contact-hero-container">
          <span className="contact-pill-badge">24/7 DEDICATED CONCIERGE & TOUR CUSTOMIZATION</span>
          <h1>Plan Your Custom Holiday &amp; Group Tour</h1>
          <p>
            Choose your destination, number of travellers, hotel category, cab preferences, and meal plans.
            Our senior travel architects will craft a 100% transparent bespoke itinerary within 2 hours.
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTACT & ENQUIRY HUB */}
      <section className="contact-main-section">
        <div className="contact-2col-layout">
          {/* LEFT COLUMN: DIRECT CHANNELS & ASSURANCE */}
          <div className="contact-info-col">
            <div className="info-header-box">
              <span className="info-pill">DIRECT TRAVEL DESK</span>
              <h2>We'd Love To Hear From You</h2>
              <p>
                Whether you're planning a honeymoon, family holiday, or corporate retreat, our team
                ensures end-to-end planning with 100% on-ground care.
              </p>
            </div>

            <div className="contact-channels-list">
              <a
                href="https://wa.me/919876543210?text=Hi%20GJ%20Enterprise,%20I%20would%20like%20to%20plan%20a%20trip!"
                target="_blank"
                rel="noopener noreferrer"
                className="channel-card"
              >
                <div className="channel-icon-wrap bg-whatsapp">💬</div>
                <div>
                  <strong>WhatsApp Instant Chat</strong>
                  <span>Fast responses under 10 minutes</span>
                </div>
              </a>

              <a href="tel:+919876543210" className="channel-card">
                <div className="channel-icon-wrap bg-call">📞</div>
                <div>
                  <strong>24/7 Helpline: +91 98765 43210</strong>
                  <span>Toll-free customer support desk</span>
                </div>
              </a>

              <a href="mailto:info@gjenterprise.com" className="channel-card">
                <div className="channel-icon-wrap bg-email">✉️</div>
                <div>
                  <strong>Quotation Desk: info@gjenterprise.com</strong>
                  <span>Send requirements for official PDF quotation</span>
                </div>
              </a>

              <div className="channel-card">
                <div className="channel-icon-wrap bg-location">📍</div>
                <div>
                  <strong>Corporate Headquarters</strong>
                  <span>Alpha-1 Commercial Belt, Greater Noida, UP - 201310</span>
                </div>
              </div>
            </div>

            {/* Assurance Card */}
            <div className="contact-trust-card">
              <div className="trust-item">
                <span className="trust-icon">⚡</span>
                <span>Guaranteed Quotation within 2 Hours</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🛡️</span>
                <span>100% Data Privacy &amp; No Spam Guarantee</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🧾</span>
                <span>Official GST Invoices &amp; Zero Agent Hidden Fees</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILED LUXURY CUSTOMIZATION FORM */}
          <div className="enquiry-form-wrapper">
            <div className="form-header-bar">
              <h3>Customize Your Tour &amp; Request Instant Quotation</h3>
              <p>Select your guest count, hotel tier, cab type, and meal preferences below.</p>
            </div>

            {submitSuccess && (
              <div className="enquiry-success-banner" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>✅</span>
                  <strong>Thank you! Your customized trip request has been registered (#{lastCreatedBookingRef}).</strong>
                </div>
                <div style={{ fontSize: "13.5px", color: "#166534" }}>
                  A pending booking with your exact guest count ({formData.adultsCount} Adults, {formData.childrenCount} Kids) and hotel/cab preferences has been saved in your Customer Portal.
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                  <Link
                    to="/customer-dashboard"
                    style={{
                      background: "#1e3a8a",
                      color: "#ffffff",
                      padding: "10px 18px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "800",
                      fontSize: "13.5px",
                    }}
                  >
                    ✈️ View in Customer Dashboard &amp; Pay Advance →
                  </Link>
                </div>
              </div>
            )}

            <form className="enquiry-grid-form" onSubmit={handleSubmit}>
              {/* SECTION 1: CONTACT DETAILS */}
              <div style={{ borderBottom: "1.5px solid #f1f5f9", paddingBottom: "16px", marginBottom: "16px" }}>
                <span style={{ fontSize: "11px", fontWeight: "900", color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "1px" }}>
                  1. Contact Information
                </span>
                <div className="form-2col-row" style={{ marginTop: "10px" }}>
                  <div className="form-input-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-input-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-2col-row">
                  <div className="form-input-group">
                    <label>Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-input-group">
                    <label>Destination *</label>
                    <select
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Destination</option>
                      {POPULAR_DESTINATIONS.map((dest) => (
                        <option key={dest} value={dest}>
                          {dest}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: NUMBER OF TRAVELLERS (GUESTS & ROOMS) */}
              <div style={{ borderBottom: "1.5px solid #f1f5f9", paddingBottom: "16px", marginBottom: "16px" }}>
                <span style={{ fontSize: "11px", fontWeight: "900", color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "1px" }}>
                  2. Number of Travellers &amp; Dates
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginTop: "10px" }}>
                  <div className="form-input-group">
                    <label>👥 Adults (12+ Yrs) *</label>
                    <select
                      name="adultsCount"
                      value={formData.adultsCount}
                      onChange={handleChange}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Adult" : "Adults"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-input-group">
                    <label>🧒 Children (Below 12 Yrs)</label>
                    <select
                      name="childrenCount"
                      value={formData.childrenCount}
                      onChange={handleChange}
                    >
                      {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Child" : "Children"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-input-group">
                    <label>🛏️ Rooms Needed</label>
                    <select
                      name="roomsCount"
                      value={formData.roomsCount}
                      onChange={handleChange}
                    >
                      {[1, 2, 3, 4, 5, "6+ / Villa"].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Room" : "Rooms"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-2col-row" style={{ marginTop: "12px" }}>
                  <div className="form-input-group">
                    <label>Preferred Travel Date</label>
                    <input
                      type="date"
                      name="travelDate"
                      value={formData.travelDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-input-group">
                    <label>Tour Duration</label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                    >
                      <option value="4 Days / 3 Nights">4 Days / 3 Nights (Weekend Trip)</option>
                      <option value="5 Days / 4 Nights">5 Days / 4 Nights (Standard)</option>
                      <option value="7 Days / 6 Nights">7 Days / 6 Nights (Popular)</option>
                      <option value="10 Days / 9 Nights">10 Days / 9 Nights (Grand Tour)</option>
                      <option value="Custom Extended Duration">Custom Extended Duration</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SERVICE PREFERENCES (HOTEL, CAB, MEALS) */}
              <div style={{ borderBottom: "1.5px solid #f1f5f9", paddingBottom: "16px", marginBottom: "16px" }}>
                <span style={{ fontSize: "11px", fontWeight: "900", color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "1px" }}>
                  3. Service &amp; Hospitality Preferences
                </span>

                <div className="form-input-group" style={{ marginTop: "10px" }}>
                  <label>🏨 Hotel Category / Stay Tier</label>
                  <select
                    name="hotelCategory"
                    value={formData.hotelCategory}
                    onChange={handleChange}
                  >
                    {HOTEL_TIERS.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-input-group" style={{ marginTop: "12px" }}>
                  <label>🚗 Cab &amp; Transportation Mode</label>
                  <select
                    name="cabType"
                    value={formData.cabType}
                    onChange={handleChange}
                  >
                    {CAB_OPTIONS.map((cab) => (
                      <option key={cab} value={cab}>
                        {cab}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-input-group" style={{ marginTop: "12px" }}>
                  <label>🍳 Meal Plan Preference</label>
                  <select
                    name="mealPlan"
                    value={formData.mealPlan}
                    onChange={handleChange}
                  >
                    {MEAL_PLANS.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SECTION 4: INCLUSIONS & ADD-ON SERVICES */}
              <div style={{ borderBottom: "1.5px solid #f1f5f9", paddingBottom: "16px", marginBottom: "16px" }}>
                <span style={{ fontSize: "11px", fontWeight: "900", color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "1px" }}>
                  4. Included Services &amp; Special Add-ons
                </span>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", background: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <input
                      type="checkbox"
                      name="flightsRequired"
                      checked={formData.flightsRequired}
                      onChange={handleChange}
                    />
                    <span>✈️ Flight Tickets Booking</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", background: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <input
                      type="checkbox"
                      name="sightseeingPass"
                      checked={formData.sightseeingPass}
                      onChange={handleChange}
                    />
                    <span>🎟️ Sightseeing Entry Passes</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", background: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <input
                      type="checkbox"
                      name="honeymoonSpecial"
                      checked={formData.honeymoonSpecial}
                      onChange={handleChange}
                    />
                    <span>🌹 Honeymoon Candlelight Setup</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", background: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <input
                      type="checkbox"
                      name="insurance"
                      checked={formData.insurance}
                      onChange={handleChange}
                    />
                    <span>🛡️ Travel Insurance Coverage</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", background: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <input
                      type="checkbox"
                      name="adventurePass"
                      checked={formData.adventurePass}
                      onChange={handleChange}
                    />
                    <span>🚣 Adventure Sports Passes</span>
                  </label>
                </div>
              </div>

              {/* SECTION 5: SPECIAL NOTES */}
              <div className="form-input-group">
                <label>Special Requests / Specific Requirements</label>
                <textarea
                  name="message"
                  placeholder="Any specific hotel preferences, senior citizen care, airport pickup time, vegetarian/Jain food notes, etc."
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                ></textarea>
              </div>

              {/* ESTIMATED LIVE PRICE SUMMARY */}
              <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "12px", padding: "14px 18px", marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#1e3a8a", textTransform: "uppercase" }}>Estimated Total Package Cost:</span>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>
                    For {formData.adultsCount} Adults {formData.childrenCount > 0 ? `+ ${formData.childrenCount} Kids` : ""} with {formData.hotelCategory.split("(")[0]}
                  </div>
                </div>
                <div style={{ fontSize: "20px", fontWeight: "900", color: "#1e3a8a" }}>
                  ₹{calculateEstimatedPrice().toLocaleString("en-IN")}
                </div>
              </div>

              <button
                type="submit"
                className="form-submit-btn"
                disabled={isSubmitting}
                style={{ width: "100%", marginTop: "16px" }}
              >
                {isSubmitting ? "Submitting Custom Proposal Request..." : "Submit Custom Trip Request & Generate Booking →"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. LOGISTICS & SUPPORT HIGHLIGHTS */}
      <section className="contact-bottom-pillars">
        <div className="pillars-grid-4">
          <div className="pillar-box">
            <div className="pillar-icon">⏱️</div>
            <h4>2-Hour Fast Response</h4>
            <p>Our dedicated travel planners revert with detailed itineraries and transparent costings rapidly.</p>
          </div>

          <div className="pillar-box">
            <div className="pillar-icon">🎧</div>
            <h4>24/7 Live On-Ground Help</h4>
            <p>Dedicated WhatsApp hotline active throughout your trip for cab coordination and flight assistance.</p>
          </div>

          <div className="pillar-box">
            <div className="pillar-icon">🧾</div>
            <h4>Official GST Billing</h4>
            <p>100% compliant business invoices, company input tax credits, and secure digital payments.</p>
          </div>

          <div className="pillar-box">
            <div className="pillar-icon">🌟</div>
            <h4>Customization Guarantee</h4>
            <p>Modify hotel tiers, add sightseeing stops, or upgrade vehicles anytime before departure.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;