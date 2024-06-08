// date.util.test.js

import { 
	getCurrentDate, 
	formatDateToYYYYMMDD, 
	formatDateToMonthDayYear,
	getMonthYear,
	isCurrentDate,
	isCurrentMonth,
	isInFuture
} from "../../public/scripts/date.util.js";

describe("Date Utility Functions", () => {
	// test for getCurrentDate();
	test("getCurrentDate should return the current date in \"Month Day, Year\" format", () => {
		const date = new Date();
		const expectedDate = date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});

		expect(getCurrentDate()).toBe(expectedDate);
	});

	// test for getMonthYear();
	test("getMonthYear should return a given date in \"Month Year\" format", () => {
		const date = new Date(2024, 3, 1);
		const expectedDate = "April 2024"

		expect(getMonthYear(3, 2024)).toBe(expectedDate);

	});


	// test for formatDateToYYYYMMDD();
	test("formatDateToYYYYMMDD should format date string to YYYYMMDD", () => {
		const dateString = "May 23, 2024";
		const expectedFormat = "20240523";

		expect(formatDateToYYYYMMDD(dateString)).toBe(expectedFormat);
	});

	// test for formatDateToMonthDayYear(year, month, day);
	test("formatDateToMonthDayYear should return a given date in \"Month Day, Year\" format", () => {
		const date = new Date(2024, 3, 5);
		const expectedDate = "April 5, 2024"

		expect(formatDateToMonthDayYear(2024, 3, 5)).toBe(expectedDate);

	});

	// test for isCurrentDate(year, month, day)
	test("isCurrentDate should return false for June 1, 2023", () => {
		expect(isCurrentDate(2023, 5, 1)).toBe(false);

	});

	test("isCurrentDate should return false for June 1, 2024", () => {
		expect(isCurrentDate(2024, 5, 1)).toBe(false);

	});

	test("isCurrentDate should return true for the current date", () => {

		const today = new Date();
		const thisMonth = today.getMonth();
		const thisDay = today.getDate();
		const thisYear = today.getFullYear();

		expect(isCurrentDate(thisYear, thisMonth, thisDay)).toBe(true);
	});

	// test for isCurrentMonth(year, month)
	test("isCurrentMonth should return false for current month but not current year", () => {

		const today = new Date();
		const thisMonth = today.getMonth();
		expect(isCurrentMonth(2023, thisMonth)).toBe(false);
	});

	test("isCurrentMonth should return false for current year but not current month", () => {

		const today = new Date();
		const thisYear = today.getFullYear();
		expect(isCurrentMonth(thisYear, 3)).toBe(false);
	});

	test("isCurrentMonth should return true for current year and current month", () => {

		const today = new Date();
		const thisYear = today.getFullYear();
		const thisMonth = today.getMonth();
		expect(isCurrentMonth(thisYear, thisMonth)).toBe(true);
	});

	// test for isInFuture(year, month, day)
	test("isInFuture should return false for current day and month but a past year ", () => {

		const today = new Date();;
		const thisMonth = today.getMonth();
		const thisDay = today.getDate();
		expect(isInFuture(2023, thisMonth, thisDay)).toBe(false);
	});

	test("isInFuture should return false for current date ", () => {

		const today = new Date();;
		const thisMonth = today.getMonth();
		const thisDay = today.getDate();
		const thisYear = today.getFullYear();
		expect(isInFuture(thisYear, thisMonth, thisDay)).toBe(false);
	});

	test("isInFuture should return true for a future date", () => {

		expect(isInFuture(2030, 8, 5)).toBe(true);
	});
	
});
