package com.gjenterprise.gjenterprise.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gjenterprise.gjenterprise.Entity.User;
import com.gjenterprise.gjenterprise.Repository.UserRepository;

@org.springframework.web.bind.annotation.CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/employees")
    public ResponseEntity<List<User>> getAllEmployees() {
        List<User> allUsers = userRepository.findAll();
        boolean hasEmployees = allUsers.stream().anyMatch(u -> "EMPLOYEE".equalsIgnoreCase(u.getRole()));

        if (!hasEmployees) {
            seedDefaultEmployee("Vikram Sharma", "vikram@gjenterprise.com", "+91 9876543210");
            seedDefaultEmployee("Neha Patel", "neha@gjenterprise.com", "+91 9876543211");
            seedDefaultEmployee("Rahul Roy", "rahul@gjenterprise.com", "+91 9876543212");
            seedDefaultEmployee("Priya Singh", "priya@gjenterprise.com", "+91 9876543213");
            allUsers = userRepository.findAll();
        }

        return ResponseEntity.ok(allUsers);
    }

    private void seedDefaultEmployee(String name, String email, String phone) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User emp = new User();
            emp.setName(name);
            emp.setEmail(email);
            emp.setPhone(phone);
            emp.setRole("EMPLOYEE");
            emp.setPassword(passwordEncoder.encode("Agent@123"));
            userRepository.save(emp);
        }
    }

    @PostMapping("/employees")
    public ResponseEntity<?> createEmployee(@RequestBody User employee) {
        if (employee.getEmail() == null || employee.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        if (userRepository.findByEmail(employee.getEmail()).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("message", "Email already exists"));
        }

        User newUser = new User();
        newUser.setName(employee.getName());
        newUser.setEmail(employee.getEmail());
        newUser.setPhone(employee.getPhone());
        newUser.setPassword(passwordEncoder.encode(employee.getPassword()));
        newUser.setRole(employee.getRole() != null ? employee.getRole() : "EMPLOYEE");

        User saved = userRepository.save(newUser);
        return ResponseEntity.ok(saved);
    }
}
