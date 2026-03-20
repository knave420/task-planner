# Task Planner

## Current State
New project. No existing functionality.

## Requested Changes (Diff)

### Add
- Task planner app with trial data for 3 departments: Purchase, Marketing, Store
- Each task has: department, mode (OFFLINE/ON SITE or ONLINE), description, status (pending)
- Filter bar: filter by Department (All, Purchase, Marketing, Store)
- Filter bar: filter by Mode (All, On Site, Online)
- Task cards showing task description, department badge, mode badge, status
- Seed data with all tasks from user prompt

### Modify
- None

### Remove
- None

## Implementation Plan
1. Backend: Task actor with hardcoded seed data, query functions with optional filters for department and mode
2. Frontend: Dashboard with filter bar, task cards grid, responsive layout
