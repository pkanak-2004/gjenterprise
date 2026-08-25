package com.gjenterprise.gjenterprise.Service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.gjenterprise.gjenterprise.Entity.Enquiry;
import com.gjenterprise.gjenterprise.Repository.EnquiryRepository;
import com.gjenterprise.gjenterprise.Repository.UserRepository;

@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;

    private static final Set<String> VALID_STATUSES = Set.of(
            "NEW",
            "PENDING",
            "CONTACTED",
            "FOLLOW_UP",
            "INTERESTED",
            "QUOTATION_SENT",
            "CONFIRMED",
            "BOOKED",
            "COMPLETED",
            "CANCELLED",
            "LOST"
    );

    private final UserRepository userRepository;

    public EnquiryService(EnquiryRepository enquiryRepository, UserRepository userRepository) {
        this.enquiryRepository = enquiryRepository;
        this.userRepository = userRepository;
    }

    // Create new lead
    public Enquiry createEnquiry(Enquiry enquiry) {

        enquiry.setStatus("NEW");
        if (enquiry.getPriority() == null) {
            enquiry.setPriority("MEDIUM");
        }
        if (enquiry.getLeadSource() == null) {
            enquiry.setLeadSource("WEBSITE");
        }

        return enquiryRepository.save(enquiry);
    }

    // Get all leads
    public List<Enquiry> getAllEnquiries() {
        return enquiryRepository.findAll();
    }

    // Get lead by ID
    public Enquiry getEnquiryById(Long id) {

        return enquiryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Enquiry not found with id: " + id));
    }

    // Update lead status
    public Enquiry updateEnquiryStatus(Long id, String status) {

        if (status == null || status.isBlank()) {
            return getEnquiryById(id);
        }

        String normalizedStatus = status.trim().toUpperCase().replace(" ", "_").replace("-", "_");

        Enquiry enquiry = getEnquiryById(id);
        enquiry.setStatus(normalizedStatus);

        return enquiryRepository.save(enquiry);
    }

    // Assign lead to employee
    public Enquiry assignLeadToEmployee(Long leadId, Long employeeId) {
        Enquiry lead = getEnquiryById(leadId);
        if (employeeId != null) {
            com.gjenterprise.gjenterprise.Entity.User employee = userRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));
            lead.setAssignedTo(employee);
        } else {
            lead.setAssignedTo(null);
        }
        return enquiryRepository.save(lead);
    }

    // Update Priority
    public Enquiry updateLeadPriority(Long leadId, String priority) {
        Enquiry lead = getEnquiryById(leadId);
        lead.setPriority(priority.toUpperCase());
        return enquiryRepository.save(lead);
    }

    // Update Notes and Follow-up Date
    public Enquiry updateNotesAndFollowUp(Long leadId, java.time.LocalDate followUpDate, String notes) {
        Enquiry lead = getEnquiryById(leadId);
        if (followUpDate != null) {
            lead.setFollowUpDate(followUpDate);
        }
        if (notes != null) {
            lead.setInternalNotes(notes);
        }
        return enquiryRepository.save(lead);
    }

    // Delete lead
    public void deleteEnquiry(Long id) {

        if (!enquiryRepository.existsById(id)) {
            throw new RuntimeException(
                    "Enquiry not found with id: " + id
            );
        }

        enquiryRepository.deleteById(id);
    }
}