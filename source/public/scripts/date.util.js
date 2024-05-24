// date.util.js

// Function to get the current date in "Month Day, Year" format
function getCurrentDate() {
	const today = new Date();
	return today.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}

// Function to format a date string to YYYYMMDD
function formatDateToYYYYMMDD(dateString) {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}${month}${day}`;
}

export { getCurrentDate, formatDateToYYYYMMDD };