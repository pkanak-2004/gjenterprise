package com.gjenterprise.gjenterprise;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class GjenterpriseApplication {

	public static void main(String[] args) {
		SpringApplication.run(GjenterpriseApplication.class, args);
	}

	@Bean
	public CommandLineRunner fixDatabaseSchema(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.execute("ALTER TABLE enquiry MODIFY COLUMN message TEXT");
				System.out.println("✓ Altered enquiry.message to TEXT successfully");
			} catch (Exception e) {
				System.out.println("Note on enquiry.message: " + e.getMessage());
			}

			try {
				jdbcTemplate.execute("ALTER TABLE enquiry MODIFY COLUMN service TEXT");
				System.out.println("✓ Altered enquiry.service to TEXT successfully");
			} catch (Exception e) {
				System.out.println("Note on enquiry.service: " + e.getMessage());
			}

			try {
				jdbcTemplate.execute("ALTER TABLE bookings MODIFY COLUMN special_requests TEXT");
				System.out.println("✓ Altered bookings.special_requests to TEXT successfully");
			} catch (Exception e) {
				System.out.println("Note on bookings.special_requests: " + e.getMessage());
			}
		};
	}

}
