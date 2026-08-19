function Destinations() {
  return (
    <section className="destinations-section">

      <p className="section-label">POPULAR DESTINATIONS</p>

      <h2>Explore Our Top Destinations</h2>

      <p className="section-description">
        Choose your destination and let us help you plan the perfect trip.
      </p>

      <div className="destination-cards">

        {/* GOA */}
        <div className="destination-card">
          <img
            src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
            alt="Goa"
          />

          <div className="destination-content">
            <h3>Goa</h3>
            <p>Beaches, sunsets and unforgettable experiences.</p>
            <a href="/contact">Enquire Now →</a>
          </div>
        </div>


        {/* MANALI */}
        <div className="destination-card">
          <img
            src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"
            alt="Manali"
          />

          <div className="destination-content">
            <h3>Manali</h3>
            <p>Mountains, adventure and peaceful escapes.</p>
            <a href="/contact">Enquire Now →</a>
          </div>
        </div>


        {/* DUBAI */}
        <div className="destination-card">
          <img
            src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80"
            alt="Dubai"
          />

          <div className="destination-content">
            <h3>Dubai</h3>
            <p>Luxury, adventure and amazing city experiences.</p>
            <a href="/contact">Enquire Now →</a>
          </div>
        </div>


        {/* MALDIVES */}
        <div className="destination-card">
          <img
            src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80"
            alt="Maldives"
          />

          <div className="destination-content">
            <h3>Maldives</h3>
            <p>Crystal-clear waters, beaches and tropical luxury.</p>
            <a href="/contact">Enquire Now →</a>
          </div>
        </div>


        {/* JAIPUR */}
        <div className="destination-card">
          <img
            src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
            alt="Jaipur"
          />

          <div className="destination-content">
            <h3>Jaipur</h3>
            <p>Royal palaces, rich culture and beautiful heritage.</p>
            <a href="/contact">Enquire Now →</a>
          </div>
        </div>


        {/* KASHMIR */}
        <div className="destination-card">
          <img
            src="https://images.unsplash.com/photo-1566837497312-7be1f8e3e8d8?auto=format&fit=crop&w=800&q=80"
            alt="Kashmir"
          />

          <div className="destination-content">
            <h3>Kashmir</h3>
            <p>Beautiful valleys, lakes and unforgettable scenery.</p>
            <a href="/contact">Enquire Now →</a>
          </div>
        </div>

      </div>


      {/* VIEW ALL DESTINATIONS */}
      <div className="view-all-container">
        <a href="/destinations" className="view-all-button">
          View All Destinations →
        </a>
      </div>

    </section>
  )
}

export default Destinations
