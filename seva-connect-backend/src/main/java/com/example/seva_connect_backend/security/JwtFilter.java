package com.example.seva_connect_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    // ✅ 1. SKIP filter for public URLs
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/auth")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui")
                || path.equals("/swagger-ui.html");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;
        String role = null;

        // ✅ 2. Check header exists and starts with "Bearer "
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ 3. Extract token
        jwt = authorizationHeader.substring(7);

        if (jwt.trim().isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // ✅ 4. Extract username & role from token
            username = jwtUtil.extractUsername(jwt);
            role = jwtUtil.extractRole(jwt);
        } catch (Exception e) {
            System.out.println("❌ JWT Token parsing failed: " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ 5. Authenticate user if not already authenticated
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {

                // ✅ IMPORTANT: Build authority from JWT role WITH "ROLE_" prefix
                // Normalize role (in case it already has ROLE_ prefix)
                String authorityRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;

                List<SimpleGrantedAuthority> authorities =
                        List.of(new SimpleGrantedAuthority(authorityRole));

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                authorities  // ✅ Use JWT-based authorities
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // ✅ Debug logs
                System.out.println("✅ Authenticated User: " + username);
                System.out.println("✅ Role from JWT: " + role);
                System.out.println("✅ Spring Authority: " + authorityRole);

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // ✅ 6. Continue filter chain
        filterChain.doFilter(request, response);
    }
}
