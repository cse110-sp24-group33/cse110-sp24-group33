import { createRow, createDay, entryIsEmpty } from '../../public/scripts/main.index.js';

/**
 * @jest-environment jsdom
 */
describe("Calendar Functions", () => {

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
    expect(dayElement.firstChild.innerText).toBe(day);

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

    test("entryIsEmpty correctly identifies empty entry", () => {
      	const entry = { date: '05302024', text_entry: "", tasks: [], sentiment: "" };
        expect(entryIsEmpty(entry)).toBe(true);
    });

    test("entryIsEmpty correctly identifies non-empty entry", () => {
      	const entry = { date: '05302024', text_entry: "This is an example text entry.", tasks: [], sentiment: "Joyful" };
        expect(entryIsEmpty(entry)).toBe(false);
    });
});


