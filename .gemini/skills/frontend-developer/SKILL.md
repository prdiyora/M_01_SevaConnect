---
name: frontend-developer
description: Frontend development for SevaConnect using React, Vite, and Vanilla CSS. Use when building UI components, managing application state with AuthContext, or implementing responsive designs.
---

# Frontend Developer Skill

This skill provides specialized workflows and standards for the SevaConnect React frontend.

## Technical Standards
- **Framework**: React with Vite.
- **Styling**: Vanilla CSS (modular or global as appropriate). Avoid Tailwind unless requested.
- **State Management**: Use `AuthContext` for authentication and local `useState`/`useMemo` for component logic.
- **Routing**: `react-router-dom` for navigation.

## Core Workflows

### 1. Component Implementation
- Design components as functional components.
- Keep CSS in sibling `.css` files (e.g., `MyServices.jsx` and `MyServices.css`).
- Use variables from `theme.css` for colors, spacing, and fonts.

### 2. Integration
- Connect to the backend using service files in `src/services/` (e.g., `eventApi.js`).
- Use `axios` or `fetch` consistently.

### 3. Responsive Design
- Ensure components work on mobile and desktop using media queries.
