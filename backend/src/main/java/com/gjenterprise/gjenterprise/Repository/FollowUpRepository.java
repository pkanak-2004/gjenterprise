package com.gjenterprise.gjenterprise.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gjenterprise.gjenterprise.Entity.Enquiry;
import com.gjenterprise.gjenterprise.Entity.FollowUp;
import com.gjenterprise.gjenterprise.Entity.User;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {

    List<FollowUp> findByEnquiry(Enquiry enquiry);

    List<FollowUp> findByAssignedEmployee(User assignedEmployee);

    List<FollowUp> findByFollowUpDate(LocalDate date);
}
