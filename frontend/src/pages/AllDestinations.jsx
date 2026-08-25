import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ItineraryModal from "../components/ItineraryModal";
import "./AllDestinations.css";

const DESTINATION_FALLBACK_IMAGES = {
  Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
  Manali: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=800&q=80",
  Shimla: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80",
  "Shimla & Manali": "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=800&q=80",
  Dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
  Maldives: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
  Jaipur: "https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?auto=format&fit=crop&w=800&q=80",
  Kashmir: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
  Kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
  Bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
  Ladakh: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
};

const ALL_DEFAULT_DESTINATIONS = [
  {
    id: 1,
    destination: "Goa",
    description: "Beaches, sunsets and unforgettable experiences.",
    duration: "4 Days / 3 Nights",
    price: 12499,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Goa,
  },
  {
    id: 2,
    destination: "Manali",
    description: "Snow-capped peaks, Solang valley and peaceful mountain escapes.",
    duration: "5 Days / 4 Nights",
    price: 14999,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Manali,
  },
  {
    id: 3,
    destination: "Shimla",
    description: "Queen of Hills, colonial charm, The Ridge and pine valleys.",
    duration: "4 Days / 3 Nights",
    price: 11999,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Shimla,
  },
  {
    id: 4,
    destination: "Dubai",
    description: "Luxury, adventure and amazing city experiences.",
    duration: "6 Days / 5 Nights",
    price: 45999,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Dubai,
  },
  {
    id: 5,
    destination: "Maldives",
    description: "Crystal-clear waters, beaches and tropical luxury.",
    duration: "5 Days / 4 Nights",
    price: 59999,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Maldives,
  },
  {
    id: 6,
    destination: "Jaipur",
    description: "Royal palaces, rich culture and beautiful heritage.",
    duration: "3 Days / 2 Nights",
    price: 8999,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Jaipur,
  },
  {
    id: 7,
    destination: "Kashmir",
    description: "Beautiful valleys, lakes and unforgettable scenery.",
    duration: "6 Days / 5 Nights",
    price: 18999,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Kashmir,
  },
  {
    id: 8,
    destination: "Kerala",
    description: "God's Own Country with serene backwaters and tea plantations.",
    duration: "5 Days / 4 Nights",
    price: 16499,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Kerala,
  },
  {
    id: 9,
    destination: "Bali",
    description: "Tropical beaches, iconic temples and lush exotic landscapes.",
    duration: "7 Days / 6 Nights",
    price: 52999,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Bali,
  },
  {
    id: 10,
    destination: "Ladakh",
    description: "Breathtaking mountain passes, monasteries and high-altitude lakes.",
    duration: "6 Days / 5 Nights",
    price: 24999,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Ladakh,
  },
];

const getDestinationImage = (pkg) => {
  if (pkg.imageUrl && pkg.imageUrl.startsWith("http")) {
    return pkg.imageUrl;
  }
  const destName = pkg.destination || pkg.title || "";
  return (
    DESTINATION_FALLBACK_IMAGES[destName] ||
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
  );
};

function AllDestinations() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [activeModalPackage, setActiveModalPackage] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/packages")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch destinations");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
        } else {
          setPackages(ALL_DEFAULT_DESTINATIONS);
        }
        setLoading(false);
      })
      .catch(() => {
        setPackages(ALL_DEFAULT_DESTINATIONS);
        setLoading(false);
      });
  }, []);

  const displayList = packages.length > 0 ? packages : ALL_DEFAULT_DESTINATIONS;
  const visiblePackages = showAll ? displayList : displayList.slice(0, 6);

  return (
    <section className="all-destinations-section">
      {/* HEADER */}
      <div className="all-destinations-header">
        <p className="section-label">EXPLORE • DISCOVER • TRAVEL</p>

        <h1>Explore All Our Destinations</h1>

        <p className="section-description">
          Discover amazing destinations and choose the perfect package
          for your next unforgettable journey.
        </p>
      </div>

      {/* DESTINATION CARDS */}
      <div className="destination-cards">
        {visiblePackages.map((tourPackage) => (
          <div className="destination-card" key={tourPackage.id}>
            {/* IMAGE */}
            <div className="destination-image-wrapper">
              <img
                src={getDestinationImage(tourPackage)}
                alt={tourPackage.destination || tourPackage.title || "Destination"}
                className="destination-image"
                loading="lazy"
                onClick={() => setActiveModalPackage(tourPackage)}
                style={{ cursor: "pointer" }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  const destName = tourPackage.destination || tourPackage.title || "";
                  e.currentTarget.src =
                    DESTINATION_FALLBACK_IMAGES[destName] ||
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80";
                }}
              />

              <div className="destination-badge">Popular</div>
            </div>

            {/* CONTENT */}
            <div className="destination-content">
              <h3>{tourPackage.destination || tourPackage.title}</h3>

              <p className="destination-description">
                {tourPackage.description}
              </p>

              <div className="destination-info">
                {tourPackage.duration && (
                  <div>
                    <span className="info-label">Duration</span>
                    <strong>{tourPackage.duration}</strong>
                  </div>
                )}

                {tourPackage.price && (
                  <div>
                    <span className="info-label">Starting From</span>
                    <strong className="destination-price">
                      ₹{Number(tourPackage.price).toLocaleString("en-IN")}
                    </strong>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setActiveModalPackage(tourPackage)}
                  style={{
                    background: "transparent",
                    border: "1px solid #1e3a8a",
                    color: "#1e3a8a",
                    padding: "9px 16px",
                    borderRadius: "30px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#eff6ff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  📖 View Itinerary & Inclusions
                </button>

                <Link
                  to={`/contact?destination=${encodeURIComponent(
                    tourPackage.destination || tourPackage.title || ""
                  )}`}
                  className="enquire-button"
                  style={{ marginTop: "0px" }}
                >
                  Enquire Now →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW ALL / LOAD REST BUTTON */}
      {displayList.length > 6 && (
        <div className="view-all-wrapper">
          <button
            type="button"
            className="view-all-btn"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>
      )}

      {/* ITINERARY MODAL */}
      {activeModalPackage && (
        <ItineraryModal
          tourPackage={activeModalPackage}
          onClose={() => setActiveModalPackage(null)}
        />
      )}
    </section>
  );
}

export default AllDestinations;