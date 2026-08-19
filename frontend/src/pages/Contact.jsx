import React, { useState } from "react";
const selectedService =
  new URLSearchParams(window.location.search).get("service") || "";
function Contact() {
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  service: selectedService,
  destination: "",
  travelDate: "",
  message: "",
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Your enquiry has been submitted successfully!");

       setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      destination: "",
      travelDate: "",
      message: "",
      });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    }
  };

  return (
    <div className="contact-page">

      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <p className="contact-tag">GET IN TOUCH</p>

          <h1>
            Let's Plan Your
            <span> Perfect Journey</span>
          </h1>

          <p>
            Have a destination in mind? Tell us about your travel plans and
            our team will help you create an unforgettable experience.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-section">

        <div className="contact-container">

          {/* LEFT SIDE */}
          <div className="contact-info">

            <p className="section-label">CONTACT US</p>

            <h2>
              We'd Love To
              <span> Hear From You</span>
            </h2>

            <p className="contact-description">
              Whether you're planning a family vacation, honeymoon,
              business trip, or weekend getaway, we're here to help.
            </p>

            <div className="contact-details">

              <div className="contact-item">
                <div className="contact-icon">📞</div>

                <div>
                  <h4>Call Us</h4>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">✉️</div>

                <div>
                  <h4>Email Us</h4>
                  <p>info@gjenterprise.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📍</div>

                <div>
                  <h4>Visit Us</h4>
                  <p>Greater Noida, Uttar Pradesh</p>
                </div>
              </div>

            </div>

            <div className="contact-note">
              <div>✈️</div>

              <div>
                <h4>Ready to travel?</h4>
                <p>
                  Share your requirements and we'll get back to you
                  shortly with the best options.
                </p>
              </div>
            </div>

          </div>

          {/* FORM */}
          <div className="enquiry-card">

            <div className="form-header">
              <p>PLAN YOUR TRIP</p>
              <h3>Send Us An Enquiry</h3>
              <span>Fill in your details and we'll contact you soon.</span>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-row">

                <div className="form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>


<div className="form-row">

  <div className="form-group">
    <label>Phone Number</label>

    <input
      type="tel"
      name="phone"
      placeholder="Enter phone number"
      value={formData.phone}
      onChange={handleChange}
      required
    />
  </div>

  <div className="form-group">
    <label>Service Required</label>

    <select
      name="service"
      value={formData.service}
      onChange={handleChange}
      required
    >
      <option value="">Select service</option>
      <option value="Hotel Booking">Hotel Booking</option>
      <option value="Cab & Car Rental">Cab & Car Rental</option>
      <option value="Flight Booking">Flight Booking</option>
      <option value="Train Booking">Train Booking</option>
      <option value="Bus Booking">Bus Booking</option>
      <option value="Tour Packages">Tour Packages</option>
      <option value="Honeymoon Packages">Honeymoon Packages</option>
      <option value="Family Holidays">Family Holidays</option>
      <option value="Visa Assistance">Visa Assistance</option>
      <option value="Travel Insurance">Travel Insurance</option>
      <option value="Airport Transfer">Airport Transfer</option>
      <option value="Custom Trip Planning">Custom Trip Planning</option>
    </select>
  </div>

</div>

<div className="form-row">

  <div className="form-group">
    <label>Destination</label>

    <select
      name="destination"
      value={formData.destination}
      onChange={handleChange}
      required
    >
      <option value="">Select destination</option>
      <option value="Goa">Goa</option>
      <option value="Manali">Manali</option>
      <option value="Dubai">Dubai</option>
      <option value="Bali">Bali</option>
      <option value="Kashmir">Kashmir</option>
      <option value="Rajasthan">Rajasthan</option>
      <option value="Kerala">Kerala</option>
      <option value="Other">Other</option>
    </select>
  </div>

</div>


                









              <div className="form-group">
                <label>Preferred Travel Date</label>

                <input
                  type="date"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>

                <textarea
                  name="message"
                  rows="5"
                  placeholder="Tell us about your travel requirements..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Enquiry
                <span>→</span>
              </button>

            </form>

          </div>

        </div>

      </section>

      {/* BOTTOM CTA */}
      <section className="contact-cta">

        <div>
          <p>YOUR JOURNEY STARTS HERE</p>

          <h2>
            Where will your next adventure take you?
          </h2>
        </div>

        <a href="tel:+919876543210">
          Call Us Now →
        </a>

      </section>

    </div>
  );
}

export default Contact;