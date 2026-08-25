package com.gjenterprise.gjenterprise.Controller;

import com.gjenterprise.gjenterprise.Entity.NotificationLog;
import com.gjenterprise.gjenterprise.Service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/logs")
    public ResponseEntity<List<NotificationLog>> getAllLogs() {
        return ResponseEntity.ok(notificationService.getAllLogs());
    }

    @GetMapping("/logs/ref/{ref}")
    public ResponseEntity<List<NotificationLog>> getLogsByRef(@PathVariable String ref) {
        return ResponseEntity.ok(notificationService.getLogsByBookingReference(ref));
    }

    @PostMapping("/send-booking-confirmation/{bookingId}")
    public ResponseEntity<Map<String, Object>> sendBookingConfirmation(
            @PathVariable Long bookingId,
            @RequestBody(required = false) Map<String, String> body) {
        
        String email = body != null ? body.get("email") : null;
        String phone = body != null ? body.get("phone") : null;
        String channel = body != null ? body.get("channel") : "BOTH"; // "EMAIL", "SMS", "BOTH"

        Map<String, Object> result = notificationService.sendBookingConfirmation(bookingId, email, phone, channel);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/send-payment-receipt")
    public ResponseEntity<Map<String, Object>> sendPaymentReceipt(@RequestBody Map<String, Object> body) {
        String ref = (String) body.get("bookingReference");
        String email = (String) body.get("email");
        String phone = (String) body.get("phone");
        Double amount = body.get("amount") != null ? Double.valueOf(body.get("amount").toString()) : 15000.0;
        String method = (String) body.get("paymentMethod");
        String txnId = (String) body.get("transactionId");

        Map<String, Object> result = notificationService.sendPaymentReceipt(ref, email, phone, amount, method, txnId);
        return ResponseEntity.ok(result);
    }

    @PostMapping({"/send-quotation/{enquiryId}", "/send-quotation"})
    public ResponseEntity<Map<String, Object>> sendQuotation(
            @PathVariable(required = false) String enquiryId,
            @RequestBody(required = false) Map<String, String> body) {
        
        Long id = 1L;
        try {
            if (enquiryId != null && !enquiryId.equalsIgnoreCase("undefined") && !enquiryId.equalsIgnoreCase("null")) {
                id = Long.parseLong(enquiryId);
            }
        } catch (Exception e) {
            id = 1L;
        }

        String name = body != null ? body.get("name") : "Valued Lead";
        String email = body != null ? body.get("email") : "customer@gjenterprise.com";
        String phone = body != null ? body.get("phone") : "+91 9876543299";
        String destination = body != null ? body.get("destination") : "Custom Tour";

        Map<String, Object> result = notificationService.sendQuotationNotification(id, name, email, phone, destination);
        return ResponseEntity.ok(result);
    }
}
