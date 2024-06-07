// localstorage.util.test.js

import { getEntry, updateEntry, clearEntryData, updateTasks, entryIsEmpty } from "../../public/scripts/localstorage.util.js";

describe('Journal Entry Functions', () => {
  const ENTRY_DATE = '20220607';
  test('getEntry retrieves an existing entry', () => {
    const mockEntry = { date: ENTRY_DATE, text_entry: 'Test entry', tasks: [], sentiment: 'happy' };
    localStorage.setItem(`entry-${ENTRY_DATE}`, JSON.stringify(mockEntry));
    const entry = getEntry(ENTRY_DATE);
    expect(entry).toEqual(mockEntry);
  });

  test('updateEntry updates an entry in local storage', () => {
    const mockEntry = { date: ENTRY_DATE, text_entry: 'Test entry', tasks: [], sentiment: 'happy' };
    updateEntry(mockEntry,);
    expect(JSON.parse(localStorage.getItem(`entry-${ENTRY_DATE}`))).toEqual(mockEntry);
  });

  test('clearEntryData clears the entry data for the current date', () => {
    const mockEntry = { date: ENTRY_DATE, text_entry: 'Test entry', tasks: [], sentiment: 'happy' };
    localStorage.setItem(`entry-${ENTRY_DATE}`, JSON.stringify(mockEntry));
    clearEntryData(ENTRY_DATE);
    expect(JSON.parse(localStorage.getItem(`entry-${ENTRY_DATE}`))).toEqual({ date: ENTRY_DATE, text_entry: '', tasks: [], sentiment: '' });
  });

  test('updateTasks updates the tasks of an entry', () => {
    const mockEntry = { date: ENTRY_DATE, text_entry: '', tasks: [], sentiment: '' };
    const mockTasks = [{ name: 'Task 1', type_tag: 'Work', project_tag: 'Project A', completed: false }];
    updateTasks(mockEntry, mockTasks, ENTRY_DATE);
    expect(JSON.parse(localStorage.getItem(`entry-${ENTRY_DATE}`))).toEqual({ date: ENTRY_DATE, text_entry: '', tasks: mockTasks, sentiment: '' });
  });

  test("entryIsEmpty correctly identifies empty entry", () => {
    const mockEntry = { date: ENTRY_DATE, text_entry: "", tasks: [], sentiment: "" };
    expect(entryIsEmpty(mockEntry)).toBe(true);
  });

  test("entryIsEmpty correctly identifies non-empty entry", () => {
    const mockEntry = { date: ENTRY_DATE, text_entry: "This is an example text entry.", tasks: [], sentiment: "Joyful" };
    expect(entryIsEmpty(mockEntry)).toBe(false);
  });
});
