package com.gjenterprise.gjenterprise.Security;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
//import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

            .requestMatchers("/api/auth/**").permitAll()

            .requestMatchers("/api/enquiries/**").permitAll()

            .requestMatchers("/api/bookings/**").permitAll()

            .requestMatchers("/api/payments/**").permitAll()

            .requestMatchers("/api/documents/**").permitAll()

            .requestMatchers("/api/notifications/**").permitAll()

            .requestMatchers("/api/users/**").permitAll()

            .requestMatchers(HttpMethod.GET, "/api/packages/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/packages/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/packages/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/packages/**").hasRole("ADMIN")

            .anyRequest().authenticated()
)

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:*",
            "http://127.0.0.1:*",
            "https://*.web.app",
            "https://*.firebaseapp.com"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

