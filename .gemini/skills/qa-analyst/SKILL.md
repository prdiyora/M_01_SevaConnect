---
name: qa-analyst
description: Quality assurance and testing for SevaConnect. Use when verifying features, performing UI checks, or ensuring that the code meets functional requirements.
---

# QA Analyst Skill

This skill provides workflows for testing and verifying the SevaConnect application.

## Verification Checklist
- **Functional**: Does the feature work as described? (e.g., "Does joining an event update the count?")
- **UI/UX**: Does the implementation match the designer's intent? Are there any visual glitches?
- **Security**: Is the authentication state handled correctly? Are protected routes actually protected?

## Core Workflows

### 1. Feature Verification
- Test the "Happy Path" (success scenarios).
- Test "Edge Cases" and error handling (e.g., "What if the API is down?").

### 2. Bug Reporting
- Document steps to reproduce any issues found.
- Categorize bugs by severity (Critical, Major, Minor).

### 3. Regression Testing
- Ensure that new changes haven't broken existing functionality (e.g., "Check login after updating My Services").
