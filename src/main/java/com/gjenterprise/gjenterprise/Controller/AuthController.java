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
                    "role", user.getRole()
                )
        );
    }
}