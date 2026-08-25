package com.gjenterprise.gjenterprise.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gjenterprise.gjenterprise.Entity.Booking;
import com.gjenterprise.gjenterprise.Entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByBooking(Booking booking);

    List<Payment> findByStatus(String status);
}
