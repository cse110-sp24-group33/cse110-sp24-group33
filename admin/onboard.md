# Project Onboarding

## Repository Structure

-   `/.github/workflows`: workflows for GitHub Actions
-   `/admin`: Administrative materials
    -   `/admin/branding`: Branding materials (logo, color scheme, etc.)
    -   `/admin/cipipeline`: Pipeline artifacts (breakdown, diagram, video)
    -   `/admin/meetings`: Meeting minutes
    -   `/admin/misc`: Miscellaneous materials like team rules
    -   `/admin/videos`: Videos (team intro, etc.)
-   `/source`: Source code
    -   `/source/__tests__`: Unit and E2E tests
    -   `/source/public`: Client-side code accessible to the public
-   `/specs`: Project specifications
    -   `/specs/adrs`: Architectural Decision Records
    -   `/specs/brainstorm`: Brainstorming artifacts
    -   `/specs/pitch`: Project pitch deck

### 📁 Source Directory File Structure
- `package.json` contains metadata about the project, including dependencies and scripts
- `.config` files are used to configure project dependencies like Jest, ESLint, etc.
-   `__tests__` will contain all files used for testing
    -   `unit` will contain unit tests (Jest)
    -   `e2e` will contain all e2e tests (Jest Puppeteer)
-   `docs` will contain automatically generated documentation from JSDoc
-   `public` will contain all of the files accessible by the client/user
    -   `images`: images for the app
    -   `scripts`: JavaScript for the app
        -   `[function].util.js`: This naming scheme is used for utility scripts reusable in other modules (ex: date, localStorage)
        -   `main.[page-name].js`: This naming scheme is used for scripts specific to an HTML view
    -   `styles`: CSS styles for the app
        -   `styles.css` defines global styles to be used across the app
    -   `index.html` is the home page for the application
    -   `journal.html` is the journal page view for the application


## Getting Started

### Development Guidelines

-   Make sure you have git installed by runing `git --version` in your terminal.
-   If you do not have Git, install it [here](https://git-scm.com/downloads).

1. Make sure you have the latest version of `main` by running `git pull origin main`
2. Create & checkout a new branch to work on with that is descriptive of the feature/issue(s) you will be working on:
    - `git checkout -b [feature-topic]` 
3. Before committing any code, make sure you run `npm run lint` in the `/source` directory, which will run eslint on your code.
4. Add & commit your files with VS Code or Git commands. Make sure your commit messages are descriptive of the changes you've made.
5. If you want to update the remote repostiory, push your changes.
6. If you then want to merge your changes with the main branch, create a pull request for your branch
    - Make sure that your code passes the GitHub Actions checks (CodeFactor, linting, tests, Netlify deployment behavior)
  
### Understanding Pipeline Behavior and Setup
- Project builds happen automatically with Netlify for all branches and pull requests
- Checks run automatically according to the source files changed
- For more detailed information, see the pipeline documentation in the wiki [here](https://github.com/cse110-sp24-group33/cse110-sp24-group33/wiki/Pipeline)

### Understanding JavaScript Files and Methods
- See the JSDoc documentation generated to the wiki for each JS file [here](https://github.com/cse110-sp24-group33/)

### Project Issues (Backlog)
- All issues should have at least 3 tags: 
  1. the type of the task (ex: feature, testing)
  2. the priority (high/medium/low)
  3. the number of story points (1-3 estimation of effort required to complete it)