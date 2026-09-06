package com.portal.complaint.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    
    private String password;
    
    private String fullName;
    
    private String role; // "STUDENT", "DEPT_ADMIN", "SUPER_ADMIN"
    
    private String department; // Optional, mainly for staff

    private String registerNumber; // Student register number

    private String batch; // e.g. "2024-2028"

    private String mobileNumber; // Student mobile number
}
