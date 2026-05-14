package com.example.seva_connect_backend.config;

import com.example.seva_connect_backend.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // enables @PreAuthorize / @PostAuthorize on controllers
public class SecurityConfig {

        private final JwtFilter jwtAuthFilter;

        public SecurityConfig(JwtFilter jwtAuthFilter) {
                this.jwtAuthFilter = jwtAuthFilter;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                                .authorizeHttpRequests(auth -> auth
                                                // ✅ Allow CORS preflight
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                                // ✅ Public endpoints
                                                .requestMatchers(
                                                                "/auth/**",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/error")
                                                .permitAll()

                                                // ✅ Public GETs (browsing)
                                                .requestMatchers(HttpMethod.GET, "/services/**", "/contact/**")
                                                .permitAll()

                                                // 🔒 Admin-only
                                                .requestMatchers("/admin/**").hasRole("ADMIN")

                                                // 🔒 Volunteers — Specific "me" endpoint
                                                .requestMatchers(HttpMethod.PATCH, "/volunteers/me").hasAnyRole("VOLUNTEER", "ADMIN")

                                                // 🔒 Volunteers — DELETE / PATCH only by ADMIN
                                                .requestMatchers(HttpMethod.DELETE, "/volunteer/**", "/volunteers/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PATCH, "/volunteer/**", "/volunteers/**")
                                                .hasRole("ADMIN")

                                                // 🔒 Volunteers — GET / POST / PUT by VOLUNTEER or ADMIN
                                                .requestMatchers("/volunteer/**", "/volunteers/**")
                                                .hasAnyRole("VOLUNTEER", "ADMIN")

                                                // 🔒 Events - GET is public, others require authentication
                                                .requestMatchers(HttpMethod.GET, "/events/**").permitAll()
                                                .requestMatchers("/events/**").hasAnyRole("VOLUNTEER", "ADMIN")

                                                // Everything else
                                                .anyRequest().authenticated())

                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        // ✅ Centralized CORS Configuration (the ONLY one in the project)
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(List.of(
                                "http://localhost:3000",
                                "http://localhost:5173",
                                "http://localhost:5174",
                                "https://m-01-seva-connect.vercel.app",
                                "https://m-01-seva-connect-priyank-diyoras-projects.vercel.app"));

                configuration.setAllowedMethods(Arrays.asList(
                                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

                // Explicit headers — required when allowCredentials=true
                configuration.setAllowedHeaders(Arrays.asList(
                                "Authorization",
                                "Content-Type",
                                "Accept",
                                "Origin",
                                "X-Requested-With"));

                configuration.setExposedHeaders(List.of("Authorization"));
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L); // cache preflight for 1 hour

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }
}
