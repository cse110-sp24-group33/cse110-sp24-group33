// main.index.js

import { getCurrentDate, formatDateToMonthDayYear, getMonthYear, formatDateToYYYYMMDD, isCurrentDate, isCurrentMonth, isInFuture } from "./date.util.js";
import { entryIsEmpty } from "./localstorage.util.js";

const NUM_DATES = 42; // 42 open spots on the calendar

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