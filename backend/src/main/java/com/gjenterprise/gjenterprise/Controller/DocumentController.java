package com.gjenterprise.gjenterprise.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gjenterprise.gjenterprise.Entity.Document;
import com.gjenterprise.gjenterprise.Service.DocumentService;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Document>> getByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(documentService.getDocumentsByBooking(bookingId));
    }

    @GetMapping("/ref/{ref}")
    public ResponseEntity<List<Document>> getByBookingRef(@PathVariable String ref) {
        return ResponseEntity.ok(documentService.getDocumentsByBookingRef(ref));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Document>> getMyDocuments(Authentication auth, @RequestParam(required = false) String email) {
        String userEmail = (auth != null && auth.getName() != null) ? auth.getName() : email;
        if (userEmail == null || userEmail.isBlank()) {
            userEmail = "customer@gjenterprise.com";
        }
        return ResponseEntity.ok(documentService.getDocumentsByEmail(userEmail));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(@RequestBody Document docRequest,
                                           @RequestParam(required = false) Long bookingId,
                                           Authentication auth) {
        String userEmail = (auth != null && auth.getName() != null) ? auth.getName() : docRequest.getCustomerEmail();
        Document saved = documentService.saveDocument(docRequest, bookingId, userEmail);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyDocument(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.getOrDefault("status", "VERIFIED");
        String reason = payload.get("reason");
        Document updated = documentService.updateVerification(id, status, reason);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok(Map.of("message", "Document deleted successfully", "id", id));
    }
}
