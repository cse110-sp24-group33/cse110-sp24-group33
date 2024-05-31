// main.journal.js

import { getCurrentDate, formatDateToYYYYMMDD } from "./date.util.js";

// The date of the currently displayed entry in YYYYMMDD format
let entryDate = null;
// Initialize editingIndex to -1 to indicate no task is being edited
let editingIndex = -1;

document.addEventListener("DOMContentLoaded", initEntry());

/**
 * Initializes the page for the day's journal entry.
 */
function initEntry() {
	// Initialize markdown editor
	const entryTxt = new SimpleMDE(
		{
			element: document.getElementById("entry-text"),
			placeholder: "Write a bit about your day here.",
			showIcons: ["code"],
			spellChecker: false,
			status: ["lines", "words"]
		}
	);

	// Select elements from the DOM
	const autosave = document.getElementById("autosave");
	const clearBtn = document.getElementById("clear-entry");
	const taskModal = document.getElementById("task-modal");
	const newTaskBtn = document.querySelector(".new-task");
	const taskForm = document.getElementById("task-form");
	const cancelTaskBtn = document.getElementById("cancel-task");
	const deleteTaskBtn = document.getElementById("delete-task");
	const taskContainer = document.getElementById("task-container");
	const prevDayBtn = document.getElementById("prev-day");
	const nextDayBtn = document.getElementById("next-day");
	const dateDisplay = document.querySelector("#date h2");
	const todayBtn = document.getElementById("entry-today");

	// Event listeners for the previous and next day buttons
	prevDayBtn.addEventListener("click", () => {
		changeDate(-1, dateDisplay, nextDayBtn);
		updateDisplay();
	});
	nextDayBtn.addEventListener("click", () => {
		changeDate(1, dateDisplay, nextDayBtn);
		updateDisplay();
	});

	todayBtn.addEventListener("click", () => {
		localStorage.setItem("entry-display", getCurrentDate());
		displayDate();
	});

	// Detect changes to text editor and update entry
	entryTxt.codemirror.on("change", () => {
		const text = entryTxt.value();
		const entry = getEntry();
		entry.text_entry = text;
		updateEntry(entry);
		// Indicate autosaved if there is text
		if (text) {
			autosave.classList.remove("hide");
		} else {
			autosave.classList.add("hide");
		}
	});

	// Clear entry data on button click and confirmation
	clearBtn.addEventListener("click", () => {
		const clear = confirm("Are you sure you want to clear this entry? This action will delete all data for this date.");
		if (clear) {
			clearEntryData();
			updateDisplay();
		}
	});

	// Reset editing index and show the modal when "New Task" button is clicked
	newTaskBtn.addEventListener("click", () => {
		editingIndex = -1;
		taskModal.classList.remove("hide");

		// Clear modal fields
		document.getElementById("task-desc").value = "";
		document.getElementById("task-type").value = "";
		document.getElementById("task-project").value = "";
	});

	// Hide the modal if the user clicks outside of it
	window.addEventListener("click", (event) => {
		if (event.target === taskModal) {
			taskModal.classList.add("hide");
		}
	});

	// Save the task when the "Save" button is clicked
	taskForm.addEventListener("submit", (event) => {
		event.preventDefault();
		// Get task details from modal input fields
		const taskDesc = document.getElementById("task-desc").value;
		const taskType = document.getElementById("task-type").value;
		const taskProject = document.getElementById("task-project").value;

		const entry = getEntry();
		const tasks = entry.tasks || [];

		// Update details of existing task
		if (editingIndex >= 0) {
			tasks[editingIndex] = {
				name: taskDesc,
				type_tag: taskType,
				project_tag: taskProject,
				completed: tasks[editingIndex].completed
			};
		}
		// Add a new task by creating a new task object and adding it to the tasks array
		else {
			const task = {
				name: taskDesc,
				type_tag: taskType,
				project_tag: taskProject,
				completed: false
			};
			tasks.push(task);
		}

		updateTasks(entry, tasks);
		displayTasks(taskContainer, taskModal);
		taskModal.classList.add("hide");
	});

	// Hide the modal when the "Cancel" button is clicked
	cancelTaskBtn.addEventListener("click", () => {
		taskModal.classList.add("hide");
	});

	// Delete the current task when the "Delete" button in the modal is clicked
	deleteTaskBtn.addEventListener("click", () => {
		const entry = getEntry();
		const tasks = entry.tasks || [];
		if (editingIndex >= 0) {
			tasks.splice(editingIndex, 1);
			updateTasks(entry, tasks);
			displayTasks(taskContainer, taskModal);
			taskModal.classList.add("hide");
		}
	});

	displayDate();

	/**
	 * Updates the page to display the entry for the display date in localStorage
	 */
	function displayDate() {
		const date = localStorage.getItem("entry-display");
		dateDisplay.textContent = date;
		entryDate = formatDateToYYYYMMDD(date);
		updateDisplay();
	}

	/**
	 * Updates the page display for "Next Day" button, text entry, tasks, projects
	 */
	function updateDisplay() {
		// Disable "next day" button if the entry date is the current date
		if (dateDisplay.textContent === getCurrentDate()) {
			nextDayBtn.disabled = true;
		} else {
			nextDayBtn.disabled = false;
		}
		entryTxt.value(getEntry().text_entry);
		displayTasks(taskContainer, taskModal);
	}
}

/**
 * Changes the displayed date by a given offset.
 * 
 * @param {number} offset - The number of days to shift the current date by. Positive values move the date forward, negative values move it backward.
 * @param {HTMLElement} dateDisplay - The HTML element displaying the current date.
 */
function changeDate(offset, dateDisplay) {
	const currentDate = new Date(dateDisplay.textContent);
	const newDate = new Date(currentDate.setDate(currentDate.getDate() + offset));
	const newDateString = newDate.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	dateDisplay.textContent = newDateString;
	entryDate = formatDateToYYYYMMDD(newDateString);
}

/**
 * Displays the tasks for the current entry date
 * and populates the task container with task items.
 * 
 * @param {HTMLElement} taskContainer - The HTML element representing the container for displaying tasks.
 * @param {HTMLElement} taskModal - The HTML element representing the modal for editing tasks.
 */
function displayTasks(taskContainer, taskModal) {
	const entry = getEntry();
	const tasks = entry.tasks || [];
	taskContainer.innerHTML = ""; // Clear the current task display

	tasks.forEach((task, index) => {
		// Create a new task item element
		const taskElement = document.createElement("div");
		taskElement.className = "task-item";

		// Create a new task details element
		const taskDetails = document.createElement("div");
		taskDetails.className = "task-details";

		// Create the checkbox element
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = `task-${index}`;
		checkbox.checked = task.completed;

		// Create a new task text container element
		const taskText = document.createElement("div");
		taskText.className = "task-text";

		// Create a new task tags container element
		const tagsContainer = document.createElement("div");
		tagsContainer.className = "task-tags";

		// Create the task name label
		const nameLabel = document.createElement("label");
		nameLabel.id = `taskDesc-${index}`;
		nameLabel.textContent = `${task.name}`;
		nameLabel.className = "task-description";


		// Create the task type tag label
		const typeTagLabel = document.createElement("label");
		typeTagLabel.id = `taskTypeTag-${index}`;
		typeTagLabel.textContent = `${task.type_tag}`;
		typeTagLabel.className = "type-label";


		// Create the task project tag label
		const projTagLabel = document.createElement("label");
		projTagLabel.id = `taskProjTag-${index}`;
		projTagLabel.textContent = ` ${task.project_tag}`;
		projTagLabel.className = "project-label";

		// Create a new task buttons container element
		const btnContainer = document.createElement("div");
		btnContainer.className = "task-btns";

		// Create the edit button
		const editButton = document.createElement("button");
		editButton.className = "edit-task";
		editButton.innerHTML = "<i class=\"fa-solid fa-pencil\"></i>";
		editButton.setAttribute("data-index", index);
		editButton.setAttribute("title", "Edit task");

		// Create the delete button
		const deleteButton = document.createElement("button");
		deleteButton.id = "task-item-delete";
		deleteButton.innerHTML = "<i class=\"fa-solid fa-trash\"></i>";
		deleteButton.setAttribute("data-index", index);
		deleteButton.setAttribute("title", "Delete task");

		// Append the elements to the task item
		tagsContainer.append(typeTagLabel, projTagLabel);
		taskText.append(nameLabel, tagsContainer);
		taskDetails.append(checkbox, taskText);
		btnContainer.append(editButton, deleteButton);
		taskElement.append(taskDetails, btnContainer);

		// Append the task item to the task container
		taskContainer.appendChild(taskElement);

		// Add event listener to the checkbox to update the task's completed status
		checkbox.addEventListener("change", function () {
			// Update styling
			const item = this.closest(".task-item");
			const description = this.closest(".task-details").querySelector(".task-description");
			if (this.checked) {
				const jsConfetti = new JSConfetti();
				jsConfetti.addConfetti();
				item.classList.add("item-checked");
				description.classList.add("text-checked");
			} else {
				item.classList.remove("item-checked");
				description.classList.remove("text-checked");
			}
			// Update entry
			tasks[index].completed = this.checked;
			entry.tasks = tasks;
			updateEntry(entry);
		});

		// Add event listener to the edit button to edit the task
		editButton.addEventListener("click", function () {
			editingIndex = Number.parseInt(this.getAttribute("data-index")); // Set editing index to the task's index
			const task = tasks[editingIndex]; // Retrieve task details
			document.getElementById("task-desc").value = task.name;
			document.getElementById("task-type").value = task.type_tag;
			document.getElementById("task-project").value = task.project_tag;
			taskModal.classList.remove("hide");
		});

		deleteButton.addEventListener("click", function () {
			editingIndex = Number.parseInt(this.getAttribute("data-index"));
			tasks.splice(editingIndex, 1);
			updateTasks(entry, tasks);
			displayTasks(taskContainer, taskModal);
		});

		if (checkbox.checked) {
			taskElement.classList.add("item-checked");
			nameLabel.classList.add("text-checked");
		} else {
			taskElement.classList.remove("item-checked");
			nameLabel.classList.remove("text-checked");
		}
		if (task.type_tag === "") {
			typeTagLabel.classList.add("hide");
		} else {
			typeTagLabel.classList.remove("hide");
		}
		if (task.project_tag === "") {
			projTagLabel.classList.add("hide");
		} else {
			projTagLabel.classList.remove("hide");
		}
	});
}

/**
 * Updates the tasks of the entry, saves the updated entry to local storage.
 *
 * @param {Object} entry - The entry object to update.
 * @param {Array} tasks - The array of tasks to assign to the entry.
 */
function updateTasks(entry, tasks) {
	entry.tasks = tasks;
	updateEntry(entry);
}

/**
 * Retrieves existing entry data for the current date from local storage,
 * or initializes a new entry object with default values if no data is found.
 *
 * @returns {Object} The entry object containing date, text entry, tasks, and sentiment.
 */
function getEntry() {
	return JSON.parse(localStorage.getItem(`entry-${entryDate}`)) || { date: entryDate, text_entry: "", tasks: [], sentiment: "" };
}

/**
 * Updates the entry data for the current entry date in local storage.
 *
 * @param {Object} entry - The entry object to update.
 */
function updateEntry(entry) {
	localStorage.setItem(`entry-${entryDate}`, JSON.stringify(entry));
}

/**
* Clears the entry data for the current entry date in local storage.
*/
function clearEntryData() {
	const entry = { date: entryDate, text_entry: "", tasks: [], sentiment: "" };
	localStorage.setItem(`entry-${entryDate}`, JSON.stringify(entry));
}
