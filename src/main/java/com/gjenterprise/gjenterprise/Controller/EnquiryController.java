package com.gjenterprise.gjenterprise.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gjenterprise.gjenterprise.Entity.Enquiry;
import com.gjenterprise.gjenterprise.Service.EnquiryService;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping
    public ResponseEntity<Enquiry> createEnquiry(@RequestBody Enquiry enquiry) {

        Enquiry savedEnquiry = enquiryService.createEnquiry(enquiry);

        return ResponseEntity.ok(savedEnquiry);
    }

    
    @GetMapping
    public ResponseEntity<List<Enquiry>> getAllEnquiries() {

        List<Enquiry> enquiries = enquiryService.getAllEnquiries();

        return ResponseEntity.ok(enquiries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enquiry> getEnquiryById(@PathVariable Long id) {

        Enquiry enquiry = enquiryService.getEnquiryById(id);

        return ResponseEntity.ok(enquiry);
    }

   
    @PutMapping("/{id}")
    public ResponseEntity<Enquiry> updateEnquiryStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Enquiry updatedEnquiry =
                enquiryService.updateEnquiryStatus(id, status);

        return ResponseEntity.ok(updatedEnquiry);
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEnquiry(@PathVariable Long id) {

        enquiryService.deleteEnquiry(id);

        return ResponseEntity.ok("Enquiry deleted successfully");
    }
}
