// date.util.js

/**
 * Gets the current date in the format "Month Day, Year".
 *
 * @returns {string} The current date formatted as "Month Day, Year".
 */
function getCurrentDate() {
	const today = new Date();
	return today.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}

/**
 * Formats a given date to a string representation in the format Month Day, Year.
 * @param {number} year - The year.
 * @param {number} month - The month (0-indexed).
 * @param {number} day - The day of the month.
 * @returns {string} The formatted date string.
 */
function formatDateToMonthDayYear(year, month, day) {
	const date = new Date(year, month, day);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}

/**
 * Formats a given month and year to a string representation in the format Month Year.
 * @param {number} month - The month (0-indexed).
 * @param {number} year - The year.
 * @returns {string} The formatted month and year string.
 */
function getMonthYear(month, year) {
	const date = new Date(year, month, 1);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long"
	});
}


/**
 * Formats a date string to "YYYYMMDD".
 *
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string in "YYYYMMDD" format.
 */
function formatDateToYYYYMMDD(dateString) {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}${month}${day}`;
}

/**
 * Checks if the specified date is the current date.
 * @param {number} year - The year to check.
 * @param {number} month - The month to check (0-indexed).
 * @param {number} day - The day of the month to check.
 * @returns {boolean} True if the specified date is the current date; otherwise, false.
 */
function isCurrentDate(year, month, day) {
	const today = new Date();
	return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
}

/**
 * Checks if the specified year and month are the current year and month.
 * @param {number} year - The year to check.
 * @param {number} month - The month to check (0-indexed).
 * @returns {boolean} True if the specified year and month are the current year and month; otherwise, false.
 */
function isCurrentMonth(year, month) {
	const today = new Date();
	return year === today.getFullYear() && month === today.getMonth();
}

/**
 * Checks if a given date is in the future compared to the current date.
 * @param {number} year - The year.
 * @param {number} month - The month (0-indexed).
 * @param {number} day - The day of the month.
 * @returns {boolean} True if the date is in the future; otherwise, false.
 */
function isInFuture(year, month, day) {
	const date = new Date(year, month, day);
	const today = new Date();
	return date > today;
}

export { getCurrentDate, formatDateToMonthDayYear, getMonthYear, formatDateToYYYYMMDD, isCurrentDate, isCurrentMonth, isInFuture };