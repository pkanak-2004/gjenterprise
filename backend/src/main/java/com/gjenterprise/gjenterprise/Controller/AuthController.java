package com.gjenterprise.gjenterprise.Controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.gjenterprise.gjenterprise.Entity.User;
import com.gjenterprise.gjenterprise.Repository.UserRepository;
import com.gjenterprise.gjenterprise.Security.JwtService;
import com.gjenterprise.gjenterprise.dto.LoginRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User userRequest) {
        if (userRequest.getEmail() == null || userRequest.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("message", "Email is already registered"));
        }

        User newUser = new User();
        newUser.setName(userRequest.getName());
        newUser.setEmail(userRequest.getEmail());
        newUser.setPhone(userRequest.getPhone());
        newUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        newUser.setRole("CUSTOMER");

        User savedUser = userRepository.save(newUser);

        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getRole());

        return ResponseEntity.ok(
                Map.of(
                        "message", "Registration successful",
                        "token", token,
                        "role", savedUser.getRole(),
                        "name", savedUser.getName() != null ? savedUser.getName() : "",
                        "email", savedUser.getEmail()
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("message", "Invalid email or password"));
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            return ResponseEntity
                    .status(401)
                    .body(Map.of("message", "Invalid email or password"));
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(
                Map.of(
                    "message", "Login successful",
                    "token", token,
                    "role", user.getRole(),
                    "name", user.getName() != null ? user.getName() : "",
                    "email", user.getEmail()
                )
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName() != null ? user.getName() : "",
                "email", user.getEmail(),
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "role", user.getRole()
        ));
    }
}