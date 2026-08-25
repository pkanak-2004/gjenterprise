import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const travellerStories = [
    {
      name: 'Rohan & Ananya Gupta',
      location: 'New Delhi',
      trip: 'Kashmir Valley & Gulmarg Escape',
      photo: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80',
      quote: 'GJ Enterprise planned our honeymoon to perfection. From the shikara ride in Dal Lake to private snow cab transfers in Gulmarg, everything was flawless!',
      badge: 'Verified Honeymoon Trip',
    },
    {
      name: 'The Verma Family',
      location: 'Mumbai',
      trip: 'Manali & Solang Adventure',
      photo: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=600&q=80',
      quote: 'Traveling with kids and elderly parents can be challenging, but GJ Enterprise arranged top-tier 4-star mountain view resorts and extremely polite drivers.',
      badge: 'Verified Family Vacation',
    },
    {
      name: 'Dr. Sameer & Friends Group',
      location: 'Bengaluru',
      trip: 'North & South Goa Beach Holiday',
      photo: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
      quote: 'Best Goa trip ever! They organized our beach villa stay and private sunset cruise at rates much better than online apps. 100% transparent quotation.',
      badge: 'Verified Group Trip',
    },
    {
      name: 'Pooja & Karan Mehta',
      location: 'Ahmedabad',
      trip: 'Dubai Luxury & Desert Safari',
      photo: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80',
      quote: 'Visa clearance, private airport pickups, fast-track Burj Khalifa access, and evening safari — all vouchers were instantly available on our dashboard.',
      badge: 'Verified International Trip',
    },
  ];

  const milestones = [
    {
      year: '2015',
      title: 'Humble Beginnings',
      desc: 'Founded with a clear mission: delivering transparent, bespoke Himachal and Goa vacation packages.',
    },
    {
      year: '2019',
      title: 'Pan-India Expansion',
      desc: 'Expanded operations to 30+ destinations including Kashmir, Kerala backwaters, and Rajasthan heritage tours.',
    },
    {
      year: '2022',
      title: 'Global Gateways',
      desc: 'Launched direct luxury international itineraries for Dubai, Bali, Maldives, and Southeast Asia.',
    },
    {
      year: '2026',
      title: 'Full-Stack Enterprise',
      desc: 'Pioneered 100% digital CRM bookings, instant PDF quotation vouchers, and real-time travel tracking.',
    },
  ];

  const faqs = [
    {
      q: 'How does booking a trip with GJ Enterprise work?',
      a: 'You can explore our curated packages or submit your dream destination through our enquiry form. Our dedicated travel architect will contact you with a customized day-by-day itinerary and transparent pricing. Once approved, you receive instant digital vouchers and booking confirmations.',
    },
    {
      q: 'Are your tour packages fully customizable?',
      a: 'Yes, absolutely! Whether you want to add extra days, upgrade to a private pool villa, request specific meal plans, or add adventure activities like paragliding or scuba diving, we tailor every single detail to your taste.',
    },
    {
      q: 'What kind of support is available during our travel?',
      a: 'We provide 24/7 dedicated on-ground customer assistance. From airport pickup transfers to hotel check-ins and emergency rescheduling, our team is always one message or call away.',
    },
    {
      q: 'Is my payment and advance booking safe?',
      a: 'All transactions with GJ Enterprise are 100% secure. You receive an official digital GST invoice, verified payment receipt, and clear cancellation policies for maximum peace of mind.',
    },
  ];

  return (
    <div className="about-page-wrapper">
      {/* 1. HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-badge">Empowering Meaningful Travel</span>
          <h1>Transforming Travel Dreams Into Extraordinary Journeys</h1>
          <p>
            At GJ Enterprise, we engineer hassle-free, bespoke holidays and corporate travel
            experiences backed by 24/7 dedicated on-ground care and transparent pricing.
          </p>

          <div className="about-stats-grid">
            <div className="about-stat-card">
              <span className="stat-number">15,000+</span>
              <span className="stat-label">Delighted Travellers</span>
            </div>
            <div className="about-stat-card">
              <span className="stat-number">50+</span>
              <span className="stat-label">Global & Domestic Hubs</span>
            </div>
            <div className="about-stat-card">
              <span className="stat-number">99.4%</span>
              <span className="stat-label">Customer Satisfaction</span>
            </div>
            <div className="about-stat-card">
              <span className="stat-number">10+</span>
              <span className="stat-label">Years of Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section className="about-story-section">
        <div className="story-left">
          <span className="story-pill-badge">OUR STORY & PHILOSOPHY</span>
          <h2>
            Crafting <span className="text-highlight">Lifetime Journeys</span> & Authentic Experiences
          </h2>
          <p className="story-lead">
            At GJ Enterprise, we believe travel is not just about moving between destinations —
            it's about the stories, the peaceful sunsets, and the effortless memories you bring home.
          </p>
          <p className="story-body">
            Founded with a vision to make premium holidays accessible and hassle-free, our dedicated
            team of destination specialists hand-plans every detail — from luxury stays and private AC
            transfers to handpicked local excursions.
          </p>

          <div className="story-tiles-grid">
            <div className="story-tile">
              <div className="tile-icon-box">🏨</div>
              <div>
                <strong>Handpicked 4-Star Stays</strong>
                <p>Verified for luxury, hygiene & scenic views</p>
              </div>
            </div>

            <div className="story-tile">
              <div className="tile-icon-box">🚗</div>
              <div>
                <strong>Private AC Transfers</strong>
                <p>Chauffeur-driven sanitized vehicles</p>
              </div>
            </div>

            <div className="story-tile">
              <div className="tile-icon-box">🛡️</div>
              <div>
                <strong>24x7 On-Trip Concierge</strong>
                <p>Dedicated assistant throughout your journey</p>
              </div>
            </div>

            <div className="story-tile">
              <div className="tile-icon-box">💰</div>
              <div>
                <strong>Transparent Pricing</strong>
                <p>Guaranteed best rates with zero hidden fees</p>
              </div>
            </div>
          </div>

          <div className="story-cta-row">
            <Link to="/destinations" className="story-explore-btn">
              Explore Our Packages →
            </Link>
            <div className="story-trust-rating">
              <div className="stars">★★★★★</div>
              <span>4.9 / 5.0 (2,400+ Reviews)</span>
            </div>
          </div>
        </div>

        <div className="story-right-collage">
          <div className="collage-main-img-wrapper">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
              alt="Beach Holiday Luxury"
              className="collage-img-top"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          <div className="collage-secondary-img-wrapper">
            <img
              src="https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=600&q=80"
              alt="Mountain Adventure"
              className="collage-img-bottom"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80';
              }}
            />
          </div>

          <div className="collage-floating-card">
            <div className="floating-card-icon">🏆</div>
            <div>
              <strong>10+ Years Trust</strong>
              <span>Government Recognized Partner</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS */}
      <section className="about-pillars-section">
        <div className="pillars-header">
          <span className="subheading" style={{ color: '#1e3a8a', fontWeight: '800', fontSize: '13px', letterSpacing: '1px' }}>WHY TRAVELLERS CHOOSE US</span>
          <h2>The GJ Enterprise Promise</h2>
          <p>Built upon the highest benchmarks of quality, hospitality, and modern travel convenience.</p>
        </div>

        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon">🗺️</div>
            <h3>Tailor-Made Itineraries</h3>
            <p>
              Every family, couple, and group is unique. We customize travel duration, sightseeing
              stops, and leisure time according to your exact preferences.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">💎</div>
            <h3>Guaranteed Best Value</h3>
            <p>
              Direct tie-ups with premium hotel chains and verified local transport operators ensure
              unbeatable package pricing without hidden fees.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">🛡️</div>
            <h3>Safety & Peace of Mind</h3>
            <p>
              Your security is paramount. We vet every driver, maintain verified accommodation
              standards, and provide constant support throughout your trip.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">✈️</div>
            <h3>End-to-End Coordination</h3>
            <p>
              Flights, railway transfers, luxury cabs, day tours, and guided activities — all
              managed under one single digital booking voucher.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">📄</div>
            <h3>Instant Digital Vouchers</h3>
            <p>
              Download comprehensive PDF itinerary plans, hotel vouchers, and payment receipts
              instantly from your personal customer dashboard.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">🤝</div>
            <h3>Dedicated Concierge</h3>
            <p>
              A single point of contact assigned to you from the moment you enquire until you return
              home safely with cherished memories.
            </p>
          </div>
        </div>
      </section>

      {/* 4. MILESTONES & JOURNEY */}
      <section className="about-milestones-section">
        <div className="milestones-header">
          <span className="subheading" style={{ color: '#1e3a8a', fontWeight: '800', fontSize: '13px', letterSpacing: '1px' }}>OUR EVOLUTION</span>
          <h2>A Decade of Travel Innovation</h2>
        </div>

        <div className="timeline-container">
          {milestones.map((m, idx) => (
            <div key={idx} className="timeline-step">
              <span className="timeline-year">{m.year}</span>
              <h4>{m.title}</h4>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. REAL TRAVELLER STORIES & EXPERIENCES */}
      <section className="about-reviews-section">
        <div className="reviews-header">
          <span className="subheading" style={{ color: '#1e3a8a', fontWeight: '800', fontSize: '13px', letterSpacing: '1px' }}>REAL TRAVELLERS, REAL MEMORIES</span>
          <h2>Stories From Our Happy Explorers</h2>
          <p>Over 15,000+ travellers have discovered unforgettable destinations with GJ Enterprise.</p>
        </div>

        <div className="reviews-grid">
          {travellerStories.map((story, idx) => (
            <div key={idx} className="review-story-card">
              <div className="story-photo-wrapper">
                <img
                  src={story.photo}
                  alt={story.trip}
                  className="story-destination-photo"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <span className="story-badge-pill">{story.badge}</span>
              </div>

              <div className="story-card-body">
                <div className="story-trip-tag">📍 {story.trip}</div>
                <div className="story-stars">★★★★★</div>
                <p className="story-quote">"{story.quote}"</p>
                <div className="story-author-row">
                  <div className="story-avatar-initial">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="story-author-name">{story.name}</h5>
                    <span className="story-author-loc">{story.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TRAVELLER KNOWLEDGE BASE & BOOKING FAQS */}
      <section className="about-faq-section">
        <div className="faq-wrapper-2col">
          {/* Left Column: Brand Booking Guarantees */}
          <div className="faq-support-sidebar">
            <span className="story-pill-badge">TRAVELLER ASSURANCE</span>
            <h2>Common Questions &amp; Guarantees</h2>
            <p className="sidebar-subtext">
              We believe in 100% transparency. Here is how we ensure seamless holiday planning,
              hygienic stays, and stress-free vacations.
            </p>

            <div className="support-quick-cards">
              <div className="quick-contact-box">
                <div className="contact-icon-box whatsapp-bg">🛡️</div>
                <div>
                  <strong>100% Price Lock Guarantee</strong>
                  <span>Zero price hikes once your advance is confirmed</span>
                </div>
              </div>

              <div className="quick-contact-box">
                <div className="contact-icon-box call-bg">🚗</div>
                <div>
                  <strong>Dedicated Private AC Fleet</strong>
                  <span>Sanitized vehicle reserved exclusively for your family</span>
                </div>
              </div>

              <div className="quick-contact-box">
                <div className="contact-icon-box email-bg">🧾</div>
                <div>
                  <strong>Transparent GST Billing</strong>
                  <span>All taxes, tolls, parking and driver fees included</span>
                </div>
              </div>
            </div>

            <Link to="/contact" className="faq-contact-redirect-btn">
              Need A Custom Quote? Contact Us →
            </Link>
          </div>

          {/* Right Column: Realistic Accordion */}
          <div className="faq-accordion-col">
            <div className="faq-list">
              {[
                {
                  cat: 'PAYMENTS & ADVANCE',
                  q: 'How much advance is needed to book, and when is the balance due?',
                  a: 'We require only a 25% to 30% advance deposit to lock in your 4-star hotel bookings, flights, and private sanitized cab. The remaining balance can be paid 7 days prior to travel or conveniently upon hotel check-in.',
                },
                {
                  cat: 'CUSTOMIZATION',
                  q: 'Can we customize hotel tiers, meal plans, and add extra travel days?',
                  a: 'Yes, absolutely! We tailor every itinerary — whether you prefer pure Jain/Veg food options, private pool villa upgrades, honeymoon floral decor, or relaxed leisurely wake-up timings for private sightseeing.',
                },
                {
                  cat: 'TRANSPORT & TRANSFERS',
                  q: 'Are airport pickups and private chauffeur cabs included throughout the trip?',
                  a: 'Yes. A sanitized private AC vehicle (Sedan, Ertiga, or Innova Crysta) with a verified professional chauffeur is assigned to your family for the entire duration, waiting right at the airport arrival terminal.',
                },
                {
                  cat: 'CANCELLATIONS & EMERGENCIES',
                  q: 'What is your cancellation and date-rescheduling policy?',
                  a: 'We provide transparent date-change flexibility up to 10 days prior to departure without extra processing charges. In case of emergencies, our 24x7 on-ground desk assists with instant rebooking and refunds.',
                },
                {
                  cat: 'FAMILY & SPECIAL CARE',
                  q: 'Do you provide baby car seats, interconnected rooms, and senior citizen assistance?',
                  a: 'Yes. We cater to multi-generational family vacations with ground-floor room allocations, wheelchair assistance upon prior notice, and child-friendly meal customizations.',
                },
                {
                  cat: 'FLIGHT & VISA DESK',
                  q: 'Can GJ Enterprise book our domestic/international flights along with the package?',
                  a: 'Yes. Our specialized ticketing desk books non-stop flights with special group fare discounts and manages complete tourist visa paperwork for Dubai, Singapore, and Bali.',
                },
              ].map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className={`faq-item ${isOpen ? 'faq-item-active' : ''}`}>
                    <button
                      className="faq-question"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    >
                      <div>
                        <span className="faq-category-tag">{faq.cat}</span>
                        <div className="faq-q-text">{faq.q}</div>
                      </div>
                      <span className="faq-icon-circle">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && <div className="faq-answer">{faq.a}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="about-cta-banner">
        <h2>Ready for Your Next Great Escape?</h2>
        <p>
          Let GJ Enterprise create your customized travel itinerary with handpicked hotels,
          transfers, and authentic sightseeing.
        </p>
        <div className="about-cta-buttons">
          <Link to="/contact" className="btn-primary-cta">
            Plan Your Journey Now →
          </Link>
          <Link to="/destinations" className="btn-secondary-cta">
            Explore All Destinations
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;