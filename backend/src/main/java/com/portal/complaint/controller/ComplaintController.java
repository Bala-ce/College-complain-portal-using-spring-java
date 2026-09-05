package com.portal.complaint.controller;

import com.portal.complaint.entity.Complaint;
import com.portal.complaint.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    // 1. POST /api/complaints -> Save a new complaint
    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@RequestBody Complaint complaint) {
        // Generate a random complaint code if not provided
        if (complaint.getComplaintCode() == null || complaint.getComplaintCode().isEmpty()) {
            complaint.setComplaintCode("CMP-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }
        Complaint savedComplaint = complaintRepository.save(complaint);
        return ResponseEntity.ok(savedComplaint);
    }

    // 2. GET /api/complaints -> Fetch all complaints
    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        List<Complaint> complaints = complaintRepository.findAll();
        return ResponseEntity.ok(complaints);
    }

    // 3. GET /api/complaints/student/{studentId} -> Fetch complaints by student ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Complaint>> getComplaintsByStudent(@PathVariable String studentId) {
        List<Complaint> complaints = complaintRepository.findByStudentId(studentId);
        return ResponseEntity.ok(complaints);
    }

    // 4. GET /api/complaints/dept/{department} -> Fetch complaints by department
    @GetMapping("/dept/{department}")
    public ResponseEntity<List<Complaint>> getComplaintsByDepartment(@PathVariable String department) {
        List<Complaint> complaints = complaintRepository.findByDepartment(department);
        return ResponseEntity.ok(complaints);
    }

    // 5. GET /api/complaints/track/{code} -> Fetch single complaint by code
    @GetMapping("/track/{code}")
    public ResponseEntity<Complaint> getComplaintByCode(@PathVariable String code) {
        Optional<Complaint> complaint = complaintRepository.findByComplaintCode(code);
        return complaint.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 6. PATCH /api/complaints/{id}/status -> Update status & official reply for a complaint
    @PatchMapping("/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates) {
        
        Optional<Complaint> existingComplaintOpt = complaintRepository.findById(id);
        
        if (existingComplaintOpt.isPresent()) {
            Complaint existingComplaint = existingComplaintOpt.get();
            
            if (updates.containsKey("status")) {
                existingComplaint.setStatus(updates.get("status"));
            }
            if (updates.containsKey("officialReply")) {
                existingComplaint.setOfficialReply(updates.get("officialReply"));
            }
            
            Complaint updatedComplaint = complaintRepository.save(existingComplaint);
            return ResponseEntity.ok(updatedComplaint);
        }
        
        return ResponseEntity.notFound().build();
    }
}
