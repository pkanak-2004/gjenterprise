function About() {
  return (
    <section className="about-section">

      {/* HEADER */}
      <div className="about-header">
        <p className="section-label">ABOUT US</p>

        <h2>Your Journey, Our Responsibility</h2>

        <p className="about-intro">
          At GJ Enterprise Travel, we believe that every journey should be
          comfortable, well-planned and memorable. Our goal is to make
          travelling simple, enjoyable and stress-free for our customers.
        </p>
      </div>


      {/* ABOUT CONTENT */}
      <div className="about-content">

        <div className="about-text">

          <h3>Making Travel Simple & Memorable</h3>

          <p>
            GJ Enterprise Travel helps you discover exciting destinations
            and plan journeys that match your needs, preferences and budget.
            Whether you are planning a relaxing holiday, an adventurous
            getaway or a memorable family trip, we are here to help.
          </p>

          <p>
            From choosing the right destination to planning your itinerary,
            we focus on making every step of your travel experience smooth
            and convenient.
          </p>

          <p>
            We understand that every traveller is different. That's why
            we aim to provide personalized travel assistance and practical
            solutions instead of a one-size-fits-all approach.
          </p>

        </div>


        {/* HIGHLIGHTS */}
        <div className="about-highlights">

          <div className="about-card">
            <div className="about-icon">✈️</div>
            <h3>Personalized Planning</h3>
            <p>
              Travel plans designed around your destination, preferences
              and budget.
            </p>
          </div>


          <div className="about-card">
            <div className="about-icon">🌍</div>
            <h3>Beautiful Destinations</h3>
            <p>
              Explore popular destinations and discover new experiences
              around the world.
            </p>
          </div>


          <div className="about-card">
            <div className="about-icon">🤝</div>
            <h3>Dedicated Support</h3>
            <p>
              We are committed to helping you throughout your travel
              planning journey.
            </p>
          </div>

        </div>

      </div>


      {/* WHY CHOOSE US */}
      <div className="why-us">

        <p className="section-label">WHY CHOOSE US</p>

        <h2>Travel With Confidence</h2>

        <p className="why-description">
          We focus on making your travel planning experience easier,
          more transparent and more enjoyable.
        </p>

        <div className="why-us-grid">

          <div className="why-item">
            <span>01</span>
            <h3>Easy Planning</h3>
            <p>
              Simple and convenient travel planning from start to finish.
            </p>
          </div>

          <div className="why-item">
            <span>02</span>
            <h3>Flexible Options</h3>
            <p>
              Travel options that can be tailored according to your needs.
            </p>
          </div>

          <div className="why-item">
            <span>03</span>
            <h3>Customer Focused</h3>
            <p>
              Your comfort and travel experience remain our priority.
            </p>
          </div>

        </div>

      </div>


      {/* CTA */}
      <div className="about-cta">

        <h2>Ready to Start Your Journey?</h2>

        <p>
          Tell us where you want to go and let GJ Enterprise Travel
          help you plan your next memorable trip.
        </p>

        <a href="/contact" className="about-button">
          Plan Your Journey →
        </a>

      </div>

    </section>
  )
}

export default About