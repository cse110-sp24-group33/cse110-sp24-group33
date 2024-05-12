# Use SimpleMDE as markdown editor

Status: accepted
Date: 2024-05-11

## Context and Problem Statement
We need a simple and functional, user-friendly markdown editor for the free-write journaling feature for our application. Markdown is a standardized markup language that will make it easy to format text, but we don't want to use valuable development time trying to create our own text editor.


## Considered Options
- (SimpleMDE)[ https://simplemde.com/]
- (Tiny Markdown Editor)[https://github.com/jefago/tiny-markdown-editor]

## Decision Outcome

Chosen option: "SimpleMDE" because it has a simple and intuitive interface, comprehensive documentation, and configuration options that will provide us with a quality markdown editor experience.

### Positive Consequences
- Improved user experience with a high quality markdown editor
- More development time dedicated to other core application functionalities

### Negative Consequences
- An additional dependency for the project
- May be more difficult to customize styling

## Links
- (SimpleMDE GitHub)[https://github.com/sparksuite/simplemde-markdown-editor]