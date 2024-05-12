# Use localStorage to store journal entries and projects

-   Status: Accepted
-   Date: 2024-05-11

## Context and Problem Statement

We need a way to store users' journal entries (tasks, markdown, sentiments) and projects data.

## Considered Options
-  localStorage
-  Database

## Decision Outcome
Chosen option: "local storage" because it is simpler, localized and still offers the required functionality.

### Positive Consequences
-   Ability to save users' data and preferences
-   No learning curve in configuration or managing an external database
-   localStorage is not dependent on users' networks

### Negative Consequences
-   Lack of permanent storage for data, meaning we won't have backups
-   Users won't be able to access their data virtually or across devices

## Links
- [mdn localStorage docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)