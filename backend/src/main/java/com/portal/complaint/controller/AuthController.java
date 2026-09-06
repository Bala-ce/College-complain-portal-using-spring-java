package com.portal.complaint.controller;

import com.portal.complaint.dto.LoginRequest;
import com.portal.complaint.dto.RegisterRequest;
import com.portal.complaint.entity.User;
import com.portal.complaint.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    /** Role from email: contains "staff" → DEPT_ADMIN, else STUDENT */
    private String resolveRole(String email) {
        if (email != null && email.toLowerCase().contains("staff")) {
            return "DEPT_ADMIN";
        }
        return "STUDENT";
    }

    /** Never expose password to frontend */
    private Map<String, Object> safeUser(User user) {
        Map<String, Object> res = new HashMap<>();
        res.put("id",             user.getId());
        res.put("fullName",       user.getFullName());
        res.put("email",          user.getEmail());
        res.put("role",           user.getRole());
        res.put("department",     user.getDepartment());
        res.put("registerNumber", user.getRegisterNumber());
        res.put("batch",          user.getBatch());
        res.put("mobileNumber",   user.getMobileNumber());
        return res;
    }

    // ─── REGISTER ────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email is already registered. Please login instead.");
        }

        User newUser = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(resolveRole(request.getEmail()))
                .registerNumber(request.getRegisterNumber())
                .build();

        userRepository.save(newUser);
        return ResponseEntity.ok(safeUser(newUser));
    }

    // ─── LOGIN ───────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(request.getPassword())) {
                return ResponseEntity.ok(safeUser(user));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password. Please try again.");
    }

    // ─── CHANGE PASSWORD (logged-in user) ───────────────────────────────────
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        String email       = body.get("email");
        String newPassword = body.get("newPassword");

        if (email == null || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Email and new password are required.");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        User user = userOpt.get();
        user.setPassword(newPassword);
        userRepository.save(user);
        return ResponseEntity.ok("Password updated successfully.");
    }

    // ─── FORGOT PASSWORD (by email, no old password required) ───────────────
    @PutMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email       = body.get("email");
        String newPassword = body.get("newPassword");

        if (email == null || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Email and new password are required.");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No account found with that email address.");
        }

        User user = userOpt.get();
        user.setPassword(newPassword);
        userRepository.save(user);
        return ResponseEntity.ok("Password reset successfully.");
    }

    // ─── UPDATE PROFILE ──────────────────────────────────────────────────────
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body("Email is required.");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        User user = userOpt.get();
        if (body.containsKey("fullName")     && body.get("fullName")     != null) user.setFullName(body.get("fullName"));
        if (body.containsKey("department")   && body.get("department")   != null) user.setDepartment(body.get("department"));
        if (body.containsKey("batch")        && body.get("batch")        != null) user.setBatch(body.get("batch"));
        if (body.containsKey("mobileNumber") && body.get("mobileNumber") != null) user.setMobileNumber(body.get("mobileNumber"));

        userRepository.save(user);
        return ResponseEntity.ok(safeUser(user));
    }
}
