---
name: gujarati-to-english-prompter
description: Translates Gujarati input into professional English prompts. Use when the user provides instructions in Gujarati to ensure accuracy and prevent errors in execution.
---

# Gujarati-to-English Prompter Skill

This skill ensures that Gujarati instructions are correctly understood and translated into executable English prompts.

## Core Workflow

### 1. Translation
- Identify the core intent of the Gujarati text.
- Translate it into clear, professional English.

### 2. Prompt Structuring
- Convert the translated intent into a high-quality prompt for Gemini CLI.
- Include necessary context (e.g., "Update the frontend component...") if implied.

### 3. Error Prevention
- If the Gujarati text is ambiguous, ask for clarification before translating.

## Example
- **Input**: "Home page par join button ma loading add karo"
- **Translation**: "Add a loading state to the join button on the Home page."
- **Prompt**: "In Home.jsx, identify the 'Join' button and implement a loading state (spinner and disabled status) that triggers when the user clicks it and waits for the API response."
