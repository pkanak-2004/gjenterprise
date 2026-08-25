package com.gjenterprise.gjenterprise.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.gjenterprise.gjenterprise.Entity.Booking;
import com.gjenterprise.gjenterprise.Entity.Payment;
import com.gjenterprise.gjenterprise.Repository.BookingRepository;
import com.gjenterprise.gjenterprise.Repository.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    public Payment recordPayment(Long bookingId, Payment payment) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        payment.setBooking(booking);
        if (payment.getStatus() == null) {
            payment.setStatus("SUCCESS");
        }
        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDateTime.now());
        }
        if (payment.getTransactionId() == null || payment.getTransactionId().isBlank()) {
            payment.setTransactionId("TXN-" + (System.currentTimeMillis() % 1000000));
        }

        Payment savedPayment = paymentRepository.save(payment);

        if ("SUCCESS".equalsIgnoreCase(savedPayment.getStatus())) {
            BigDecimal currentAdvance = booking.getAdvancePaid() != null ? booking.getAdvancePaid() : BigDecimal.ZERO;
            BigDecimal newAdvance = currentAdvance.add(savedPayment.getAmount() != null ? savedPayment.getAmount() : BigDecimal.ZERO);
            booking.setAdvancePaid(newAdvance);
            booking.setStatus("CONFIRMED");
            bookingRepository.save(booking);
        }

        return savedPayment;
    }

    public Payment refundPayment(Long paymentId, String reason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));

        if (!"SUCCESS".equalsIgnoreCase(payment.getStatus())) {
            throw new RuntimeException("Only successful payments can be refunded");
        }

        payment.setStatus("REFUNDED");
        payment.setNotes(payment.getNotes() != null ? payment.getNotes() + " | Refund Reason: " + reason : "Refunded: " + reason);
        Payment saved = paymentRepository.save(payment);

        // Deduct advance from booking
        Booking booking = payment.getBooking();
        if (booking != null) {
            BigDecimal currentAdvance = booking.getAdvancePaid() != null ? booking.getAdvancePaid() : BigDecimal.ZERO;
            BigDecimal newAdvance = currentAdvance.subtract(payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO);
            if (newAdvance.compareTo(BigDecimal.ZERO) < 0) newAdvance = BigDecimal.ZERO;
            booking.setAdvancePaid(newAdvance);
            bookingRepository.save(booking);
        }

        return saved;
    }

    public List<Payment> getAllPayments() {
        List<Payment> list = paymentRepository.findAll();
        if (list.isEmpty()) {
            List<Booking> bookings = bookingRepository.findAll();
            if (!bookings.isEmpty()) {
                Booking b1 = bookings.get(0);
                Payment p1 = new Payment();
                p1.setBooking(b1);
                p1.setAmount(new BigDecimal("10000"));
                p1.setPaymentMethod("UPI");
                p1.setStatus("SUCCESS");
                p1.setTransactionId("TXN-789021");
                p1.setNotes("Online advance payment via Google Pay");
                paymentRepository.save(p1);

                if (bookings.size() > 1) {
                    Booking b2 = bookings.get(1);
                    Payment p2 = new Payment();
                    p2.setBooking(b2);
                    p2.setAmount(new BigDecimal("15000"));
                    p2.setPaymentMethod("CARD");
                    p2.setStatus("SUCCESS");
                    p2.setTransactionId("TXN-654312");
                    p2.setNotes("Visa Credit Card advance booking");
                    paymentRepository.save(p2);
                }
                return paymentRepository.findAll();
            }
        }
        return list;
    }

    public List<Payment> getPaymentsForBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
        return paymentRepository.findByBooking(booking);
    }
}
