package com.example.seva_connect_backend.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

@Configuration
@Slf4j
public class DataMigrationConfig {

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    @Transactional
    public CommandLineRunner migrateVisibility() {
        return args -> {
            log.info("🚀 Starting database migration: Ensuring 'visible' column exists and is initialized...");
            try {
                // 1. Try to add the column if it doesn't exist (PostgreSQL syntax)
                entityManager.createNativeQuery("ALTER TABLE event ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT TRUE").executeUpdate();
                log.info("✅ Checked/Added 'visible' column.");

                // 2. Update existing NULLs to TRUE
                int updatedCount = entityManager.createNativeQuery("UPDATE event SET visible = TRUE WHERE visible IS NULL").executeUpdate();
                log.info("✅ Migration complete. Updated {} existing records to visible=true.", updatedCount);
            } catch (Exception e) {
                log.warn("⚠️ Migration notice: {}. This might be expected if the column already exists or is being handled by Hibernate.", e.getMessage());
            }
        };
    }
}

