---
name: database
description: PostgreSQL database management and query optimization for the SevaConnect project. Use when working with the 'postgres-server' MCP tool to manage schemas, write complex queries, or ensure data integrity.
---

# Database Management Skill

This skill provides specialized workflows for managing the SevaConnect PostgreSQL database.

## Core Workflows

### 1. Schema Management
When modifying the database schema (tables, constraints, indexes), follow this procedure:
- **Research**: List existing tables using `mcp_postgres-server_list_tables`.
- **Strategy**: Draft the SQL migration.
- **Execution**: Run the query using `mcp_postgres-server_query`.

### 2. Query Optimization
When writing or optimizing queries:
- Use `EXPLAIN ANALYZE` to understand execution plans.
- Ensure proper indexing on frequently filtered or joined columns (e.g., `volunteer_id`, `event_id`).
- Prefer set-based operations over complex application-side logic.

### 3. Data Integrity
- Validate data before insertion or update.
- Use transactions for multi-step updates to ensure atomicity.

## Resources
- **postgres-server MCP**: Use this for all direct database interactions.
