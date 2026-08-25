package com.gjenterprise.gjenterprise.Service;

import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.gjenterprise.gjenterprise.Entity.TourPackage;
import com.gjenterprise.gjenterprise.Entity.User;
import com.gjenterprise.gjenterprise.Repository.TourPackageRepository;
import com.gjenterprise.gjenterprise.Repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TourPackageRepository tourPackageRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           TourPackageRepository tourPackageRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tourPackageRepository = tourPackageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (userRepository.findByEmail("admin@gjenterprise.com").isEmpty()) {

            User admin = new User();

            admin.setName("GJ Enterprise Admin");
            admin.setEmail("admin@gjenterprise.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole("ADMIN");
            admin.setPhone("+91 9876543200");

            userRepository.save(admin);

            System.out.println("Default Admin Created Successfully!");
        }

        // Seed Sales & CRM Agents if not present
        seedEmployeeIfNotExists("Vikram Sharma", "vikram@gjenterprise.com", "+91 9876543210", "EMPLOYEE");
        seedEmployeeIfNotExists("Neha Patel", "neha@gjenterprise.com", "+91 9876543211", "EMPLOYEE");
        seedEmployeeIfNotExists("Rahul Roy", "rahul@gjenterprise.com", "+91 9876543212", "EMPLOYEE");
        seedEmployeeIfNotExists("Priya Singh", "priya@gjenterprise.com", "+91 9876543213", "EMPLOYEE");

        // Seed Sample Customer for Instant Testing
        if (userRepository.findByEmail("customer@gjenterprise.com").isEmpty()) {
            User cust = new User();
            cust.setName("Rahul Sharma");
            cust.setEmail("customer@gjenterprise.com");
            cust.setPhone("+91 9876543299");
            cust.setRole("CUSTOMER");
            cust.setPassword(passwordEncoder.encode("Customer@123"));
            userRepository.save(cust);
        }

        if (tourPackageRepository.count() == 0) {
            seedTourPackages();
            System.out.println("Default Tour Packages Created Successfully!");
        }
    }

    private void seedEmployeeIfNotExists(String name, String email, String phone, String role) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User emp = new User();
            emp.setName(name);
            emp.setEmail(email);
            emp.setPhone(phone);
            emp.setRole(role);
            emp.setPassword(passwordEncoder.encode("Agent@123"));
            userRepository.save(emp);
        }
    }

    private void seedTourPackages() {
        createPackage("Goa", "Goa Beach Holiday", "Beaches, sunsets and unforgettable experiences.", "4 Days / 3 Nights", new BigDecimal("12499"), "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80");
        createPackage("Manali", "Manali Mountain Adventure", "Snow-capped peaks, Solang valley and peaceful mountain escapes.", "5 Days / 4 Nights", new BigDecimal("14999"), "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=800&q=80");
        createPackage("Shimla", "Shimla Hill Holiday", "Queen of Hills, colonial charm, The Ridge and pine valleys.", "4 Days / 3 Nights", new BigDecimal("11999"), "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80");
        createPackage("Dubai", "Dubai City Tour", "Luxury, adventure and amazing city experiences.", "6 Days / 5 Nights", new BigDecimal("45999"), "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80");
        createPackage("Maldives", "Maldives Tropical Escape", "Crystal-clear waters, beaches and tropical luxury.", "5 Days / 4 Nights", new BigDecimal("59999"), "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80");
        createPackage("Jaipur", "Royal Jaipur Heritage", "Royal palaces, rich culture and beautiful heritage.", "3 Days / 2 Nights", new BigDecimal("8999"), "https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?auto=format&fit=crop&w=800&q=80");
        createPackage("Kashmir", "Kashmir Paradise Tour", "Beautiful valleys, lakes and unforgettable scenery.", "6 Days / 5 Nights", new BigDecimal("18999"), "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80");
        createPackage("Kerala", "Kerala Backwaters & Hills", "God's Own Country with serene backwaters and tea plantations.", "5 Days / 4 Nights", new BigDecimal("16499"), "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80");
        createPackage("Bali", "Bali Tropical Gateway", "Tropical beaches, iconic temples and lush exotic landscapes.", "7 Days / 6 Nights", new BigDecimal("52999"), "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80");
        createPackage("Ladakh", "Leh Ladakh Expedition", "Breathtaking mountain passes, monasteries and high-altitude lakes.", "6 Days / 5 Nights", new BigDecimal("24999"), "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80");
        createPackage("Andaman", "Andaman & Havelock Island", "Crystal-clear turquoise waters, Radhanagar Beach sunsets, scuba diving, and private luxury island resort.", "5 Days / 4 Nights", new BigDecimal("21999"), "https://images.unsplash.com/photo-1589330273594-fade1ee91647?auto=format&fit=crop&w=800&q=80");
        createPackage("Singapore", "Singapore & Sentosa Island", "Universal Studios, Marina Bay Sands SkyPark, Gardens by the Bay, Night Safari, and Sentosa cable car.", "5 Days / 4 Nights", new BigDecimal("48999"), "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80");
    }

    private void createPackage(String destination, String title, String desc, String duration, BigDecimal price, String imageUrl) {
        TourPackage pkg = new TourPackage();
        pkg.setDestination(destination);
        pkg.setTitle(title);
        pkg.setDescription(desc);
        pkg.setDuration(duration);
        pkg.setPrice(price);
        pkg.setImageUrl(imageUrl);
        pkg.setCategory(destination.equals("Maldives") || destination.equals("Bali") ? "Honeymoon" : destination.equals("Goa") || destination.equals("Dubai") ? "Luxury" : "Family");
        pkg.setInclusions("4-Star Hotel Stay, Daily Buffet Breakfast & Dinner, AC Private Cab Transfers, Guided Sightseeing Tours, Welcome Drink on Arrival");
        pkg.setExclusions("Flight / Train Tickets, Personal Expenses & Shopping, Optional Adventure Sports & Water Activities, Travel Insurance");
        pkg.setItinerary("Day 1: Arrival & Hotel Check-in with Welcome Drink | Day 2: Full-Day Iconic Sightseeing & Highlights Tour | Day 3: Adventure Exploration, Local Markets & Cultural Shows | Day 4: Leisure Morning & Comfortable Departure Transfer");
        pkg.setDiscountPercentage(15);
        pkg.setRating(4.9);
        pkg.setReviewsCount(140);
        pkg.setIsFeatured(true);
        pkg.setIsActive(true);
        tourPackageRepository.save(pkg);
    }
}