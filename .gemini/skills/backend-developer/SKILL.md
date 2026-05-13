---
name: backend-developer
description: Backend software engineering for the SevaConnect project. Use when designing, implementing, or debugging Spring Boot 4 applications, JPA entities, REST/GraphQL APIs, and security configurations.
---

# Backend Developer Skill

This skill provides specialized guidance for developing the SevaConnect backend using Spring Boot 4 and Java 25.

## Tech Stack
- **Language**: Java 25
- **Framework**: Spring Boot 4.0.5
- **Build Tool**: Maven
- **Database**: PostgreSQL (Primary)
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT (jjwt)
- **Documentation**: Springdoc OpenAPI (Swagger)
- **Utilities**: Lombok, Validation, Caching
- **API**: REST and GraphQL

## Development Workflow
1. **Research**: Analyze requirements and existing code.
2. **Entity Design**: Define JPA entities in `com.example.seva_connect_backend.entity`.
3. **Data Access**: Create repositories in `com.example.seva_connect_backend.repository`.
4. **Business Logic**: Implement services in `com.example.seva_connect_backend.service`.
5. **API Layer**: Expose endpoints in `com.example.seva_connect_backend.controller`.
6. **Validation & DTOs**: Use DTOs in `com.example.seva_connect_backend.dto` and standard validation annotations.

## References
- [Conventions](references/conventions.md): Coding standards, naming conventions, and patterns.
- [Security](references/security.md): JWT implementation and Spring Security configuration.
- [Testing](references/testing.md): Patterns for unit and integration testing.

## Common Commands
- Build project: `./mvnw clean install`
- Run tests: `./mvnw test`
- Run application: `./mvnw spring-boot:run`
