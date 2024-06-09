// main.index.js

import { getCurrentDate, formatDateToMonthDayYear, getMonthYear, formatDateToYYYYMMDD, isCurrentDate, isCurrentMonth, isInFuture } from "./date.util.js";
import { entryIsEmpty, addProject, updateProjects } from "./localstorage.util.js";

const NUM_DATES = 42; // 42 open spots on the calendar

// Initialize editingIndex to -1 to indicate no project is being edited
let editingIndex = -1;

// Initialize month, year based on current date
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

document.addEventListener("DOMContentLoaded", () => {

	// Select elements from the DOM
	const monthYear = document.getElementById("month-year");
	const datesContainer = document.getElementById("dates");
	const prevMonthBtn = document.querySelector("button[title=\"Previous month\"]");
	const nextMonthBtn = document.querySelector("button[title=\"Next month\"]");
	const todayBtn = document.getElementById("home-today");
	const projectModal = document.getElementById("project-modal");
	const projectNameInput = document.getElementById("project-name");
	const projectDeadlineInput = document.getElementById("deadline");
	const projectPrioritySelect = document.getElementById("priority-level");

	// Set default entry display to today
	localStorage.setItem("entry-display", getCurrentDate());

	// Render this month's calendar
	updateDisplay();

	// Event listeners for previous, next month and today buttons
	prevMonthBtn.addEventListener("click", () => {
		changeMonth(-1);
		updateDisplay();
	});

	nextMonthBtn.addEventListener("click", () => {
		changeMonth(1);
		updateDisplay();
	});

	todayBtn.addEventListener("click", () => {
		currentMonth = today.getMonth();
		currentYear = today.getFullYear();
		updateDisplay();
	});

	// Event listener to close the modal if the cancel button is clicked
	document.getElementById("cancel-project").addEventListener("click", function () {
		document.getElementById("project-modal").classList.add("hide");
	});

	// Event listener for the add project button
	document.querySelector(".add-project").addEventListener("click", function () {
		const projectModal = document.getElementById("project-modal");
		const projectNameInput = document.getElementById("project-name");
		const projectDeadlineInput = document.getElementById("deadline");
		const projectPrioritySelect = document.getElementById("priority-level");

		// Clear existing inputs
		projectNameInput.value = "";
		projectDeadlineInput.value = "";
		projectPrioritySelect.selectedIndex = 0; // Reset to default or 'Select a priority level'

		// Display the modal for adding a new project
		projectModal.classList.remove("hide");

		// Focus on the project name input
		projectNameInput.focus();

		// Update form submission handler
		const projectForm = document.getElementById("project-form");
		projectForm.onsubmit = function (event) {
			event.preventDefault();

			const project = { "name": projectNameInput.value, "deadline": projectDeadlineInput.value, "priority": projectPrioritySelect.value };
			addProject(project);

			loadProjectsFromLocalStorage();

			// Hide the modal after adding the new project
			projectModal.classList.add("hide");
		};
	});

	// Function to load projects from local storage
	function loadProjectsFromLocalStorage() {
		const projects = JSON.parse(localStorage.getItem("projects")) || [];
		const projectList = document.getElementById("project-list");
		while (projectList.firstChild) {
			projectList.removeChild(projectList.firstChild);
		}
		projects.forEach((project, index) => {
			const projectItem = document.createElement("li");
			projectItem.className = "project-item";
			const projectDetails = document.createElement("div");
			projectDetails.className = "project-details";

			const projectName = document.createElement("label");
			projectName.className = "project-name";
			projectName.innerText = project.name;

			const projectDate = document.createElement("p");
			projectDate.className = "project-date";
			const date = project.deadline.split("-");
			projectDate.innerText = `Deadline: ${formatDateToMonthDayYear(date[0], date[1], date[2])}`;

			const projectPriorityLabel = document.createElement("label");
			projectPriorityLabel.className = "project-priority";
			projectPriorityLabel.innerText = "Priority: ";
			const projectPriority = document.createElement("p");
			projectPriority.className = project.priority.toLowerCase();
			projectPriority.innerText = project.priority;
			projectPriorityLabel.append(projectPriority);
			if (project.priority === "") {
				projectPriority.classList.add("hide");
			} else {
				projectPriority.classList.remove("hide");
			}
			projectDetails.append(projectName, projectDate, projectPriorityLabel);

			const projectBtns = document.createElement("div");
			projectBtns.className = "project-btns";

			// Create the edit button
			const editButton = document.createElement("button");
			editButton.className = "edit-project";
			editButton.innerHTML = "<i class=\"fa-solid fa-pencil\"></i>";
			editButton.setAttribute("data-index", index);
			editButton.setAttribute("title", "Edit project");


			// Create the delete button
			const deleteButton = document.createElement("button");
			deleteButton.className = "project-item-delete";
			deleteButton.innerHTML = "<i class=\"fa-solid fa-trash\"></i>";
			deleteButton.setAttribute("data-index", index);
			deleteButton.setAttribute("title", "Delete project");

			projectBtns.append(editButton, deleteButton);
			projectItem.append(projectDetails, projectBtns);
			projectList.appendChild(projectItem);

			// Event listeners for edit and delete actions
			editButton.addEventListener("click", function () {
				editingIndex = Number.parseInt(this.getAttribute("data-index")); // Set editing index to the project's index
				const project = projects[editingIndex];

				// Set the form inputs to match the existing project details
				projectNameInput.value = project.name;
				projectDeadlineInput.value = project.deadline;
				projectPrioritySelect.value = project.priority;

				// Show the project modal
				projectModal.classList.remove("hide");

				// Focus on the project name input for immediate editing
				projectNameInput.focus();

				// Update the form to handle project updating
				const projectForm = document.getElementById("project-form");
				projectForm.onsubmit = function (event) {
					event.preventDefault();

					// Save updated projects to local storage
					project.name = projectNameInput.value;
					project.deadline = projectDeadlineInput.value;
					project.priority = projectPrioritySelect.value;
					updateProjects(projects);

					loadProjectsFromLocalStorage();

					// Hide the modal after update
					projectModal.classList.add("hide");
				};
			});
			deleteButton.addEventListener("click", function () {
				editingIndex = Number.parseInt(this.getAttribute("data-index"));
				projects.splice(editingIndex, 1);
				updateProjects(projects);
				loadProjectsFromLocalStorage();
			});
		});
	}

	loadProjectsFromLocalStorage();


	/**
	 * Updates the page display for "Next Day" button and calendar
	 */
	function updateDisplay() {
		// Disable "next month" button if the currently displayed month/year is of the current date
		if (isCurrentMonth(currentYear, currentMonth)) {
			nextMonthBtn.disabled = true;
		} else {
			nextMonthBtn.disabled = false;
		}
		renderCalendar(currentMonth, currentYear, datesContainer, monthYear);
	}

});

/**
 * Creates a new HTML div element representing a calendar row.
 * @returns {HTMLDivElement} The newly created row element.
 */

function createRow() {
	const row = document.createElement("div");
	row.classList.add("row");
	return row;
}

/**
 * Creates a new HTML link-button element representing a day with a link to the journal entry page.
 * @param {number} year - The year.
 * @param {number} month - The month (0-indexed).
 * @param {number} day - The day of the month.
 * @returns {HTMLAnchorElement} The link element containing the day button.
 */
function createDay(year, month, day) {
	const link = document.createElement("a");
	const dateBtn = document.createElement("button");
	dateBtn.classList.add("date");
	dateBtn.innerText = day;
	dateBtn.title = `Entry for ${formatDateToMonthDayYear(year, month, day)}`;
	// Disable buttons for the future, otherwise link to journal
	if (isInFuture(year, month, day)) {
		dateBtn.disabled = true;
		return dateBtn;
	} else {
		link.href = "./journal.html";
	}
	// If the date is the current date, add styling for emphasis
	if (isCurrentDate(year, month, day)) {
		dateBtn.classList.add("highlight");
	}
	link.append(dateBtn);

	// Add styling if the date has a non-empty entry
	const dateString = formatDateToMonthDayYear(year, month, day);
	const entry = JSON.parse(localStorage.getItem(`entry-${formatDateToYYYYMMDD(dateString)}`));
	if (entry && !entryIsEmpty(entry)) {
		dateBtn.classList.add("has-entry");
	}

	// Update localStorage for journal entry display date when date clicked
	dateBtn.addEventListener("click", () => {
		localStorage.setItem("entry-display", dateString);
	});
	return link;
};

/**
 * Changes the current month by the specified offset and updates the current month and year.
 * @param {number} offset - The number of months to offset (positive or negative).
 */
function changeMonth(offset) {
	const newDate = new Date(currentYear, currentMonth += offset, 1);
	currentMonth = newDate.getMonth();
	currentYear = newDate.getFullYear();
}

/**
 * Renders a calendar for the specified month and year.
 * @param {number} month - The month (0-indexed).
 * @param {number} year - The year.
 * @param {HTMLElement} datesContainer - The container element to render the dates in.
 * @param {HTMLElement} monthYear - The element to display the month and year.
 */
function renderCalendar(month, year, datesContainer, monthYear) {
	monthYear.innerText = getMonthYear(month, year);

	// Clear all dates
	while (datesContainer.firstChild) {
		datesContainer.removeChild(datesContainer.firstChild);
	}

	// Get first + last days for this month, last day for previous month
	const firstDay = new Date(year, month, 1).getDay();
	const lastDate = new Date(year, month + 1, 0).getDate();

	// Calculate the number of trailing days from the previous month to display in the current month's calendar grid.
	// If the first day of the month is Sunday (index 0), set numPrevDays to 6 (to include 6 trailing days).
	// Otherwise, set numPrevDays to firstDay - 1 to include trailing days up to the previous Sunday.
	const numPrevDays = (firstDay === 0) ? 6 : firstDay - 1;

	// A new row will be created after every 7 dates filled in
	let row = createRow();
	let dateCounter = 0;

	// Fill in days from previous month
	for (let i = numPrevDays; i > 0; i--) {
		const prevDate = new Date(year, month, 0 - i + 1).getDate();
		const day = createDay(year, month - 1, prevDate);
		day.firstChild.classList.add("light"); // Styling to indicate not this month
		row.append(day);
		dateCounter++;
	}

	// Fill in days for this month
	for (let date = 1; date <= lastDate; date++) {
		const day = createDay(year, month, date);
		row.append(day);
		dateCounter++;
		if (dateCounter % 7 === 0) {
			datesContainer.append(row);
			row = createRow();
		}
	}

	// Fill in days for next month
	const nextDays = NUM_DATES - dateCounter;
	for (let date = 1; date <= nextDays; date++) {
		const day = createDay(year, month + 1, date);
		// Styling to indicate not this month
		if (isInFuture(year, month + 1, date)) {
			day.classList.add("light");
		} else {
			day.firstChild.classList.add("light");
		}
		row.append(day);
		dateCounter++;
		if (dateCounter % 7 === 0) {
			datesContainer.append(row);
			row = createRow();
		}
	}
}

export { createRow, createDay };