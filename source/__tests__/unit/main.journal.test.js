import { initEntry, getEntry, updateEntry, clearEntryData, displayTasks, changeDate, updateTasks, displayDate, updateDisplay } from '../../public/scripts/main.journal.js';

describe('Journal Entry Functions', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <textarea id="entry-text"></textarea>
      <div id="autosave"></div>
      <div id="task-container"></div>
      <div id="task-modal"></div>
      <div id="date"><h2></h2></div>
      <button id="prev-day"></button>
      <button id="next-day"></button>
      <button id="entry-today"></button>
      <input type="radio" name="feeling" value="happy">
      <input type="radio" name="feeling" value="neutral">
      <input type="radio" name="feeling" value="sad">
    `;
  });

  test('initEntry initializes page correctly', () => {
    initEntry();
    expect(document.getElementById('entry-text').value).toBe('');
    expect(document.getElementById('autosave').classList).toContain('hide');
  });

  test('getEntry retrieves an existing entry', () => {
    const mockEntry = { date: '20220607', text_entry: 'Test entry', tasks: [], sentiment: 'happy' };
    localStorage.setItem('entry-20220607', JSON.stringify(mockEntry));
    const entry = getEntry('20220607');
    expect(entry).toEqual(mockEntry);
  });

  test('updateEntry updates an entry in local storage', () => {
    const mockEntry = { date: '20220607', text_entry: 'Test entry', tasks: [], sentiment: 'happy' };
    updateEntry(mockEntry);
    expect(JSON.parse(localStorage.getItem('entry-20220607'))).toEqual(mockEntry);
  });

  test('clearEntryData clears the entry data for the current date', () => {
    const mockEntry = { date: '20220607', text_entry: 'Test entry', tasks: [], sentiment: 'happy' };
    localStorage.setItem('entry-20220607', JSON.stringify(mockEntry));
    clearEntryData();
    expect(JSON.parse(localStorage.getItem('entry-20220607'))).toEqual({ date: '20220607', text_entry: '', tasks: [], sentiment: '' });
  });

  test('displayTasks displays tasks correctly', () => {
    const mockEntry = { date: '20220607', text_entry: '', tasks: [{ name: 'Task 1', type_tag: 'Work', project_tag: 'Project A', completed: false }], sentiment: '' };
    localStorage.setItem('entry-20220607', JSON.stringify(mockEntry));
    displayTasks(document.getElementById('task-container'), document.getElementById('task-modal'));
    const taskContainer = document.getElementById('task-container');
    expect(taskContainer.children.length).toBe(1);
    expect(taskContainer.children[0].querySelector('.task-description').textContent).toBe('Task 1');
  });

  test('changeDate updates the displayed date correctly', () => {
    const dateDisplay = document.querySelector('#date h2');
    dateDisplay.textContent = 'June 7, 2022';
    changeDate(1, dateDisplay);
    expect(dateDisplay.textContent).toBe('June 8, 2022');
    changeDate(-2, dateDisplay);
    expect(dateDisplay.textContent).toBe('June 6, 2022');
  });

  test('updateTasks updates the tasks of an entry', () => {
    const mockEntry = { date: '20220607', text_entry: '', tasks: [], sentiment: '' };
    const mockTasks = [{ name: 'Task 1', type_tag: 'Work', project_tag: 'Project A', completed: false }];
    updateTasks(mockEntry, mockTasks);
    expect(JSON.parse(localStorage.getItem('entry-20220607'))).toEqual({ date: '20220607', text_entry: '', tasks: mockTasks, sentiment: '' });
  });

  // Add more test cases for displayDate, updateDisplay, and event listeners as needed

});
