# SevaConnect Backend Conventions

## Architecture
- **Package Structure**: `com.example.seva_connect_backend.[layer]`
- **Interfaces**: Services must have interfaces in `service` and implementations in `service.impl`.
- **Dependency Injection**: Always use constructor injection. Avoid `@Autowired` on fields.

## Naming Conventions
- **Controllers**: `[Feature]Controller`
- **Services**: `[Feature]Service` (interface) and `[Feature]ServiceImpl` (implementation)
- **Repositories**: `[Feature]Repository`
- **Entities**: `[Feature]Entity`
- **DTOs**: `[Feature]RequestDto` or `[Feature]ResponseDto`

## API Design
- **REST Endpoints**: Use plural nouns for resources (e.g., `/volunteers`, `/events`).
- **Response Format**: Wrap responses in `ResponseEntity`.
- **Validation**: Use `@Valid` in controllers and standard Jakarta Validation annotations in DTOs.

## Error Handling
- Use custom exceptions in the `exception` package (e.g., `ResourceNotFoundException`, `BadRequestException`).
- `GlobalExceptionHandler` handles these and returns consistent error responses.

## Database & JPA
- Use `@Entity` for JPA entities.
- Use `@Id`, `@GeneratedValue(strategy = GenerationType.IDENTITY)` for IDs.
- Use Lombok annotations (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`) to reduce boilerplate.
- Prefer `JpaRepository` for data access.

## Coding Style
- Follow standard Java coding conventions.
- Keep methods focused and small.
- Use meaningful names for variables and methods.
- Add brief comments (especially with emojis for clarity like `// ✅ SUCCESS`) as seen in existing code.
