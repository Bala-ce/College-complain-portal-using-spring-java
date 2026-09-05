package com.portal.complaint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String complaintCode;
    private String studentId;
    private String department;
    private String category;
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private String status = "PENDING";

    @Builder.Default
    private String priority = "MEDIUM";

    @Column(columnDefinition = "TEXT")
    private String officialReply;

    @Column(columnDefinition = "TEXT")
    private String imageData;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "PENDING";
        }
        if (priority == null) {
            priority = "MEDIUM";
        }
    }
}
