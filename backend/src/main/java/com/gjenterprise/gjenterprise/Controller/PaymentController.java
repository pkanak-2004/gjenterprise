package com.gjenterprise.gjenterprise.Controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gjenterprise.gjenterprise.Entity.Payment;
import com.gjenterprise.gjenterprise.Service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<Payment> recordPayment(
            @RequestParam(required = false) Long bookingId,
            @RequestBody Map<String, Object> payload) {

        Long targetBookingId = bookingId;
        if (targetBookingId == null && payload.containsKey("bookingId")) {
            targetBookingId = Long.valueOf(payload.get("bookingId").toString());
        }

        if (targetBookingId == null) {
            throw new RuntimeException("bookingId is required to record a payment");
        }

        Payment payment = new Payment();
        if (payload.containsKey("amount")) {
            payment.setAmount(new BigDecimal(payload.get("amount").toString()));
        }
        if (payload.containsKey("paymentMethod")) {
            payment.setPaymentMethod(payload.get("paymentMethod").toString());
        }
        if (payload.containsKey("transactionId")) {
            payment.setTransactionId(payload.get("transactionId").toString());
        }
        if (payload.containsKey("status")) {
            payment.setStatus(payload.get("status").toString());
        }
        if (payload.containsKey("notes")) {
            payment.setNotes(payload.get("notes").toString());
        }

        return ResponseEntity.ok(paymentService.recordPayment(targetBookingId, payment));
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Payment>> getPaymentsForBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentsForBooking(bookingId));
    }

    @PutMapping("/{id}/refund")
    public ResponseEntity<Payment> refundPayment(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null && body.containsKey("reason") ? body.get("reason") : "Customer cancellation requested";
        return ResponseEntity.ok(paymentService.refundPayment(id, reason));
    }
}

