//main.journal.test.js

import { getCurrentDate, formatDateToYYYYMMDD } from "./date.util.js";
import "./main.journal.js";

beforeEach(() => {
  document.body.innerHTML = `
    <div id="journal">
      <div id="date"><h2></h2></div>
      <textarea id="entry-text"></textarea>
      <div id="autosave" class="hide">Autosaved</div>
      <button id="clear-entry">Clear Entry</button>
      <button id="prev-day">Previous Day</button>
      <button id="next-day">Next Day</button>
      <button id="entry-today">Today</button>
      <div id="task-container"></div>
      <button class="new-task">New Task</button>
      <div id="task-modal" class="hide">
        <form id="task-form">
          <input id="task-desc" type="text" />
          <input id="task-type" type="text" />
          <input id="task-project" type="text" />
          <button type="submit">Save</button>
          <button type="button" id="cancel-task">Cancel</button>
          <button type="button" id="delete-task">Delete</button>
        </form>
      </div>
      <div id="sentiment-container">
        <input type="radio" name="feeling" value="happy">Happy</input>
        <input type="radio" name="feeling" value="neutral">Neutral</input>
        <input type="radio" name="feeling" value="sad">Sad</input>
      </div>
    </div>
  `;
  localStorage.clear();
});

describe("Journal functionality", () => {
  test("Initializes with the current date", () => {
    const dateDisplay = document.querySelector("#date h2");
    const today = getCurrentDate();
    expect(dateDisplay.textContent).toBe(today);
  });

  test("Today button sets the date to current date", () => {
    const todayBtn = document.getElementById("entry-today");
    const dateDisplay = document.querySelector("#date h2");

    todayBtn.click();
    const today = getCurrentDate();
    expect(dateDisplay.textContent).toBe(today);
  });

  test("Clears entry data on clear button click", () => {
    const clearBtn = document.getElementById("clear-entry");
    const entryDate = formatDateToYYYYMMDD(getCurrentDate());
    const entryData = { date: entryDate, text_entry: "Some text", tasks: [], sentiment: "" };

    localStorage.setItem(`entry-${entryDate}`, JSON.stringify(entryData));
    clearBtn.click();

    const clearedEntry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));
    expect(clearedEntry.text_entry).toBe("");
  });

  test("Creates a new task", () => {
    const newTaskBtn = document.querySelector(".new-task");
    const taskModal = document.getElementById("task-modal");

    newTaskBtn.click();
    expect(taskModal.classList.contains("hide")).toBe(false);

    const taskForm = document.getElementById("task-form");
    document.getElementById("task-desc").value = "Test Task";
    document.getElementById("task-type").value = "Type1";
    document.getElementById("task-project").value = "Project1";

    taskForm.dispatchEvent(new Event("submit"));

    const entryDate = formatDateToYYYYMMDD(getCurrentDate());
    const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));
    expect(entry.tasks.length).toBe(1);
    expect(entry.tasks[0].name).toBe("Test Task");
  });

  test("Displays tasks correctly", () => {
    const taskContainer = document.getElementById("task-container");
    const entryDate = formatDateToYYYYMMDD(getCurrentDate());
    const entry = {
      date: entryDate,
      text_entry: "",
      tasks: [{ name: "Test Task", type_tag: "Type1", project_tag: "Project1", completed: false }],
      sentiment: ""
    };

    localStorage.setItem(`entry-${entryDate}`, JSON.stringify(entry));
    const displayTasks = jest.spyOn(document, "getElementById");

    displayTasks(taskContainer, null);
    expect(taskContainer.innerHTML).toContain("Test Task");
  });

  test("Updates sentiment correctly", () => {
    const sentimentRadios = document.querySelectorAll("input[name='feeling']");
    const happyRadio = sentimentRadios[0];
    const entryDate = formatDateToYYYYMMDD(getCurrentDate());

    happyRadio.click();
    const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));
    expect(entry.sentiment).toBe("happy");
  });

  test("Updates text entry and shows autosave", () => {
    const entryText = document.getElementById("entry-text");
    const autosave = document.getElementById("autosave");

    entryText.value = "New journal entry";
    entryText.dispatchEvent(new Event("change"));

    const entryDate = formatDateToYYYYMMDD(getCurrentDate());
    const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));

    expect(entry.text_entry).toBe("New journal entry");
    expect(autosave.classList.contains("hide")).toBe(false);
  });

  test("Deletes a task", () => {
    const entryDate = formatDateToYYYYMMDD(getCurrentDate());
    const entry = {
      date: entryDate,
      text_entry: "",
      tasks: [{ name: "Task to Delete", type_tag: "Type1", project_tag: "Project1", completed: false }],
      sentiment: ""
    };

    localStorage.setItem(`entry-${entryDate}`, JSON.stringify(entry));

    const deleteTaskBtn = document.getElementById("delete-task");
    deleteTaskBtn.click();

    const updatedEntry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));
    expect(updatedEntry.tasks.length).toBe(0);
  });
});
