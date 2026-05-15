-- SQL Migration to fix Event Visibility
-- Run this on your PostgreSQL database (e.g., Neon Console)

-- 1. Ensure the 'visible' column exists
ALTER TABLE event ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT TRUE;

-- 2. Set all existing events to be visible by default
UPDATE event SET visible = TRUE WHERE visible IS NULL;

-- 3. (Optional) If you want to force all current events to be visible regardless of current state:
-- UPDATE event SET visible = TRUE;
