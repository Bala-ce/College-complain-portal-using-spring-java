package com.portal.complaint;

import com.portal.complaint.entity.User;
import com.portal.complaint.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ComplaintApplication {

	public static void main(String[] args) {
		SpringApplication.run(ComplaintApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataSeeder(UserRepository userRepository) {
		return args -> {
			if (userRepository.count() == 0) {
				User admin = User.builder()
						.email("staff@college.edu")
						.password("admin123") // in a real app, hash this
						.fullName("Default Admin")
						.role("DEPT_ADMIN")
						.department("All Departments")
						.build();
				userRepository.save(admin);
				System.out.println("Default admin user seeded.");
			}
		};
	}
}
