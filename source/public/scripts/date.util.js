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

export { getCurrentDate, formatDateToYYYYMMDD };