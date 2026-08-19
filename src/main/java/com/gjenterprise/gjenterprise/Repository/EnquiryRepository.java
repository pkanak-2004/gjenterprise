package com.gjenterprise.gjenterprise.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.gjenterprise.gjenterprise.Entity.Enquiry;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

}
