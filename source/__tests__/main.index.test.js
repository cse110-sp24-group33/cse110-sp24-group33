//main.index.test.js

import { getCurrentDate, formatDateToMonthDayYear, getMonthYear, formatDateToYYYYMMDD, isCurrentDate, isCurrentMonth, isInFuture } from "./date.util.js";
import "./main.index.js";

beforeEach(() => {
  document.body.innerHTML = `
    <div class="calendar">
      <header>
        <button title="Previous month">Previous</button>
        <div id="month-year"></div>
        <button title="Next month">Next</button>
      </header>
      <div id="dates" class="dates"></div>
      <button id="home-today">Today</button>
    </div>
  `;
  localStorage.clear();
});

describe("Calendar functionality", () => {
  test("Initializes with the current date", () => {
    const monthYear = document.getElementById("month-year");
    const today = new Date();
    const expectedMonthYear = getMonthYear(today.getMonth(), today.getFullYear());

    expect(monthYear.innerText).toBe(expectedMonthYear);
  });

  test("Next month button should be disabled for the current month", () => {
    const nextMonthBtn = document.querySelector("button[title='Next month']");
    const today = new Date();

    if (isCurrentMonth(today.getFullYear(), today.getMonth())) {
      expect(nextMonthBtn.disabled).toBe(true);
    } else {
      expect(nextMonthBtn.disabled).toBe(false);
    }
  });

  test("Previous month button click changes the month", () => {
    const prevMonthBtn = document.querySelector("button[title='Previous month']");
    const monthYear = document.getElementById("month-year");
    const initialMonthYear = monthYear.innerText;

    prevMonthBtn.click();
    const newMonthYear = monthYear.innerText;

    expect(newMonthYear).not.toBe(initialMonthYear);
  });

  test("Today button resets to the current month and year", () => {
    const todayBtn = document.getElementById("home-today");
    const monthYear = document.getElementById("month-year");
    const today = new Date();

    todayBtn.click();
    const expectedMonthYear = getMonthYear(today.getMonth(), today.getFullYear());

    expect(monthYear.innerText).toBe(expectedMonthYear);
  });

  test("Clicking on a day button stores the correct date in localStorage", () => {
    const dayButton = document.createElement("button");
    dayButton.classList.add("date");
    dayButton.innerText = "15";
    document.body.append(dayButton);

    const link = document.createElement("a");
    link.append(dayButton);
    document.body.append(link);

    const today = new Date();
    const dateString = formatDateToMonthDayYear(today.getFullYear(), today.getMonth(), 15);

    dayButton.click();
    expect(localStorage.getItem("entry-display")).toBe(dateString);
  });

  test("Dates from the previous month are displayed correctly", () => {
    const datesContainer = document.getElementById("dates");
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const numPrevDays = (firstDay === 0) ? 6 : firstDay - 1;

    expect(datesContainer.children.length).toBeGreaterThan(0);
    for (let i = 0; i < numPrevDays; i++) {
      expect(datesContainer.children[i].firstChild.classList).toContain("light");
    }
  });

  test("Dates from the next month are displayed correctly", () => {
    const datesContainer = document.getElementById("dates");
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const numPrevDays = (firstDay === 0) ? 6 : firstDay - 1;
    const totalDates = numPrevDays + lastDate;
    const nextDays = 42 - totalDates;

    expect(datesContainer.children.length).toBeGreaterThan(0);
    for (let i = totalDates; i < totalDates + nextDays; i++) {
      expect(datesContainer.children[i].classList).toContain("light");
    }
  });
});
