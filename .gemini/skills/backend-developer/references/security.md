# SevaConnect Backend Security

## Spring Security Configuration
- Security is configured in `com.example.seva_connect_backend.config.SecurityConfig` (Note: I should verify if this file exists or if it's in another location).
- It uses stateless session management (SessionCreationPolicy.STATELESS).
- CSRF is disabled for the REST API.

## JWT Implementation
- **Utility**: `com.example.seva_connect_backend.security.JwtUtil`
- **Filter**: `com.example.seva_connect_backend.security.JwtFilter`
- **Roles**: Extracted from JWT claims (`role`).
- **Secret & Expiration**: Defined in `application.properties` as `jwt.secret` and `jwt.expiration`.

## Authentication Flow
1. User logs in via `AuthController`.
2. `AuthService` validates credentials.
3. `JwtUtil` generates a token containing user details and roles.
4. Token is returned in `AuthResponseDto`.
5. Subsequent requests include the token in the `Authorization: Bearer <token>` header.
6. `JwtFilter` extracts and validates the token, setting the security context.

## Authorization
- Use `@PreAuthorize("hasRole('ADMIN')")` or similar annotations on controller methods to restrict access.
- Ensure the `ROLE_` prefix is handled correctly (Spring Security usually expects roles to start with `ROLE_`).
