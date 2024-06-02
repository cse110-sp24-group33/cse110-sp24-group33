# Pipeline Overview

## Current Components
- Linting via ESLint
- Automated unit tests w/ Jest running via GitHub actions
- Automated E2E tests w/ Puppeteer running via GitHub actions
- Code Quality via Code Factor
- Code Quality via Human PR Review
  - Required pull request reviewer + approval
  - Required passing status checks (linting, tests, static analysis)
  - Netlify staging app preview
  - Lighthouse audit
- Documentation generation (repo + wiki) w/ JSDoc via GitHub actions

![Phase 1 Pipeline Diagram](https://raw.githubusercontent.com/cse110-sp24-group33/cse110-sp24-group33/main/admin/cipipeline/phase1.drawio.png)

## Breakdown

### Development - Code Quality

Our pipeline begins with developers, who will push their code to the repository on their specific branches. At this stage, code styling is enforced via linting with ESLint (see configurations at `/source/.eslintrc.config.js`). To enforce style, we have a GitHub workflow (`eslint.yml`) which runs whenever changes are made to any JavaScript source code files. If any errors are detected according to the linter's configurations, the workflow log will indicate what areas of styling need to be updated. Once developers have finished their code, they can create a pull request to merge with the main branch. Another team member will review the code for quality, consistency, and efficiency, and then provide feedback (if needed). The pull request will be approved once any requested changes have been made. The branch also will require status checks on testing, linting, and static analysis to pass before merging.

### Testing - Unit and E2E

Any push containing changes to JavaScript source files will trigger automatic unit and end-to-end (E2E) tests. GitHub actions will trigger to run unit tests using Jest and E2E tests using Puppeteer. Unit tests are defined for each module to ensure module-specific functionality, and E2E tests are defined by page to ensure interface-specific functionality.

### Review & Automation - Code Quality

To maintain code quality, every pull request requires at least one code review with approval and status checks on testing, linting, and static analysis to pass.
For code reviews, they must be from a project team member not involved in writing the original code to avoid bias. This provides an extra layer of accountability to follow code quality and styling practices and protects the main branch from low quality code. To help with the review process, CodeFactor has been set up to evaluate changes for any styling issues were detected. Additionally, a Netlify staging preview will be generated for all branches and pull requests, which also provides a Lighthouse audit. This preview provides an opportunity to review the changes in a more interactive manner.

### Documentation 

Whenever a push is made to the main branch, GitHub actions are initiated to generate code documentation via JSDoc. This documentation is added to the branch in the folder `/source/docs/`. This ensures that all pull request merged will include updated code documentation. Additionally, a GitHub action has been set up to generate Markdown from JSDoc, which will be uploaded to the wiki alongside information about the project, team, and pipeline. Appropriate documentation ensures that developers will have sufficient guidance to modify the functionality if needed. Well-documented code also significantly speeds up the onboarding process for new team members. Our team also will write user documentation to improve the overall experience for end users. Our user documentation will serve as a guide to use our software to its full potential.