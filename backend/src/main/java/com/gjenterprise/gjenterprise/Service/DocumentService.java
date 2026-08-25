package com.gjenterprise.gjenterprise.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.gjenterprise.gjenterprise.Entity.Booking;
import com.gjenterprise.gjenterprise.Entity.Document;
import com.gjenterprise.gjenterprise.Entity.User;
import com.gjenterprise.gjenterprise.Repository.BookingRepository;
import com.gjenterprise.gjenterprise.Repository.DocumentRepository;
import com.gjenterprise.gjenterprise.Repository.UserRepository;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public DocumentService(DocumentRepository documentRepository,
                           BookingRepository bookingRepository,
                           UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    public List<Document> getAllDocuments() {
        List<Document> docs = documentRepository.findAll();
        if (docs.isEmpty()) {
            seedSampleDocuments();
            docs = documentRepository.findAll();
        }
        return docs;
    }

    public List<Document> getDocumentsByBooking(Long bookingId) {
        return documentRepository.findByBookingId(bookingId);
    }

    public List<Document> getDocumentsByBookingRef(String ref) {
        return documentRepository.findByBookingReference(ref);
    }

    public List<Document> getDocumentsByEmail(String email) {
        return documentRepository.findByCustomerEmail(email);
    }

    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    public Document saveDocument(Document doc, Long bookingId, String email) {
        if (bookingId != null) {
            bookingRepository.findById(bookingId).ifPresent(b -> {
                doc.setBooking(b);
                if (doc.getBookingReference() == null || doc.getBookingReference().isBlank()) {
                    doc.setBookingReference(b.getBookingReference() != null ? b.getBookingReference() : "GJE-" + b.getId());
                }
                if (doc.getCustomerName() == null || doc.getCustomerName().isBlank()) {
                    doc.setCustomerName(b.getCustomerName());
                }
                if (doc.getCustomerEmail() == null || doc.getCustomerEmail().isBlank()) {
                    doc.setCustomerEmail(b.getCustomerEmail());
                }
            });
        }

        if (email != null && !email.isBlank()) {
            userRepository.findByEmail(email).ifPresent(u -> {
                doc.setUser(u);
                if (doc.getCustomerName() == null || doc.getCustomerName().isBlank()) {
                    doc.setCustomerName(u.getName());
                }
                if (doc.getCustomerEmail() == null || doc.getCustomerEmail().isBlank()) {
                    doc.setCustomerEmail(u.getEmail());
                }
            });
        }

        return documentRepository.save(doc);
    }

    public Document updateVerification(Long id, String status, String reason) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        doc.setVerificationStatus(status != null ? status.toUpperCase() : "VERIFIED");
        if (reason != null && !reason.isBlank()) {
            doc.setRejectionReason(reason);
        } else if ("VERIFIED".equalsIgnoreCase(status)) {
            doc.setRejectionReason(null);
        }

        return documentRepository.save(doc);
    }

    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }

    private void seedSampleDocuments() {
        createSampleDoc(
            "Passport_Front_Rahul_Sharma.pdf",
            "application/pdf",
            "PASSPORT",
            "1.8 MB",
            "VERIFIED",
            "CUSTOMER",
            "Rahul Sharma",
            "customer@gjenterprise.com",
            "GJE-KSH-8821"
        );

        createSampleDoc(
            "Kashmir_Flight_Tickets_Indigo.pdf",
            "application/pdf",
            "FLIGHT_TICKET",
            "2.4 MB",
            "VERIFIED",
            "ADMIN",
            "Rahul Sharma",
            "customer@gjenterprise.com",
            "GJE-KSH-8821"
        );

        createSampleDoc(
            "Aadhaar_Card_Guest_2.jpg",
            "image/jpeg",
            "AADHAAR_ID",
            "850 KB",
            "VERIFIED",
            "CUSTOMER",
            "Rahul Sharma",
            "customer@gjenterprise.com",
            "GJE-GOA-5490"
        );

        createSampleDoc(
            "Goa_Resort_Hotel_Voucher.pdf",
            "application/pdf",
            "HOTEL_VOUCHER",
            "1.1 MB",
            "VERIFIED",
            "ADMIN",
            "Rahul Sharma",
            "customer@gjenterprise.com",
            "GJE-GOA-5490"
        );

        createSampleDoc(
            "Overseas_Travel_Insurance_Policy.pdf",
            "application/pdf",
            "TRAVEL_INSURANCE",
            "980 KB",
            "PENDING_REVIEW",
            "CUSTOMER",
            "Rahul Sharma",
            "customer@gjenterprise.com",
            "GJE-KSH-8821"
        );
    }

    private void createSampleDoc(String name, String type, String cat, String size, String status, String role, String cName, String email, String ref) {
        Document d = new Document();
        d.setFileName(name);
        d.setFileType(type);
        d.setDocumentCategory(cat);
        d.setFileSize(size);
        d.setVerificationStatus(status);
        d.setUploadedByRole(role);
        d.setCustomerName(cName);
        d.setCustomerEmail(email);
        d.setBookingReference(ref);
        d.setFileData("data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0xpbmVhcml6ZWQgMQovTCA1NzI0Ci9IIDtbIDY5MSAyMjMgXQovTyA2Ci9FIDUzOTgKL04gMQovVCA1NDg5Cj4+CmVuZG9iag==");
        documentRepository.save(d);
    }
}

