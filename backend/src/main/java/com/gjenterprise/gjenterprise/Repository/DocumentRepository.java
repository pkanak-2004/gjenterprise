package com.gjenterprise.gjenterprise.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gjenterprise.gjenterprise.Entity.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByBookingId(Long bookingId);

    List<Document> findByBookingReference(String bookingReference);

    List<Document> findByUserId(Long userId);

    List<Document> findByCustomerEmail(String customerEmail);

    List<Document> findByVerificationStatus(String verificationStatus);

    List<Document> findByDocumentCategory(String documentCategory);
}
