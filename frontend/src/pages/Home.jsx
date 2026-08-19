function Home() {
  return (
    <>
      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="hero-section">

        <div className="hero-content">

          <p className="hero-small-text">
            TRAVEL • EXPLORE • EXPERIENCE
          </p>

          <h1>
            Explore The World
            <br />
            With GJ Enterprise
          </h1>

          <p className="hero-description">
            Discover beautiful destinations, plan unforgettable trips
            and create memories that last a lifetime.
          </p>

          <div className="hero-buttons">

            <a href="/destinations" className="hero-button">
            Explore Destinations →
            </a>

           

            <a href="/contact" className="hero-outline-button">
              Plan Your Journey
            </a>

          </div>

        </div>


        {/* HERO STATS */}

        <div className="hero-stats">

          <div className="hero-stat">
            <strong>15+</strong>
            <span>Destinations</span>
          </div>

          <div className="hero-stat">
            <strong>100+</strong>
            <span>Happy Travellers</span>
          </div>

          <div className="hero-stat">
            <strong>24/7</strong>
            <span>Travel Support</span>
          </div>

        </div>

      </section>


      {/* =========================
          TRAVEL FEATURES
      ========================= */}

      <section className="travel-features">

        <div className="feature-card">

          <div className="feature-icon">
            ✈️
          </div>

          <div>
            <h3>Easy Travel Planning</h3>

            <p>
              Plan your trip easily with travel options
              designed around your needs.
            </p>
          </div>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            🌍
          </div>

          <div>
            <h3>Beautiful Destinations</h3>

            <p>
              Explore popular destinations and discover
              amazing travel experiences.
            </p>
          </div>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            🤝
          </div>

          <div>
            <h3>Dedicated Support</h3>

            <p>
              Get helpful assistance throughout your
              travel planning journey.
            </p>
          </div>

        </div>

      </section>

    </>
  )
}

export default Home