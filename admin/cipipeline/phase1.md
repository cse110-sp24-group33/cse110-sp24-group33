# Phase 1 Pipeline Status Report

## Overview

This document outlines the current status and setup of the initial phase of our CI/CD pipeline. The pipeline is designed to enhance the development process by ensuring code quality, facilitating automated testing, and streamlining deployments. Below is the diagram illustrating our Phase 1 build pipeline:

![Phase 1 Pipeline Diagram](/admin/cipipeline/phase1.png)

## Pipeline Components

### Git Push

Developers push code to their specific branches and create pull requests to merge with the main branch. Each pull request undergoes a review by another team member for code quality and efficiency before a group leader approves it. Mandatory status checks must pass before merging.

### Build

The build process is automated using GitHub Actions. Each build runs in a clean and isolated environment, ensuring reproducibility and consistency across development cycles.

### Unit Tests

Unit tests are executed automatically as part of the build process. These tests are crucial for validating the functionality of individual modules and are designed to be isolated to specific components of the application.

### Human Review

Every pull request requires a code review from at least one team member not involved in the initial development. Documentation is also reviewed to maintain clarity and completeness, ensuring high-quality contributions.

### E2E Testing

End-to-end testing is conducted to verify the integration and functionality of all components. We utilize tools like Cypress to simulate realistic user interactions, such as clicking UI elements and inputting data, to ensure an error-free user experience.

### Documentation

Thorough documentation is maintained to guide both developers and end-users. It facilitates easier modifications and faster onboarding of new team members. Documentation ensures that developers understand the system's workings without needing to decipher the code directly, and helps users fully leverage the application's capabilities.

## Note

This document represents only the first stage of our pipeline. As our project evolves, we plan to enhance our pipeline with additional steps and tools to further improve our software development process by enhancing consistency, reliability, and risk mitigation. More features will be added to the pipeline as development progresses.
