import "./Services.css";

function Services() {
  const mainServices = [
    {
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
      title: "Hotel Booking",
      text: "Comfortable hotels and resorts selected according to your destination, budget and preferences.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
      title: "Cab & Car Rental",
      text: "Reliable cabs for airport transfers, sightseeing, local travel and outstation trips.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
      title: "Flight Booking",
      text: "Domestic and international flight booking assistance for a smooth and convenient journey.",
    },
  ];

  const otherServices = [
    ["🚆", "Train Booking"],
    ["🚌", "Bus Booking"],
    ["📦", "Tour Packages"],
    ["💑", "Honeymoon Packages"],
    ["👨‍👩‍👧", "Family Holidays"],
    ["🛂", "Visa Assistance"],
    ["🛡️", "Travel Insurance"],
    ["🚐", "Airport Transfer"],
    ["🗺️", "Custom Trip Planning"],
  ];

  return (
    <div className="services-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="services-hero">

        <div className="services-hero-overlay"></div>

        <div className="services-hero-content">

          <p className="services-eyebrow">
            TRAVEL MADE SIMPLE
          </p>

          <h1>
            Your Journey.
            <br />
            <span>Our Responsibility.</span>
          </h1>

          <p>
            From booking your stay to planning your complete holiday,
            GJ Enterprise takes care of every part of your journey.
          </p>

          <a href="/contact" className="services-hero-btn">
            Plan Your Trip →
          </a>

        </div>

      </section>


      {/* =========================
          INTRO
      ========================= */}

      <section className="services-intro">

        <p className="services-label">
          WHAT WE OFFER
        </p>

        <h2>
          Everything You Need,
          <br />
          All in One Place
        </h2>

        <p>
          Whether you're planning a weekend getaway, family vacation,
          honeymoon or business trip, our travel services are designed
          to make your journey comfortable and hassle-free.
        </p>

      </section>


      {/* =========================
          MAIN SERVICES
      ========================= */}

      <section className="main-services">

        <div className="main-services-grid">

          {mainServices.map((service, index) => (

            <div
              className="main-service-card"
              key={index}
            >

              <div className="main-service-image">

                <img
                  src={service.image}
                  alt={service.title}
                />

              </div>


              <div className="main-service-content">

                <p className="service-number">
                  0{index + 1}
                </p>

                <h3>
                  {service.title}
                </h3>

                <p>
                  {service.text}
                </p>

                {/* SERVICE-SPECIFIC ENQUIRY */}

                <a
                  href={`/contact?service=${encodeURIComponent(
                    service.title
                  )}`}
                >
                  Enquire Now <span>→</span>
                </a>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =========================
          OTHER SERVICES
      ========================= */}

      <section className="other-services">

        <div className="other-services-heading">

          <div>

            <p className="services-label">
              MORE WAYS WE HELP
            </p>

            <h2>
              Travel Services
            </h2>

          </div>

          <p>
            Additional services to make your complete travel
            experience easier and more convenient.
          </p>

        </div>


        <div className="other-services-grid">

          {otherServices.map((service, index) => (

            <a
              href={`/contact?service=${encodeURIComponent(
                service[1]
              )}`}
              className="other-service-card"
              key={index}
            >

              <div className="other-service-icon">
                {service[0]}
              </div>

              <div>

                <h3>
                  {service[1]}
                </h3>

                <span>
                  Enquire →
                </span>

              </div>

            </a>

          ))}

        </div>

      </section>


      {/* =========================
          CTA
      ========================= */}

      <section className="services-bottom">

        <div className="services-bottom-content">

          <p>
            READY TO TRAVEL?
          </p>

          <h2>
            Tell us where you want to go.
          </h2>

          <span>
            We'll help you plan the rest.
          </span>

        </div>

        <a href="/contact">
          Start Planning →
        </a>

      </section>

    </div>
  );
}

export default Services;