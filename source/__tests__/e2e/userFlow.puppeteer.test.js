import {
    formatDateToYYYYMMDD
} from '../../public/scripts/date.util.js';

/**
 * @jest-environment puppeteer
 */
describe('Basic user flow for Website', () => {

    beforeAll(async () => {
        await page.goto('https://digitaldr3amt3am-journal.netlify.app');
    });

    // Test case to check if the home page displays today's date
    it('Initial Home Page - Check it is on today', async () => {
        console.log('Checking home date is on today...');
        const today = new Date();
        await page.waitForSelector('.highlight');
        const highlightedDate = await page.$eval('.highlight', el => el.textContent);
        const currentDate = today.getDate().toString();
        expect(highlightedDate).toBe(currentDate);
    }, 10000);

    // Test case to navigate from the home page to the journal page
    it('Gets to the journal page from home', async () => {
        console.log('Going to the journal page...');
        await page.click('#dates a');
        expect(page.url()).toBe("https://digitaldr3amt3am-journal.netlify.app/journal.html");
    }, 10000);

    // Test case to create a new journal entry
    it('Create a new journal entry', async () => {
        console.log('Creating a journal entry...');
        await page.waitForSelector('#entry-today');
        await page.click('#entry-today');
        await page.waitForSelector('.CodeMirror');
        const editor = await page.$('.CodeMirror');
        await editor.click();
        await page.keyboard.type('Today was a great day! I wrote some tests.');
        console.log('Waiting for autosave...');
        await page.waitForSelector('#autosave');
        const autosaveText = await page.$eval('#autosave', el => el.textContent);
        expect(autosaveText).toContain('Autosaved');

        // Check localStorage for journal entry
        console.log('Checking if journal entry is in localStorage...');
        let entryDate = await page.evaluate(() => {
            return localStorage.getItem('entry-display');
        });

        entryDate = formatDateToYYYYMMDD(entryDate);

        const journalEntry = await page.evaluate((entryDate) => {
            const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));
            if (!entry) {
                throw new Error(`Journal entry for ${entryDate} is not found`);
            }
            return entry;
        }, entryDate);

        expect(journalEntry.text_entry).toBe('Today was a great day! I wrote some tests.');
    }, 10000);

    // Test case to navigate to another date and back to verify the journal entry is saved
    it('Navigate to another date and back to verify save (Journal)', async () => {
        console.log('Going to the previous day...');
        await page.waitForSelector('#prev-day');
        await page.click('#prev-day');

        console.log('Going back to the right day...');
        await page.waitForSelector('#next-day');
        await page.click('#next-day');

        console.log('Checking if journal entry for day is there...');
        await page.waitForSelector('.CodeMirror');
        const textAreaValue = await page.evaluate(() => {
            return document.querySelector('.CodeMirror').CodeMirror.getValue();
        });
        expect(textAreaValue).toContain('Today was a great day! I wrote some tests.');
    }, 10000);

    // Test case to reload the page and verify the journal entry is still present
    it('Reload and verify an old journal entry', async () => {
        console.log('Reloading and seeing if old entry is valid...');
        await page.reload();
        await page.waitForSelector('.CodeMirror');
        const textAreaValue = await page.evaluate(() => {
            return document.querySelector('.CodeMirror').CodeMirror.getValue();
        });
        expect(textAreaValue).toContain('Today was a great day! I wrote some tests.');
    }, 10000);

    // Test case to clear a journal entry
    it('Clear journal entry', async () => {
        console.log('Clearing journal entry');
        await page.click('#entry-today');
        await page.waitForSelector('#clear-entry');

        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        await page.click('#clear-entry');
        await new Promise(resolve => setTimeout(resolve, 500));

        const entryText = await page.$eval('#entry-text', el => el.value);
        expect(entryText).toBe('');

        // Check localStorage for no journal entry
        let entryDate = await page.evaluate(() => {
            return localStorage.getItem('entry-display');
        });

        entryDate = formatDateToYYYYMMDD(entryDate);

        const journalEntry = await page.evaluate((entryDate) => {
            const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));
            if (!entry) {
                throw new Error(`Journal entry for ${entryDate} is not found`);
            }
            return entry;
        }, entryDate);

        expect(journalEntry.text_entry).toBe("");
    }, 10000);

    // Test case to add a new task
    it('Add a new task', async () => {
        console.log('Adding a new task...');
        await page.click('.new-task');
        await page.waitForSelector('#task-desc');
        await page.type('#task-desc', 'Write unit tests');
        await page.select('#task-type', 'Development');
        await page.select('#task-project', 'project 1');
        await page.click('.save');

        const taskDesc = await page.$eval('.task-item .task-description', el => el.textContent);
        expect(taskDesc).toBe('Write unit tests');

        // Check localStorage for task
        console.log('Checking if the task is in localStorage');
        let entryDate = await page.evaluate(() => {
            return localStorage.getItem('entry-display');
        });

        entryDate = formatDateToYYYYMMDD(entryDate);

        const journalEntry = await page.evaluate((entryDate) => {
            const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));
            if (!entry) {
                throw new Error(`Journal entry for ${entryDate} is not found`);
            }
            return entry;
        }, entryDate);

        const tasks = journalEntry.tasks || [];
        expect(tasks.length).toBeGreaterThan(0);
        expect(tasks.some(task => task.name === 'Write unit tests')).toBe(true);
    }, 10000);

    // Test case to navigate to another date and back to verify the task is saved
    it('Navigate to another date and back to verify save (task)', async () => {
        console.log('Going to the previous day...');
        await page.waitForSelector('#prev-day');
        await page.click('#prev-day');

        console.log('Going back to the right day...');
        await page.waitForSelector('#next-day');
        await page.click('#next-day');

        console.log('Checking if task is in valid after changing days...');
        await page.waitForSelector('.task-item');
        const taskDesc = await page.$eval('.task-item .task-description', el => el.textContent);
        expect(taskDesc).toBe('Write unit tests');
    }, 10000);

    // Test case to reload the page and verify the new task is still present
    it('Reload and verify new task', async () => {
        console.log('Reloading and verifying task...');
        const taskDesc = await page.$eval('.task-item .task-description', el => el.textContent);
        expect(taskDesc).toBe('Write unit tests');
    }, 10000);

    // Test case to edit a task
    it('Edit a task', async () => {
        console.log('Editing task and checking validity...');
        await page.click('.edit-task');
        await page.waitForSelector('#task-desc');
        await page.evaluate(() => { document.querySelector('#task-desc').value = ''; });
        await page.type('#task-desc', 'Write more unit tests');
        await page.click('.save');

        const taskDesc = await page.$eval('.task-item .task-description', el => el.textContent);
        expect(taskDesc).toBe('Write more unit tests');
    }, 10000);

    it('Test to see if edited task is in localStorage', async () => {
        // Check localStorage for task
        console.log('Checking if the task is in localStorage');
        let entryDate = await page.evaluate(() => {
            return localStorage.getItem('entry-display');
        });

        entryDate = formatDateToYYYYMMDD(entryDate);

        const journalEntry = await page.evaluate((entryDate) => {
            const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));
            if (!entry) {
                throw new Error(`Journal entry for ${entryDate} is not found`);
            }
            return entry;
        }, entryDate);

        const tasks = journalEntry.tasks || [];
        expect(tasks.length).toBeGreaterThan(0);
        expect(tasks.some(task => task.name === 'Write more unit tests')).toBe(true);
    }, 10000);

    // Test case to reload the page and verify the edited task is still present
    it('Reloading and verify an edited task', async () => {
        console.log('Reloading page and seeing if edited task is valid...');
        const taskDesc = await page.$eval('.task-item .task-description', el => el.textContent);
        expect(taskDesc).toBe('Write more unit tests');
    }, 10000);

    // Test case to delete a task
    it('Delete a task', async () => {
        console.log('Deleting task...');
        await page.click('.edit-task');
        await page.waitForSelector('#delete-task');
        await page.click('#delete-task');

        const taskItems = await page.$$('.task-item');
        expect(taskItems.length).toBe(0);

        // Check localStorage for no tasks
        console.log('Checking if task is deleted in localStorage...');
        let entryDate = await page.evaluate(() => {
            return localStorage.getItem('entry-display');
        });

        entryDate = formatDateToYYYYMMDD(entryDate);

        const journalEntry = await page.evaluate((entryDate) => {
            const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));
            if (!entry) {
                throw new Error(`Journal entry for ${entryDate} is not found`);
            }
            return entry;
        }, entryDate);

        const tasks = journalEntry.tasks || [];
        expect(tasks.length).toBe(0);
    });

    // Test case to select and verify the sentiment
    it('Select and verify sentiment', async () => {
        console.log('Testing all sentiments...');
        const sentiments = ['upset', 'unhappy', 'neutral', 'happy', 'joyful'];

        for (const sentiment of sentiments) {
            await page.waitForSelector(`input[name="feeling"][value="${sentiment}"] + .face-icon`);
            await page.click(`input[name="feeling"][value="${sentiment}"] + .face-icon`);
            await page.waitForSelector(`input[name="feeling"][value="${sentiment}"]:checked`);

            const selectedSentiment = await page.evaluate(() => {
                return document.querySelector('input[name="feeling"]:checked').value;
            });
            expect(selectedSentiment).toBe(sentiment);

            // Check localStorage for sentiment
            console.log(`Making sure ${sentiment} is in localStorage`);
            let entryDate = await page.evaluate(() => {
                return localStorage.getItem('entry-display');
            });

            entryDate = formatDateToYYYYMMDD(entryDate);

            const journalEntry = await page.evaluate((entryDate) => {
                const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));
                if (!entry) {
                    throw new Error(`Journal entry for ${entryDate} is not found`);
                }
                return entry;
            }, entryDate);

            expect(journalEntry.sentiment).toBe(sentiment);
        }
    }, 10000);

    // Test case to navigate to another date and back to verify the sentiment is saved
    it('Navigate to another date and back to verify save (Journal)', async () => {
        console.log('Going to the previous day...');
        await page.waitForSelector('#prev-day');
        await page.click('#prev-day');

        console.log('Going back to the right day...');
        await page.waitForSelector('#next-day');
        await page.click('#next-day');

        console.log('Checking if sentiment is valid after changing days...');
        await page.waitForSelector('.CodeMirror');

        const selectedSentiment = await page.evaluate(() => {
            const checkedRadio = document.querySelector('input[name="feeling"]:checked');
            return checkedRadio ? checkedRadio.value : null;
        });

        expect(selectedSentiment).toBe('joyful');
    }, 10000);

    // Test case to reload the page and verify the selected sentiment is still present
    it('Reload and verify selected sentiment', async () => {
        console.log('Testing if sentiment is valid after reload...');
        await page.reload();
        await page.waitForSelector('.CodeMirror');

        const selectedSentiment = await page.evaluate(() => {
            const checkedRadio = document.querySelector('input[name="feeling"]:checked');
            return checkedRadio ? checkedRadio.value : null;
        });

        expect(selectedSentiment).toBe('joyful');
    }, 10000);

});