package com.gjenterprise.gjenterprise.Service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.gjenterprise.gjenterprise.Entity.Enquiry;
import com.gjenterprise.gjenterprise.Repository.EnquiryRepository;

@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;

    public EnquiryService(EnquiryRepository enquiryRepository) {
        this.enquiryRepository = enquiryRepository;
    }

    public Enquiry createEnquiry(Enquiry enquiry) {

    enquiry.setStatus("NEW");

    enquiry.setCreatedAt(LocalDateTime.now());
    enquiry.setUpdatedAt(LocalDateTime.now());

    return enquiryRepository.save(enquiry);
}

    public List<Enquiry> getAllEnquiries() {
        return enquiryRepository.findAll();
    }
    public Enquiry getEnquiryById(Long id) {
    return enquiryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Enquiry not found with id: " + id));
}

public Enquiry updateEnquiryStatus(Long id, String status) {

    Enquiry enquiry = enquiryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Enquiry not found with id: " + id));

    enquiry.setStatus(status);
    enquiry.setUpdatedAt(LocalDateTime.now());

    return enquiryRepository.save(enquiry);
}

public void deleteEnquiry(Long id) {

    if (!enquiryRepository.existsById(id)) {
        throw new RuntimeException("Enquiry not found with id: " + id);
    }

    enquiryRepository.deleteById(id);
}
}