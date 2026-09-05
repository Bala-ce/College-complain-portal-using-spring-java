package com.portal.complaint.repository;

import com.portal.complaint.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    
    List<Complaint> findByStudentId(String studentId);
    
    List<Complaint> findByDepartment(String department);
    
    Optional<Complaint> findByComplaintCode(String complaintCode);
}
