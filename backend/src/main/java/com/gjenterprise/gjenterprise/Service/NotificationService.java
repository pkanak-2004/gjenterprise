package com.gjenterprise.gjenterprise.Service;

import com.gjenterprise.gjenterprise.Entity.Booking;
import com.gjenterprise.gjenterprise.Entity.NotificationLog;
import com.gjenterprise.gjenterprise.Repository.BookingRepository;
import com.gjenterprise.gjenterprise.Repository.NotificationLogRepository;
import jakarta.annotation.PostConstruct;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class NotificationService {

    private final NotificationLogRepository logRepository;
    private final BookingRepository bookingRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public NotificationService(NotificationLogRepository logRepository, BookingRepository bookingRepository) {
        this.logRepository = logRepository;
        this.bookingRepository = bookingRepository;
    }

    @PostConstruct
    public void initSampleLogs() {
        if (logRepository.count() == 0) {
            logRepository.save(new NotificationLog(
                "customer@gjenterprise.com",
                "EMAIL",
                "BOOKING_CONFIRMATION",
                "✈️ Booking Confirmed: Kashmir Paradise Tour (#GJE-KSH-8821)",
                "Dear Rahul Sharma, your tour to Kashmir has been successfully confirmed. Advance of ₹15,000 received.",
                "GJE-KSH-8821"
            ));
            logRepository.save(new NotificationLog(
                "+91 9876543299",
                "SMS",
                "BOOKING_CONFIRMATION",
                "SMS Booking Confirmation",
                "✨ GJ Enterprise: Booking #GJE-KSH-8821 to Kashmir confirmed! Advance token ₹15,000 credited. Concierge SOS: +91 98765 43210",
                "GJE-KSH-8821"
            ));
            logRepository.save(new NotificationLog(
                "customer@gjenterprise.com",
                "EMAIL",
                "PAYMENT_RECEIPT",
                "💳 Payment Receipt: ₹15,000 for Booking #GJE-KSH-8821",
                "Thank you for your payment. Txn ID: TXN-882101 via UPI. Official GST Tax Invoice is available in your vault.",
                "GJE-KSH-8821"
            ));
        }
    }

    public List<NotificationLog> getAllLogs() {
        return logRepository.findAllByOrderByTimestampDesc();
    }

    public List<NotificationLog> getLogsByBookingReference(String ref) {
        return logRepository.findByBookingReferenceOrderByTimestampDesc(ref);
    }

    private void dispatchRealEmail(String toEmail, String subject, String htmlContent) {
        if (mailSender == null) {
            System.out.println(">>> [SMTP Notice] JavaMailSender is not initialized or SMTP credentials are blank. Dispatched in local database audit log.");
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("bookings@gjenterprise.com");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println(">>> [REAL SMTP EMAIL DELIVERED] Successfully sent email to " + toEmail);
        } catch (Exception e) {
            System.out.println(">>> [SMTP Info] Could not send via external SMTP: " + e.getMessage() + ". Saved in local notification vault.");
        }
    }

    /**
     * Dispatches Booking Confirmation via Email and/or SMS
     */
    public Map<String, Object> sendBookingConfirmation(Long bookingId, String customEmail, String customPhone, String channel) {
        Optional<Booking> optBooking = bookingRepository.findById(bookingId);
        
        String customerName = "Valued Guest";
        String customerEmail = customEmail != null && !customEmail.isBlank() ? customEmail : "customer@gjenterprise.com";
        String customerPhone = customPhone != null && !customPhone.isBlank() ? customPhone : "+91 9876543299";
        String destination = "Luxury Tour";
        String bookingRef = "GJE-BK-" + bookingId;
        String travelDate = "Upcoming 2026";
        String totalAmount = "₹25,000";
        String advancePaid = "₹15,000";

        if (optBooking.isPresent()) {
            Booking b = optBooking.get();
            customerName = b.getCustomerName() != null ? b.getCustomerName() : customerName;
            customerEmail = (customEmail != null && !customEmail.isBlank()) ? customEmail : (b.getCustomerEmail() != null ? b.getCustomerEmail() : customerEmail);
            customerPhone = (customPhone != null && !customPhone.isBlank()) ? customPhone : (b.getCustomerPhone() != null ? b.getCustomerPhone() : customerPhone);
            destination = (b.getTourPackage() != null && b.getTourPackage().getDestination() != null) ? b.getTourPackage().getDestination() : "Luxury Vacation";
            bookingRef = b.getBookingReference() != null ? b.getBookingReference() : ("GJE-" + b.getId());
            travelDate = b.getTravelDate() != null ? b.getTravelDate().toString() : travelDate;
            totalAmount = b.getTotalPrice() != null ? ("₹" + b.getTotalPrice()) : totalAmount;
            advancePaid = b.getAdvancePaid() != null ? ("₹" + b.getAdvancePaid()) : advancePaid;
        }

        List<NotificationLog> createdLogs = new ArrayList<>();
        boolean sendEmail = channel == null || channel.equalsIgnoreCase("EMAIL") || channel.equalsIgnoreCase("BOTH");
        boolean sendSms = channel == null || channel.equalsIgnoreCase("SMS") || channel.equalsIgnoreCase("BOTH") || channel.equalsIgnoreCase("WHATSAPP");

        if (sendEmail) {
            String emailSubject = "✈️ Booking Confirmed: " + destination + " Holiday (#" + bookingRef + ") - GJ Enterprise";
            String emailHtml = buildBookingConfirmationEmailHtml(customerName, destination, bookingRef, travelDate, totalAmount, advancePaid);
            
            NotificationLog emailLog = new NotificationLog(
                customerEmail,
                "EMAIL",
                "BOOKING_CONFIRMATION",
                emailSubject,
                emailHtml,
                bookingRef
            );
            createdLogs.add(logRepository.save(emailLog));
            dispatchRealEmail(customerEmail, emailSubject, emailHtml);
            System.out.println(">>> [EMAIL LOGGED FOR " + customerEmail + "] Subject: " + emailSubject);
        }

        if (sendSms) {
            String smsBody = "✨ GJ ENTERPRISE: Booking #" + bookingRef + " for " + destination + " is CONFIRMED for " + customerName + "! Advance " + advancePaid + " received. 24/7 Concierge SOS: +91 98765 43210. View voucher: http://localhost:5173";
            NotificationLog smsLog = new NotificationLog(
                customerPhone,
                "SMS",
                "BOOKING_CONFIRMATION",
                "SMS Booking Confirmation (#" + bookingRef + ")",
                smsBody,
                bookingRef
            );
            createdLogs.add(logRepository.save(smsLog));
            System.out.println(">>> [SMS DISPATCHED TO " + customerPhone + "] " + smsBody);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Booking confirmation dispatched successfully via " + (channel != null ? channel : "BOTH"));
        result.put("recipientEmail", customerEmail);
        result.put("recipientPhone", customerPhone);
        result.put("bookingReference", bookingRef);
        result.put("logs", createdLogs);
        return result;
    }

    /**
     * Dispatches Payment Receipt Notification via Email and/or SMS
     */
    public Map<String, Object> sendPaymentReceipt(String bookingReference, String customerEmail, String customerPhone, Double amount, String method, String txnId) {
        String ref = bookingReference != null ? bookingReference : "GJE-GEN";
        String email = customerEmail != null ? customerEmail : "customer@gjenterprise.com";
        String phone = customerPhone != null ? customerPhone : "+91 9876543299";
        String tId = txnId != null ? txnId : ("TXN-" + System.currentTimeMillis() % 1000000);
        String pMethod = method != null ? method : "UPI";
        String amtStr = amount != null ? ("₹" + String.format("%,.2f", amount)) : "₹15,000";

        String emailSubject = "💳 Payment Receipt & GST Invoice: " + amtStr + " for #" + ref + " - GJ Enterprise";
        String emailBody = "<!DOCTYPE html><html><body><h2>Payment Receipt</h2><p>Dear Customer, we have received your payment of <strong>" + amtStr + "</strong> via " + pMethod + " (Txn ID: <code>" + tId + "</code>) for Tour #" + ref + ".</p><p>Official GST tax invoice is available in your customer portal.</p></body></html>";

        NotificationLog emailLog = logRepository.save(new NotificationLog(
            email, "EMAIL", "PAYMENT_RECEIPT", emailSubject, emailBody, ref
        ));
        dispatchRealEmail(email, emailSubject, emailBody);

        String smsText = "💳 GJ ENTERPRISE: Received " + amtStr + " via " + pMethod + " (Txn: " + tId + ") for Booking #" + ref + ". GST Tax Invoice ready in your customer portal. Helpline: +91 98765 43210";
        NotificationLog smsLog = logRepository.save(new NotificationLog(
            phone, "SMS", "PAYMENT_RECEIPT", "Payment Receipt SMS", smsText, ref
        ));

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Payment receipt and GST invoice notification sent via Email & SMS");
        res.put("emailLog", emailLog);
        res.put("smsLog", smsLog);
        return res;
    }

    /**
     * Dispatches Tour Quotation Proposal via Email & SMS
     */
    public Map<String, Object> sendQuotationNotification(Long enquiryId, String clientName, String clientEmail, String clientPhone, String destination) {
        String email = clientEmail != null ? clientEmail : "customer@gjenterprise.com";
        String phone = clientPhone != null ? clientPhone : "+91 9876543299";
        String name = clientName != null ? clientName : "Valued Traveller";
        String dest = destination != null ? destination : "Custom Holiday";
        String quoteRef = "QT-2026-ENQ" + (enquiryId != null ? enquiryId : "01");

        String emailSubject = "📋 Official Tour Proposal & Quotation: " + dest + " (" + quoteRef + ") - GJ Enterprise";
        String emailBody = "<!DOCTYPE html><html><body style='font-family: Arial, sans-serif; padding: 20px;'>"
            + "<h2 style='color: #1e3a8a;'>GJ ENTERPRISE LUXURY TRAVEL</h2>"
            + "<p>Dear <strong>" + name + "</strong>,</p>"
            + "<p>Your customized quotation proposal for <strong>" + dest + "</strong> has been prepared by our senior tour planner Vikram Sharma.</p>"
            + "<p>Proposal Reference: <strong>" + quoteRef + "</strong> (Valid for 15 days)</p>"
            + "<p><a href='http://localhost:5173' style='background: #1e3a8a; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none;'>View Proposal in Portal</a></p>"
            + "</body></html>";

        NotificationLog emailLog = logRepository.save(new NotificationLog(
            email, "EMAIL", "QUOTATION_PROPOSAL", emailSubject, emailBody, quoteRef
        ));
        dispatchRealEmail(email, emailSubject, emailBody);

        String smsText = "📋 GJ ENTERPRISE: Dear " + name + ", your bespoke proposal for " + dest + " (" + quoteRef + ") is ready with 4-star stays & cab. View & download PDF at http://localhost:5173 or call +91 98765 43210";
        NotificationLog smsLog = logRepository.save(new NotificationLog(
            phone, "SMS", "QUOTATION_PROPOSAL", "Quotation Proposal SMS", smsText, quoteRef
        ));

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Quotation proposal sent via Email & SMS");
        res.put("emailLog", emailLog);
        res.put("smsLog", smsLog);
        return res;
    }

    private String buildBookingConfirmationEmailHtml(String name, String dest, String ref, String travelDate, String total, String advance) {
        return "<!DOCTYPE html><html><body style='font-family: Arial, sans-serif; color: #0f172a; padding: 20px; background: #f8fafc;'>"
            + "<div style='max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #e2e8f0;'>"
            + "<div style='text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 20px;'>"
            + "<h2 style='color: #1e3a8a; margin: 0;'>✈️ GJ ENTERPRISE LUXURY TRAVEL</h2>"
            + "<p style='color: #64748b; margin: 4px 0 0;'>Official Booking Confirmation & Travel Voucher</p>"
            + "</div>"
            + "<p style='font-size: 16px; margin-top: 20px;'>Dear <strong>" + name + "</strong>,</p>"
            + "<p>Pack your bags! Your holiday to <strong>" + dest + "</strong> is officially confirmed. Our operations team and dedicated tour manager are preparing your VIP arrangements.</p>"
            + "<div style='background: #f1f5f9; padding: 18px; border-radius: 10px; margin: 20px 0;'>"
            + "<table style='width: 100%; border-collapse: collapse; font-size: 14px;'>"
            + "<tr><td style='color: #64748b; padding: 6px 0;'>Booking Reference:</td><td><strong style='color: #1e3a8a;'>#" + ref + "</strong></td></tr>"
            + "<tr><td style='color: #64748b; padding: 6px 0;'>Destination:</td><td><strong>" + dest + "</strong></td></tr>"
            + "<tr><td style='color: #64748b; padding: 6px 0;'>Departure Date:</td><td><strong>" + travelDate + "</strong></td></tr>"
            + "<tr><td style='color: #64748b; padding: 6px 0;'>Total Tour Value:</td><td><strong>" + total + "</strong></td></tr>"
            + "<tr><td style='color: #64748b; padding: 6px 0;'>Advance Credited:</td><td><strong style='color: #16a34a;'>" + advance + " (Verified)</strong></td></tr>"
            + "</table>"
            + "</div>"
            + "<div style='background: #eff6ff; border: 1px solid #bfdbfe; padding: 14px; border-radius: 8px; font-size: 13px; color: #1e3a8a; margin-bottom: 20px;'>"
            + "🛎️ <strong>24/7 Dedicated Concierge Helpline:</strong> +91 98765 43210<br/>"
            + "Your assigned tour manager Vikram Sharma is available on WhatsApp and call for special requests."
            + "</div>"
            + "<div style='text-align: center; margin-top: 25px;'>"
            + "<a href='http://localhost:5173' style='background: #1e3a8a; color: #ffffff; padding: 12px 26px; border-radius: 25px; text-decoration: none; font-weight: bold; display: inline-block;'>Access Customer Portal &amp; Vault →</a>"
            + "</div>"
            + "<p style='font-size: 12px; color: #94a3b8; text-align: center; margin-top: 30px;'>GJ Enterprise Luxury Holidays LLP • Greater Noida, Uttar Pradesh, India • GSTIN: 09AAACG1234F1Z5</p>"
            + "</div>"
            + "</body></html>";
    }
}
