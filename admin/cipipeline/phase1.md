# Pipelining Assignment

## Diagram

![Phase 1 Pipeline Diagram](/admin/cipipeline/phase1.png)

## Documentation

### Git Push

Developers can push their code to the repository on their specific branches. Once they have finished writing their code, they can create a pull request to merge with the main branch. Another team member will then take a look at the code quality and efficiency and then provide feedback (if needed). After that, a group leader will also take a look at the code and if all is good to go, the pull request will be approved. The branch also will require status checks to pass before merging.

### Build

The build process is automated using github actions. Builds are run in a clean and isolated environment to ensure that they are reproducible

### Unit Tests

Unit tests are automatically run as part of the build process. Tests are defined for each module to ensure module-specific functionality. Unit tests are more efficient for tasks that can have isolated logic

### Human Review

Every pull request requires at least one code review from a project team member not involved in writing the original code. Alongside code review, documentation is also planned to be reviewed to ensure clarity and completeness

### E2E Testing (Ryandeep)

End to end testing ensures proper integration and functionality of all components used to build the web app. Therefore as part of the pipeline, we plan to use tools such as Cypress to simulate the app and write tests that represent realistic user interactions. Tests may simulate clicking specific UI elements, inputting data such as projects, and validating the accuracy of calculations, storage, and display processes. This will ensure an error-free experience for the end-user.

### Documentation (Piao)

Appropriate documentation ensures that everyone involved in the project, right from developers (to understand how the system works) to the end user (a manual/guide as to how to use the program) are guided well. For developers, it will be easier to modify/change the functionality if needed. It will also increase development speed as if a change is needed, the developer does not have to try and figure out what the code does; he can simply just read the documentation and proceed. Well-documented code also significantly speeds up the onboarding process for new team members. For end users, it will improve the overall experience as after reading the guide, they can use the program up to its full potential.

## Note

This is just the first stage of our pipeline. As time passes by, we decided to add more steps to our pipeline to help improve the software development process by improving consistency, reliability, and risk mitigation. A lot of stages in our pipeline are planned. Since we have not started the development of our project, we cannot implement a lot of the pipeline features.
