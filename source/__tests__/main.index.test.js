import { createRow, createDay, changeMonth, renderCalendar } from "../public/scripts/main.index.js";

describe("Calendar Functions", () => {
  let currentMonth;
  let currentYear;
  let datesContainer;
  let monthYear;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="calendar">
        <div id="month-year"></div>
        <div id="dates"></div>
      </div>
    `;
    datesContainer = document.getElementById("dates");
    monthYear = document.getElementById("month-year");
    const today = new Date();
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
  });

  test("createRow creates a new row element", () => {
    const row = createRow();
    expect(row.tagName).toBe("DIV");
    expect(row.classList.contains("row")).toBe(true);
  });

  test("createDay creates a day button element", () => {
    const year = 2023;
    const month = 5;
    const day = 15;
    const dayElement = createDay(year, month, day);

    expect(dayElement.tagName).toBe("A");
    expect(dayElement.firstChild.tagName).toBe("BUTTON");
    expect(dayElement.firstChild.innerText).toBe(day.toString());

    // Check if the date is in the future
    if (new Date(year, month, day) > new Date()) {
      expect(dayElement.firstChild.disabled).toBe(true);
    } else {
      expect(dayElement.href).toContain("journal.html");
    }

    // Check if the date is the current date
    const today = new Date();
    if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
      expect(dayElement.firstChild.classList.contains("highlight")).toBe(true);
    }
  });

  test("changeMonth updates the current month and year", () => {
    const initialMonth = currentMonth;
    const initialYear = currentYear;

    changeMonth(1);
    expect(currentMonth).toBe((initialMonth + 1) % 12);
    expect(currentYear).toBe(initialYear + (initialMonth === 11 ? 1 : 0));

    changeMonth(-2);
    expect(currentMonth).toBe((initialMonth + 11) % 12);
    expect(currentYear).toBe(initialYear - (initialMonth === 0 ? 1 : 0));
  });

  test("renderCalendar correctly renders the calendar", () => {
    renderCalendar(currentMonth, currentYear, datesContainer, monthYear);
    const expectedMonthYear = new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' });
    expect(monthYear.innerText).toBe(expectedMonthYear);

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const numPrevDays = (firstDay === 0) ? 6 : firstDay - 1;
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    let dateCounter = 0;

    // Previous month days
    for (let i = numPrevDays; i > 0; i--) {
      const prevDate = new Date(currentYear, currentMonth, 0 - i + 1).getDate();
      expect(datesContainer.children[dateCounter].firstChild.innerText).toBe(prevDate.toString());
      dateCounter++;
    }

    // Current month days
    for (let date = 1; date <= lastDate; date++) {
      expect(datesContainer.children[dateCounter].firstChild.innerText).toBe(date.toString());
      dateCounter++;
    }

    // Next month days
    const nextDays = 42 - dateCounter;
    for (let date = 1; date <= nextDays; date++) {
      expect(datesContainer.children[dateCounter].firstChild.innerText).toBe(date.toString());
      dateCounter++;
    }
  });
});

