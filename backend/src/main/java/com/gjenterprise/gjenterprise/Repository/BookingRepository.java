package com.gjenterprise.gjenterprise.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gjenterprise.gjenterprise.Entity.Booking;
import com.gjenterprise.gjenterprise.Entity.User;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomer(User customer);

    List<Booking> findByCustomerEmail(String customerEmail);

    List<Booking> findByCustomerEmailIgnoreCase(String customerEmail);

    Optional<Booking> findByBookingReference(String bookingReference);
}
