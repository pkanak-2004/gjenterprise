package com.gjenterprise.gjenterprise.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_logs")
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipient; // Email or Phone number
    
    private String channel; // "EMAIL", "SMS", "WHATSAPP", "BOTH"
    
    private String notificationType; // "BOOKING_CONFIRMATION", "PAYMENT_RECEIPT", "QUOTATION_PROPOSAL", "CUSTOM_ALERT"
    
    private String subject;
    
    @Column(columnDefinition = "LONGTEXT")
    private String messageBody;
    
    private String status; // "DELIVERED", "SENT", "QUEUED", "FAILED"
    
    private String bookingReference;
    
    private LocalDateTime timestamp;

    public NotificationLog() {
        this.timestamp = LocalDateTime.now();
        this.status = "DELIVERED";
    }

    public NotificationLog(String recipient, String channel, String notificationType, String subject, String messageBody, String bookingReference) {
        this.recipient = recipient;
        this.channel = channel;
        this.notificationType = notificationType;
        this.subject = subject;
        this.messageBody = messageBody;
        this.bookingReference = bookingReference;
        this.status = "DELIVERED";
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(String notificationType) {
        this.notificationType = notificationType;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessageBody() {
        return messageBody;
    }

    public void setMessageBody(String messageBody) {
        this.messageBody = messageBody;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
