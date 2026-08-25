package com.gjenterprise.gjenterprise.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import com.gjenterprise.gjenterprise.Entity.Booking;
import com.gjenterprise.gjenterprise.Entity.TourPackage;
import com.gjenterprise.gjenterprise.Entity.User;
import com.gjenterprise.gjenterprise.Repository.BookingRepository;
import com.gjenterprise.gjenterprise.Repository.TourPackageRepository;
import com.gjenterprise.gjenterprise.Repository.UserRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TourPackageRepository tourPackageRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          TourPackageRepository tourPackageRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.tourPackageRepository = tourPackageRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void initSampleBookings() {
        if (bookingRepository.count() == 0) {
            List<TourPackage> packages = tourPackageRepository.findAll();
            TourPackage kshPkg = packages.stream().filter(p -> p.getDestination() != null && p.getDestination().toLowerCase().contains("kashmir")).findFirst().orElse(null);
            TourPackage goaPkg = packages.stream().filter(p -> p.getDestination() != null && p.getDestination().toLowerCase().contains("goa")).findFirst().orElse(null);

            Booking b1 = new Booking();
            b1.setBookingReference("GJE-KSH-8821");
            b1.setCustomerName("Rahul Sharma");
            b1.setCustomerEmail("customer@gjenterprise.com");
            b1.setCustomerPhone("+91 9876543299");
            b1.setTravelDate(LocalDate.of(2026, 10, 5));
            b1.setAdultsCount(2);
            b1.setChildrenCount(0);
            b1.setTotalPrice(new BigDecimal("49998"));
            b1.setAdvancePaid(new BigDecimal("15000"));
            b1.setStatus("CONFIRMED");
            b1.setTourPackage(kshPkg);
            b1.setSpecialRequests("Honeymoon flower bed decoration & airport pickup");
            bookingRepository.save(b1);

            Booking b2 = new Booking();
            b2.setBookingReference("GJE-GOA-5490");
            b2.setCustomerName("Rahul Sharma");
            b2.setCustomerEmail("customer@gjenterprise.com");
            b2.setCustomerPhone("+91 9876543299");
            b2.setTravelDate(LocalDate.of(2026, 11, 12));
            b2.setAdultsCount(2);
            b2.setChildrenCount(1);
            b2.setTotalPrice(new BigDecimal("35000"));
            b2.setAdvancePaid(BigDecimal.ZERO);
            b2.setStatus("PENDING");
            b2.setTourPackage(goaPkg);
            b2.setSpecialRequests("Poolside villa with early check-in");
            bookingRepository.save(b2);

            // Also seed sample for pkanak381@gmail.com
            Booking b3 = new Booking();
            b3.setBookingReference("GJE-KSH-9901");
            b3.setCustomerName("Kanak Priya");
            b3.setCustomerEmail("pkanak381@gmail.com");
            b3.setCustomerPhone("+91 8976545678");
            b3.setTravelDate(LocalDate.of(2026, 10, 15));
            b3.setAdultsCount(2);
            b3.setChildrenCount(0);
            b3.setTotalPrice(new BigDecimal("49998"));
            b3.setAdvancePaid(BigDecimal.ZERO);
            b3.setStatus("PENDING");
            b3.setTourPackage(kshPkg);
            b3.setSpecialRequests("Deluxe mountain view room");
            bookingRepository.save(b3);
        }
    }

    public Booking createBooking(Booking bookingRequest, String userEmail) {
        String effectiveEmail = (userEmail != null && !userEmail.isBlank()) 
                ? userEmail 
                : bookingRequest.getCustomerEmail();

        if (effectiveEmail != null && !effectiveEmail.isBlank()) {
            User customer = userRepository.findByEmail(effectiveEmail).orElse(null);
            if (customer != null) {
                bookingRequest.setCustomer(customer);
                if (bookingRequest.getCustomerName() == null || bookingRequest.getCustomerName().isBlank()) {
                    bookingRequest.setCustomerName(customer.getName());
                }
                if (bookingRequest.getCustomerPhone() == null || bookingRequest.getCustomerPhone().isBlank()) {
                    bookingRequest.setCustomerPhone(customer.getPhone());
                }
            }
            bookingRequest.setCustomerEmail(effectiveEmail);
        }

        // Calculate Price if Tour Package is provided
        if (bookingRequest.getTourPackage() != null && bookingRequest.getTourPackage().getId() != null) {
            TourPackage tourPackage = tourPackageRepository.findById(bookingRequest.getTourPackage().getId())
                    .orElse(null);
            bookingRequest.setTourPackage(tourPackage);

            if (tourPackage != null && tourPackage.getPrice() != null) {
                int adults = bookingRequest.getAdultsCount() != null ? bookingRequest.getAdultsCount() : 1;
                int children = bookingRequest.getChildrenCount() != null ? bookingRequest.getChildrenCount() : 0;
                
                BigDecimal adultTotal = tourPackage.getPrice().multiply(BigDecimal.valueOf(adults));
                BigDecimal childTotal = tourPackage.getPrice().multiply(BigDecimal.valueOf(0.5)).multiply(BigDecimal.valueOf(children));
                bookingRequest.setTotalPrice(adultTotal.add(childTotal));
            }
        }

        if (bookingRequest.getTotalPrice() == null) {
            bookingRequest.setTotalPrice(new BigDecimal("24999"));
        }

        if (bookingRequest.getAdvancePaid() == null) {
            bookingRequest.setAdvancePaid(BigDecimal.ZERO);
        }

        if (bookingRequest.getStatus() == null || bookingRequest.getStatus().isBlank()) {
            bookingRequest.setStatus("PENDING");
        }

        if (bookingRequest.getBookingReference() == null || bookingRequest.getBookingReference().isBlank()) {
            String dest = (bookingRequest.getTourPackage() != null && bookingRequest.getTourPackage().getDestination() != null)
                    ? bookingRequest.getTourPackage().getDestination().substring(0, Math.min(3, bookingRequest.getTourPackage().getDestination().length())).toUpperCase()
                    : "TRV";
            bookingRequest.setBookingReference("GJE-" + dest + "-" + (System.currentTimeMillis() % 10000));
        }

        return bookingRepository.save(bookingRequest);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByCustomerEmail(String email) {
        if (email == null || email.isBlank()) {
            return getAllBookings();
        }
        List<Booking> list = bookingRepository.findByCustomerEmailIgnoreCase(email);
        if (list.isEmpty()) {
            // Also try finding by user
            User u = userRepository.findByEmail(email).orElse(null);
            if (u != null) {
                list = bookingRepository.findByCustomer(u);
            }
        }
        return list;
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public Booking updateBookingStatus(Long id, String status) {
        Booking booking = getBookingById(id);
        booking.setStatus(status.toUpperCase());
        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
    }
}
