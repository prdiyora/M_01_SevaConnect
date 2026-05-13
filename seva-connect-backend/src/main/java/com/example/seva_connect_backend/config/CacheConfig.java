package com.example.seva_connect_backend.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching   // ✅ Enable caching here
public class CacheConfig {
}