// localstorage.util.js

/**
 * Updates the tasks of the entry, saves the updated entry to local storage.
 *
 * @param {Object} entry - The entry object to update.
 * @param {Array} tasks - The array of tasks to assign to the entry.
 * @param {string} entryDate - The date of the entry to update.
 */
function updateTasks(entry, tasks, entryDate) {
    entry.tasks = tasks;
    updateEntry(entry, entryDate);
}

/**
 * Retrieves existing entry data for the current date from local storage,
 * or initializes a new entry object with default values if no data is found.
 * 
 * @param {string} entryDate - The date of the entry to retrieve.
 * @returns {Object} The entry object containing date, text entry, tasks, and sentiment.
 */
function getEntry(entryDate) {
    return JSON.parse(localStorage.getItem(`entry-${entryDate}`)) || { date: entryDate, text_entry: "", tasks: [], sentiment: "" };
}

/**
 * Updates the entry data for the current entry date in local storage.
 * 
 * @param {string} entryDate - The date of the entry to update.
 * @param {Object} entry - The entry object to update.
 */
function updateEntry(entry, entryDate) {
    localStorage.setItem(`entry-${entryDate}`, JSON.stringify(entry));
}

/**
 * Clears the entry data for the current entry date in local storage.
 * @param {string} entryDate - The date of the entry to clear.
 */
function clearEntryData(entryDate) {
    const entry = { date: entryDate, text_entry: "", tasks: [], sentiment: "" };
    localStorage.setItem(`entry-${entryDate}`, JSON.stringify(entry));
}

/**
 * Checks if an entry is empty (no stored content).
 * @param {object} entry - The entry object to check.
 * @returns {boolean} True if the entry is empty; otherwise, false.
 */
function entryIsEmpty(entry) {
    return entry.text_entry === "" && entry.tasks.length === 0 && entry.sentiment === "";
}

export { updateTasks, getEntry, updateEntry, clearEntryData, entryIsEmpty }; 