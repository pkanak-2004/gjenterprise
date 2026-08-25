import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import ItineraryModal from "../components/ItineraryModal";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../services/api";
import "./Destinations.css";

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
  Andaman: "https://images.unsplash.com/photo-1589330273594-fade1ee91647?auto=format&fit=crop&w=800&q=80",
  Singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
};

const DEFAULT_DESTINATIONS = [
  {
    id: 1,
    destination: "Goa",
    category: "Beach",
    description: "4-star beachfront resort, private Mandovi sunset yacht cruise, water sports, and historic forts.",
    duration: "4 Days / 3 Nights",
    price: 12499,
    discountPercentage: 25,
    rating: 4.9,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Goa,
    itinerary: "Day 1: Airport pickup in private AC cab, check-in to 4-Star Beach Resort in North Goa.\nDay 2: North Goa sightseeing — Fort Aguada, Candolim, Baga beach water sports & Tito's lane.\nDay 3: South Goa heritage tour — Old Goa Churches, Mangueshi Temple, and evening Mandovi River Luxury Cruise.\nDay 4: Breakfast, beach relaxation and private airport transfer."
  },
  {
    id: 2,
    destination: "Manali",
    category: "Mountains",
    description: "Snow-capped Himalayan peaks, Solang valley paragliding, Atal Tunnel, and Old Manali cafes.",
    duration: "5 Days / 4 Nights",
    price: 14999,
    discountPercentage: 15,
    rating: 4.8,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Manali,
    itinerary: "Day 1: Arrival in Manali, hotel check-in, visit Hadimba Devi Temple and Mall Road.\nDay 2: Solang Valley adventure sports (Zipline, Zorbing, Quad biking) and Atal Tunnel.\nDay 3: Excursion to Rohtang Pass or Naggar Castle.\nDay 4: Kasol & Manikaran hot springs day tour.\nDay 5: Souvenir shopping and private transfer back."
  },
  {
    id: 3,
    destination: "Shimla",
    category: "Mountains",
    description: "Queen of Hills, colonial charm, The Ridge, Kufri snow viewpoint and lush pine valleys.",
    duration: "4 Days / 3 Nights",
    price: 11999,
    discountPercentage: 20,
    rating: 4.7,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Shimla,
    itinerary: "Day 1: Arrival in Shimla, hotel check-in, evening stroll at Mall Road & The Ridge.\nDay 2: Full day excursion to Kufri, Green Valley, and Himalayan Nature Park.\nDay 3: Jakhoo Temple cable car ride, Viceregal Lodge, and Annandale ground.\nDay 4: Breakfast and departure."
  },
  {
    id: 4,
    destination: "Dubai",
    category: "International",
    description: "Burj Khalifa 124th floor view, Marina dhow cruise, Desert Dune Bashing with BBQ dinner, and Dubai Mall.",
    duration: "6 Days / 5 Nights",
    price: 45999,
    discountPercentage: 18,
    rating: 4.9,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Dubai,
    itinerary: "Day 1: Arrival at Dubai International Airport, transfer to 4-star city hotel. Evening Marina Dhow Cruise.\nDay 2: Dubai City Tour, Burj Khalifa (124th Floor) & Dubai Mall Fountain Show.\nDay 3: Premium Desert Safari with Dune Bashing, Camel Ride, & 5-Star BBQ Dinner.\nDay 4: Abu Dhabi Day Tour with Sheikh Zayed Grand Mosque.\nDay 5: Free day for Gold Souk and luxury shopping.\nDay 6: Private airport departure."
  },
  {
    id: 5,
    destination: "Maldives",
    category: "Honeymoon",
    description: "Overwater luxury villas, crystal-clear turquoise lagoons, coral reef snorkeling, and romantic sunset dining.",
    duration: "5 Days / 4 Nights",
    price: 59999,
    discountPercentage: 15,
    rating: 5.0,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Maldives,
    itinerary: "Day 1: Speedboat transfer from Male Airport to Luxury Island Resort. Welcome drink & villa check-in.\nDay 2: Island leisure, private beach walk, and complimentary snorkeling gear.\nDay 3: Coral reef safari and romantic beachfront 3-course dinner.\nDay 4: Signature Balinese couple massage at the overwater spa.\nDay 5: Breakfast and speedboat transfer back to Male Airport."
  },
  {
    id: 6,
    destination: "Jaipur",
    category: "Heritage",
    description: "Royal Amber Fort, Hawa Mahal, City Palace, Chokhi Dhani cultural village, and authentic Rajasthani dining.",
    duration: "3 Days / 2 Nights",
    price: 8999,
    discountPercentage: 20,
    rating: 4.8,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Jaipur,
    itinerary: "Day 1: Pickup in Jaipur, hotel check-in. Visit City Palace, Jantar Mantar, and Hawa Mahal.\nDay 2: Amber Fort elephant/jeep ride, Jal Mahal, Nahargarh sunset view, and Chokhi Dhani dinner.\nDay 3: Johari Bazaar shopping for gemstones/textiles and departure."
  },
  {
    id: 7,
    destination: "Kashmir",
    category: "Mountains",
    description: "Scenic Dal Lake houseboat stay, Gulmarg snow gondola rides, and Pahalgam pine valleys.",
    duration: "6 Days / 5 Nights",
    price: 18999,
    discountPercentage: 20,
    rating: 4.9,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Kashmir,
    itinerary: "Day 1: Arrival at Srinagar Airport, transfer to Dal Lake Houseboat. Evening Shikara ride.\nDay 2: Full day excursion to Gulmarg with Gondola Cable Car Ride.\nDay 3: Scenic drive to Pahalgam, Betaab Valley and Aru Valley nature exploration.\nDay 4: Day trip to Sonamarg Thajiwas Glacier.\nDay 5: Mughal Gardens (Nishat, Shalimar) and local handicraft shopping.\nDay 6: Airport drop."
  },
  {
    id: 8,
    destination: "Kerala",
    category: "Honeymoon",
    description: "Lush Munnar tea gardens, spice plantations, and private luxury Alleppey houseboat cruise.",
    duration: "5 Days / 4 Nights",
    price: 16499,
    discountPercentage: 20,
    rating: 4.8,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Kerala,
    itinerary: "Day 1: Pickup from Cochin, scenic drive to Munnar tea plantations.\nDay 2: Munnar sightseeing — Eravikulam National Park, Mattupetty Dam, Echo Point.\nDay 3: Transfer to Thekkady (Periyar Wildlife Sanctuary) & spice plantation tour.\nDay 4: Check-in to Private Deluxe Houseboat in Alleppey backwaters.\nDay 5: Morning cruise, breakfast and transfer to Cochin Airport."
  },
  {
    id: 9,
    destination: "Bali",
    category: "International",
    description: "Ubud jungle swings, Nusa Penida island speedboat tour, Tanah Lot sunset temple, and private pool villa.",
    duration: "7 Days / 6 Nights",
    price: 52999,
    discountPercentage: 15,
    rating: 4.9,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Bali,
    itinerary: "Day 1: Arrival at Denpasar Airport, transfer to Private Pool Villa in Seminyak.\nDay 2: Kintamani Volcano, Ubud Coffee Plantation, and Jungle Swing.\nDay 3: Speedboat day excursion to Nusa Penida (Kelingking Beach, Crystal Bay).\nDay 4: Watersports at Tanjung Benoa and sunset at Uluwatu Cliff Temple.\nDay 5: Bedugul Lake Temple and iconic Tanah Lot sea temple.\nDay 6: Balinese Spa & massage therapy, leisure in Kuta.\nDay 7: Private airport transfer."
  },
  {
    id: 10,
    destination: "Ladakh",
    category: "Adventure",
    description: "Breathtaking Khardung La pass, Nubra Valley sand dunes with double-humped camels, and crystal blue Pangong Lake.",
    duration: "6 Days / 5 Nights",
    price: 24999,
    discountPercentage: 15,
    rating: 4.9,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Ladakh,
    itinerary: "Day 1: Arrival at Leh Airport, complete day rest for acclimatization.\nDay 2: Leh local sightseeing — Shanti Stupa, Leh Palace, Magnetic Hill & Sangam Point.\nDay 3: Drive across Khardung La (World's highest motorable pass) to Nubra Valley & Hunder sand dunes.\nDay 4: Nubra to Pangong Tso Lake via Shayok route. Night stay at lakeside camp.\nDay 5: Pangong sunrise, return to Leh via Chang La pass.\nDay 6: Departure from Leh Airport."
  },
  {
    id: 11,
    destination: "Andaman",
    category: "Beach",
    description: "Crystal-clear turquoise waters, Radhanagar Beach sunsets, scuba diving, and private luxury island resort.",
    duration: "5 Days / 4 Nights",
    price: 21999,
    discountPercentage: 20,
    rating: 4.9,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Andaman,
    itinerary: "Day 1: Arrival at Port Blair Airport, transfer to hotel. Cellular Jail Light & Sound Show.\nDay 2: Luxury Speedboat ferry to Havelock Swaraj Dweep. Check-in to Beachfront Resort.\nDay 3: Radhanagar Beach (Asia's Top Ranked Beach) and sunset photo tour.\nDay 4: Elephant Beach water sports (Scuba Diving, Sea Walk, Snorkeling) & return to Port Blair.\nDay 5: Airport drop with sweet memories."
  },
  {
    id: 12,
    destination: "Singapore",
    category: "International",
    description: "Universal Studios, Marina Bay Sands SkyPark, Gardens by the Bay, Night Safari, and Sentosa cable car.",
    duration: "5 Days / 4 Nights",
    price: 48999,
    discountPercentage: 15,
    rating: 4.9,
    imageUrl: DESTINATION_FALLBACK_IMAGES.Singapore,
    itinerary: "Day 1: Arrival at Changi Airport, private transfer to 4-star city hotel. Evening Night Safari.\nDay 2: Singapore City Tour, Gardens by the Bay (Flower Dome & Cloud Forest) & Marina Bay Sands SkyPark.\nDay 3: Full-Day Universal Studios Singapore & S.E.A. Aquarium at Sentosa.\nDay 4: Sentosa Island Cable Car, Wings of Time laser show, and Orchard Road shopping.\nDay 5: Jewel Changi waterfall visit & Airport Departure."
  },
];

function Destinations() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [packages, setPackages] = useState(DEFAULT_DESTINATIONS);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  // Auth Modal State for New Members choosing packages
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authPrompt, setAuthPrompt] = useState("");
  const [pendingDestination, setPendingDestination] = useState(null);

  // Filters & Pagination State
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("RECOMMENDED");
  const [showAll, setShowAll] = useState(false);

  const handleSelectPackage = (pkg) => {
    if (!isLoggedIn) {
      setPendingDestination(pkg.destination);
      setAuthPrompt(`🔒 Please Sign In or Register to choose & customize the ${pkg.destination} package!`);
      setAuthModalOpen(true);
      return;
    }
    navigate(`/contact?destination=${encodeURIComponent(pkg.destination)}`);
  };

  const handleAuthSuccess = () => {
    if (pendingDestination) {
      navigate(`/contact?destination=${encodeURIComponent(pendingDestination)}`);
      setPendingDestination(null);
    }
  };

  useEffect(() => {
    fetch(`${API_BASE}/packages`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
        }
      })
      .catch(() => {
        setPackages(DEFAULT_DESTINATIONS);
      });
  }, []);

  // Filter & Sort Logic
  const filteredPackages = packages
    .filter((pkg) => {
      const matchCategory =
        selectedCategory === "ALL" ||
        (pkg.category && pkg.category.toUpperCase() === selectedCategory.toUpperCase()) ||
        (selectedCategory === "MOUNTAINS" && ["MANALI", "SHIMLA", "KASHMIR", "LADAKH"].includes(pkg.destination?.toUpperCase())) ||
        (selectedCategory === "BEACH" && ["GOA", "MALDIVES", "BALI", "ANDAMAN"].includes(pkg.destination?.toUpperCase())) ||
        (selectedCategory === "HONEYMOON" && ["MALDIVES", "KERALA", "KASHMIR", "BALI", "ANDAMAN"].includes(pkg.destination?.toUpperCase())) ||
        (selectedCategory === "INTERNATIONAL" && ["DUBAI", "BALI", "MALDIVES", "SINGAPORE"].includes(pkg.destination?.toUpperCase())) ||
        (selectedCategory === "HERITAGE" && ["JAIPUR", "KERALA"].includes(pkg.destination?.toUpperCase()));

      const matchSearch =
        !searchQuery ||
        pkg.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "PRICE_ASC") return (a.price || 0) - (b.price || 0);
      if (sortBy === "PRICE_DESC") return (b.price || 0) - (a.price || 0);
      if (sortBy === "RATING") return (b.rating || 0) - (a.rating || 0);
      return (a.id || 0) - (b.id || 0);
    });

  // Display top 8 initially unless showAll is true or user is searching/filtering
  const isFiltering = selectedCategory !== "ALL" || Boolean(searchQuery);
  const displayedPackages = (showAll || isFiltering) ? filteredPackages : filteredPackages.slice(0, 8);

  return (
    <div className="destinations-page-wrapper">
      {/* 1. HERO BANNER */}
      <section className="destinations-hero-banner">
        <span className="hero-pill">50+ CURATED TOUR PACKAGES</span>
        <h1>Explore Handcrafted Holiday Packages</h1>
        <p>
          Verified 4-star stays, private sanitized AC chauffeur transfers, and 24/7 on-ground
          concierge care across India &amp; worldwide.
        </p>
      </section>

      {/* 2. CONTROLS & FILTER BAR */}
      <div className="destinations-controls-container">
        {/* Category Tabs */}
        <div className="category-filter-tabs">
          {[
            { label: "All Destinations (12)", val: "ALL" },
            { label: "🏔️ Mountains & Snow", val: "MOUNTAINS" },
            { label: "🏖️ Beach & Coastal", val: "BEACH" },
            { label: "💍 Honeymoon Specials", val: "HONEYMOON" },
            { label: "🌆 International", val: "INTERNATIONAL" },
            { label: "🏰 Royal Heritage", val: "HERITAGE" },
          ].map((tab) => (
            <button
              key={tab.val}
              className={`cat-tab-btn ${selectedCategory === tab.val ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(tab.val);
                setShowAll(false);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input & Sorter */}
        <div className="search-sort-row">
          <div className="dest-search-input-wrap">
            <span className="search-icon-inside">🔍</span>
            <input
              type="text"
              className="dest-search-input"
              placeholder="Search destination (e.g. Goa, Kashmir, Manali)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAll(false);
              }}
            />
          </div>

          <div className="sort-select-wrap">
            <span className="results-count-text">
              Showing <strong>{displayedPackages.length}</strong> of <strong>{filteredPackages.length}</strong> packages
            </span>
            <label>Sort by:</label>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="RECOMMENDED">Recommended</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
              <option value="RATING">Highest Rated ★</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. FULL-WIDTH 4-COLUMN PACKAGES GRID */}
      <div className="destinations-grid-container">
        {displayedPackages.length > 0 ? (
          displayedPackages.map((item) => (
            <div key={item.id} className="dest-pkg-card">
              <div className="dest-img-wrap">
                <img
                  src={
                    item.imageUrl ||
                    DESTINATION_FALLBACK_IMAGES[item.destination] ||
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={item.destination}
                  className="dest-main-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      DESTINATION_FALLBACK_IMAGES[item.destination] ||
                      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                {item.discountPercentage && (
                  <span className="dest-discount-tag">🔥 {item.discountPercentage}% OFF</span>
                )}
                <span className="dest-duration-pill">⏱️ {item.duration}</span>
              </div>

              <div className="dest-card-body">
                <div className="dest-card-header">
                  <h3 className="dest-title">{item.destination}</h3>
                  <span className="dest-rating">★ {item.rating || 4.9}</span>
                </div>

                <p className="dest-desc">{item.description}</p>

                <div className="dest-inclusions-row">
                  <span className="inclusion-pill">🏨 4-Star Resort</span>
                  <span className="inclusion-pill">🚗 Private AC Cab</span>
                  <span className="inclusion-pill">🍳 Daily Meals</span>
                </div>

                <div className="dest-card-footer">
                  <div className="dest-price-box">
                    <span className="price-small-label">Starting from</span>
                    <span className="price-amount">₹{item.price?.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="dest-btns-wrap">
                    <button
                      className="btn-itinerary-outline"
                      onClick={() => setSelectedItinerary(item)}
                    >
                      Itinerary 📋
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectPackage(item)}
                      className="btn-book-solid"
                    >
                      Enquire Now →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-dest-results">
            <h3>No packages found matching your criteria</h3>
            <p>Try searching for a different destination or clear your filters.</p>
            <button
              className="btn-clear-search"
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchQuery("");
                setShowAll(false);
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. VIEW ALL BUTTON */}
      {!isFiltering && filteredPackages.length > 8 && (
        <div className="dest-view-all-wrapper">
          <button
            type="button"
            className="btn-dest-view-all"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? (
              <>Show Less Destinations ↑</>
            ) : (
              <>View All Destinations ({filteredPackages.length}) ↓</>
            )}
          </button>
        </div>
      )}

      {/* DAY-BY-DAY ITINERARY MODAL */}
      {selectedItinerary && (
        <ItineraryModal
          packageData={selectedItinerary}
          onClose={() => setSelectedItinerary(null)}
        />
      )}

      {/* AUTH PROMPT MODAL FOR NEW MEMBERS */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        customPrompt={authPrompt}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default Destinations;