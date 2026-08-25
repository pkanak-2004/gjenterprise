package com.gjenterprise.gjenterprise.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gjenterprise.gjenterprise.Entity.Enquiry;
import com.gjenterprise.gjenterprise.Service.EnquiryService;

@RestController
@RequestMapping("/api/enquiries")
@CrossOrigin(origins = "*")
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

    @CrossOrigin(origins = "*")
    @PutMapping("/{id}")
    public ResponseEntity<Enquiry> updateEnquiry(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long employeeId,
            @RequestBody(required = false) java.util.Map<String, Object> body) {

        Enquiry enquiry = enquiryService.getEnquiryById(id);

        if (status != null && !status.isBlank()) {
            enquiry = enquiryService.updateEnquiryStatus(id, status);
        } else if (body != null && body.containsKey("status") && body.get("status") != null) {
            enquiry = enquiryService.updateEnquiryStatus(id, String.valueOf(body.get("status")));
        }

        if (priority != null && !priority.isBlank()) {
            enquiry = enquiryService.updateLeadPriority(id, priority);
        } else if (body != null && body.containsKey("priority") && body.get("priority") != null) {
            enquiry = enquiryService.updateLeadPriority(id, String.valueOf(body.get("priority")));
        }

        if (employeeId != null) {
            enquiry = enquiryService.assignLeadToEmployee(id, employeeId);
        } else if (body != null && body.containsKey("employeeId")) {
            Object empObj = body.get("employeeId");
            Long parsedEmpId = null;
            if (empObj != null && !empObj.toString().isBlank() && !"null".equalsIgnoreCase(empObj.toString())) {
                parsedEmpId = Long.valueOf(empObj.toString());
            }
            enquiry = enquiryService.assignLeadToEmployee(id, parsedEmpId);
        }

        return ResponseEntity.ok(enquiry);
    }

    @CrossOrigin(origins = "*")
    @PutMapping(value = {"/{id}/status"})
    public ResponseEntity<Enquiry> updateEnquiryStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestBody(required = false) java.util.Map<String, Object> body) {

        String newStatus = status;
        if (newStatus == null && body != null && body.containsKey("status")) {
            newStatus = String.valueOf(body.get("status"));
        }
        if (newStatus == null || newStatus.isBlank()) {
            newStatus = "NEW";
        }

        Enquiry updatedEnquiry = enquiryService.updateEnquiryStatus(id, newStatus);
        return ResponseEntity.ok(updatedEnquiry);
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/{id}/assign")
    public ResponseEntity<Enquiry> assignLead(
            @PathVariable Long id,
            @RequestParam(required = false) Long employeeId,
            @RequestBody(required = false) java.util.Map<String, Object> body) {
        Long targetEmployeeId = employeeId;
        if (targetEmployeeId == null && body != null && body.containsKey("employeeId")) {
            Object empObj = body.get("employeeId");
            if (empObj != null && !empObj.toString().isBlank()) {
                targetEmployeeId = Long.valueOf(empObj.toString());
            }
        }
        return ResponseEntity.ok(enquiryService.assignLeadToEmployee(id, targetEmployeeId));
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/{id}/priority")
    public ResponseEntity<Enquiry> updatePriority(
            @PathVariable Long id,
            @RequestParam(required = false) String priority,
            @RequestBody(required = false) java.util.Map<String, Object> body) {
        String newPriority = priority;
        if (newPriority == null && body != null && body.containsKey("priority")) {
            newPriority = String.valueOf(body.get("priority"));
        }
        if (newPriority == null || newPriority.isBlank()) {
            newPriority = "MEDIUM";
        }
        return ResponseEntity.ok(enquiryService.updateLeadPriority(id, newPriority));
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/{id}/notes")
    public ResponseEntity<Enquiry> updateNotes(
            @PathVariable Long id,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate followUpDate,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(enquiryService.updateNotesAndFollowUp(id, followUpDate, notes));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEnquiry(@PathVariable Long id) {

        enquiryService.deleteEnquiry(id);

        return ResponseEntity.ok("Enquiry deleted successfully");
    }
}
