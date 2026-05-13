# SevaConnect Backend Testing

## Testing Philosophy
- Always write unit tests for business logic in Services.
- Use Integration tests for critical API flows and Repository queries.
- Mock external dependencies using Mockito.

## Unit Testing
- **Tool**: JUnit 5, Mockito.
- **Service Tests**: Use `@ExtendWith(MockitoExtension.class)`.
- **Annotations**:
    - `@Mock`: Mock dependencies.
    - `@InjectMocks`: Inject mocks into the service being tested.

## API Testing (Integration)
- **Tool**: `@WebMvcTest` or `@SpringBootTest`.
- **MockMvc**: Use `MockMvc` to perform requests and verify responses.
- **Example**:
```java
@WebMvcTest(EventController.class)
class EventControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventService eventService;

    @Test
    void shouldReturnAllEvents() throws Exception {
        mockMvc.perform(get("/events"))
               .andExpect(status().isOk());
    }
}
```

## Repository Testing
- **Tool**: `@DataJpaTest`.
- Use an H2 in-memory database or a dedicated test database container.
