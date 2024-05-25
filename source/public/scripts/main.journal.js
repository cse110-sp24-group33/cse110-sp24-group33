// main.journal.js

import { getCurrentDate, formatDateToYYYYMMDD } from "./date.util.js";

document.addEventListener("DOMContentLoaded", () => {

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
	const clearBtn = document.getElementById("clear-entry");
	const taskModal = document.getElementById("task-modal");
	const newTaskBtn = document.querySelector(".new-task");
	const taskForm = document.getElementById("task-form");
	const cancelTaskBtn = document.querySelector(".cancel-task");
	const deleteTaskBtn = document.querySelector(".delete-task");
	const taskContainer = document.getElementById("task-container");
	const prevDayBtn = document.querySelector("#date button:first-child");
	const nextDayBtn = document.querySelector("#date button:last-child");
	const dateDisplay = document.querySelector("#date h2");

	// The date of the currently displayed entry in YYYYMMDD format
	let entryDate = null;

	// Event listeners for the previous and next day buttons
	prevDayBtn.addEventListener("click", () => {
		changeDate(-1);
	});

	nextDayBtn.addEventListener("click", () => {
		changeDate(1);
	});

	// Detect changes to text editor and update localStorage
	entryTxt.codemirror.on("change", () => {
		const text = entryTxt.value();
		const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`)) || { date: entryDate, text_entry: "", tasks: [], sentiment: "" };
		entry.text_entry = text;
		localStorage.setItem(`entry-${entryDate}`, JSON.stringify(entry));
	});

	// Clear entry data on button click and confirmation
	clearBtn.addEventListener("click", () => {
		const clear = confirm("Are you sure you want to clear this entry? This action will delete all data for this date.");
		if (clear) {
			const entry = { date: entryDate, text_entry: "", tasks: [], sentiment: "" };
			localStorage.setItem(`entry-${entryDate}`, JSON.stringify(entry));
			updateDisplay();
		}
	});

	// Initialize editingIndex to -1 to indicate no task is being edited
	let editingIndex = -1;

	// Show the modal when the "New Task" button is clicked
	newTaskBtn.addEventListener("click", () => {
		editingIndex = -1; // Reset editing index when adding a new task
		taskModal.style.display = "block"; // Show the modal
		clearModalFields(); // Clear any existing data in the modal fields
	});

	// Hide the modal if the user clicks outside of it
	window.addEventListener("click", (event) => {
		if (event.target === taskModal) {
			taskModal.style.display = "none";
		}
	});

	// Save the task when the "Save" button is clicked
	taskForm.addEventListener("submit", (event) => {
		event.preventDefault();
		// Get task details from modal input fields
		const taskDesc = document.getElementById("task-desc").value;
		const taskType = document.getElementById("task-type").value;
		const taskProject = document.getElementById("task-project").value;

		// Retrieve existing tasks for the current date from local storage or initialize as empty array
		const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`)) || { date: entryDate, text_entry: "", tasks: [], sentiment: "" };
		const tasks = entry.tasks || [];

		if (editingIndex >= 0) {
			// If editing an existing task, update its details
			tasks[editingIndex] = {
				name: taskDesc,
				type_tag: taskType,
				project_tag: taskProject,
				completed: tasks[editingIndex].completed // Preserve the completed status
			};
		} else {
			// If adding a new task, create a new task object and add to the tasks array
			const task = {
				name: taskDesc,
				type_tag: taskType,
				project_tag: taskProject,
				completed: false // New tasks are not completed by default
			};
			tasks.push(task);
		}

		// Update the tasks array in the entry
		entry.tasks = tasks;

		// Save the updated entry to local storage
		localStorage.setItem(`entry-${entryDate}`, JSON.stringify(entry));

		// Refresh the displayed tasks and hide the modal
		displayTasks();
		taskModal.style.display = "none";
	});

	// Hide the modal when the "Cancel" button is clicked
	cancelTaskBtn.addEventListener("click", () => {
		taskModal.style.display = "none";
	});

	// Delete the current task when the "Delete" button in the modal is clicked
	deleteTaskBtn.addEventListener("click", () => {
		const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`)) || { date: entryDate, text_entry: "", tasks: [], sentiment: "" };
		const tasks = entry.tasks || [];
		if (editingIndex >= 0) {
			// Remove the task at the editingIndex from the tasks array
			tasks.splice(editingIndex, 1);
			// Update the tasks array in the entry
			entry.tasks = tasks;
			// Save the updated entry to local storage
			localStorage.setItem(`entry-${entryDate}`, JSON.stringify(entry));
			// Refresh the displayed tasks and hide the modal
			displayTasks();
			taskModal.style.display = "none";
		}
	});

	// Function to change the date and update tasks
	function changeDate(offset) {
		const currentDate = new Date(dateDisplay.textContent);
		const newDate = new Date(currentDate.setDate(currentDate.getDate() + offset));
		const newDateString = newDate.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
		dateDisplay.textContent = newDateString;
		entryDate = formatDateToYYYYMMDD(newDateString);
		updateNextDayBtn();
		updateDisplay();
	}

	// Function to disable the "Next Day" button if the displayed date is the current day
	function updateNextDayBtn() {
		if (dateDisplay.textContent === getCurrentDate()) {
			nextDayBtn.disabled = true;
		} else {
			nextDayBtn.disabled = false;
		}
	}

	// Function to display tasks from local storage
	function displayTasks() {
		const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`)) || { date: entryDate, text_entry: "", tasks: [], sentiment: "" };
		const tasks = entry.tasks || [];
		taskContainer.innerHTML = ""; // Clear the current task display

		tasks.forEach((task, index) => {
			// Create a new task item element
			const taskElement = document.createElement("div");
			taskElement.className = "task-item";

			// Create the checkbox element
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.id = `task-${index}`;
			checkbox.checked = task.completed;

			// Create the task name label
			const nameLabel = document.createElement("label");
			nameLabel.id = `taskDesc-${index}`;
			nameLabel.textContent = `Task Description: ${task.name}`;

			// Create the task type tag label
			const typeTagLabel = document.createElement("label");
			typeTagLabel.id = `taskTypeTag-${index}`;
			typeTagLabel.textContent = `Type: ${task.type_tag}`;

			// Create the task project tag label
			const projTagLabel = document.createElement("label");
			projTagLabel.id = `taskProjTag-${index}`;
			projTagLabel.textContent = `Project: ${task.project_tag}`;

			// Create the edit button
			const editButton = document.createElement("button");
			editButton.className = "edit-task";
			editButton.textContent = "Edit";
			editButton.setAttribute("data-index", index);

			// Append the elements to the task item
			taskElement.appendChild(checkbox);
			taskElement.appendChild(nameLabel);
			taskElement.appendChild(typeTagLabel);
			taskElement.appendChild(projTagLabel);
			taskElement.appendChild(editButton);

			// Append the task item to the task container
			taskContainer.appendChild(taskElement);

			// Add event listener to the checkbox to update the task's completed status
			checkbox.addEventListener("change", function () {
				tasks[index].completed = this.checked; // Update completed status
				entry.tasks = tasks; // Update the tasks array in the entry
				localStorage.setItem(`entry-${entryDate}`, JSON.stringify(entry)); // Save updated entry to local storage
			});

			// Add event listener to the edit button to edit the task
			editButton.addEventListener("click", function () {
				editingIndex = Number.parseInt(this.getAttribute("data-index")); // Set editing index to the task's index
				const task = tasks[editingIndex]; // Retrieve task details
				document.getElementById("task-desc").value = task.name;
				document.getElementById("task-type").value = task.type_tag;
				document.getElementById("task-project").value = task.project_tag;
				taskModal.style.display = "block"; // Show the modal for editing
			});
		});
	}

	// Function to clear the input fields in the modal
	function clearModalFields() {
		document.getElementById("task-desc").value = "";
		document.getElementById("task-type").value = "";
		document.getElementById("task-project").value = "";
	}

	// Function to display the text for the editor from localStorage
	function displayEntryText() {
		const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`)) || { date: entryDate, text_entry: "", tasks: [], sentiment: "" };
		entryTxt.value(entry.text_entry);
	}

	// Updates page display for next day button, text entries, tasks, projects
	function updateDisplay() {
		updateNextDayBtn();
		displayEntryText();
		displayTasks();
	}

	// Default display to the current date
	dateDisplay.textContent = getCurrentDate();
	entryDate = formatDateToYYYYMMDD(getCurrentDate());

	// Initial display when the page loads
	updateDisplay();
});