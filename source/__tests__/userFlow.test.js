describe('Basic user flow for Website', () => {

    beforeAll(async () => {
        await page.goto('https://digitaldr3amt3am-journal.netlify.app');
    });

    /**
     * Converts a date string from "Month Day, Year" format to "YearMonthDay" format
     * @param {string} dateString - Date string in "Month Day, Year" format
     * @returns {string} - Date string in "YearMonthDay" format (e.g., "May 24, 2024" -> "20240524")
     */
    const convertDateString = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    };

    // Test case to check if the home page displays today's date
    it('Initial Home Page - Check it is on today', async () => {
        console.log('Checking home date is on today...');
        const today = new Date();
        console.log(today);
        await page.waitForSelector('.highlight');
        const highlightedDate = await page.$eval('.highlight', el => el.textContent);

        const currentDate = today.getDate().toString();
        expect(highlightedDate).toBe(currentDate);
    });

    // Test case to navigate from the home page to the journal page
    it('Gets to the journal page from home', async () => {
        await page.click('#dates a'); 
        expect(page.url()).toBe("https://digitaldr3amt3am-journal.netlify.app/journal.html");
    });

    // Test case to create a new journal entry
    it('Create a new journal entry', async () => {
        await page.waitForSelector('#entry-today');
        await page.click('#entry-today');
        await page.waitForSelector('.CodeMirror');
        const editor = await page.$('.CodeMirror');
        await editor.click();
        await page.keyboard.type('Today was a great day! I wrote some tests.');

        await page.waitForSelector('#autosave');
        const autosaveText = await page.$eval('#autosave', el => el.textContent);
        expect(autosaveText).toContain('Autosaved');

        // Check localStorage for journal entry
        let entryDate = await page.evaluate(() => {
            return localStorage.getItem('entry-display');
        });

        entryDate = convertDateString(entryDate);

        const journalEntry = await page.evaluate((entryDate) => {
            const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));
            if (!entry) {
                throw new Error(`Journal entry for ${entryDate} is not found`);
            }
            return entry;
        }, entryDate);

        expect(journalEntry.text_entry).toBe('Today was a great day! I wrote some tests.');
    });

    // Test case to navigate to another date and back to verify the journal entry is saved
    it('Navigate to another date and back to verify save (Journal)', async () => {
        await page.waitForSelector('#prev-day'); 
        await page.click('#prev-day');

        await page.waitForSelector('#next-day'); 
        await page.click('#next-day');
        
        await page.waitForSelector('.CodeMirror');
        const textAreaValue = await page.evaluate(() => {
            return document.querySelector('.CodeMirror').CodeMirror.getValue();
        });
        expect(textAreaValue).toContain('Today was a great day! I wrote some tests.');
    });

    // Test case to reload the page and verify the journal entry is still present
    it('Reload and verify an old journal entry', async () => {
        await page.reload();
        await page.waitForSelector('.CodeMirror');
        const textAreaValue = await page.evaluate(() => {
            return document.querySelector('.CodeMirror').CodeMirror.getValue();
        });
        expect(textAreaValue).toContain('Today was a great day! I wrote some tests.');
    });

    // Test case to clear a journal entry
    it('Clear journal entry', async () => {
        
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

        entryDate = convertDateString(entryDate);

        const journalEntry = await page.evaluate((entryDate) => {
            const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));
            if (!entry) {
                throw new Error(`Journal entry for ${entryDate} is not found`);
            }
            return entry;
        }, entryDate);

        expect(journalEntry.text_entry).toBe("");
    });

    // Test case to add a new task
    it('Add a new task', async () => {
        await page.click('.new-task');
        await page.waitForSelector('#task-desc');
        await page.type('#task-desc', 'Write unit tests');
        await page.select('#task-type', 'Development');
        await page.select('#task-project', 'project 1');
        await page.click('.save');

        const taskDesc = await page.$eval('.task-item .task-description', el => el.textContent);
        expect(taskDesc).toBe('Write unit tests');

        // Check localStorage for task
        let entryDate = await page.evaluate(() => {
            return localStorage.getItem('entry-display');
        });

        entryDate = convertDateString(entryDate);

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
    });

    // Test case to navigate to another date and back to verify the task is saved
    it('Navigate to another date and back to verify save (task)', async () => {
        await page.waitForSelector('#prev-day'); 
        await page.click('#prev-day');

        await page.waitForSelector('#next-day'); 
        await page.click('#next-day');
        
        await page.waitForSelector('.task-item');
        const taskDesc = await page.$eval('.task-item .task-description', el => el.textContent);
        expect(taskDesc).toBe('Write unit tests');
    });

    // Test case to reload the page and verify the new task is still present
    it('Reload and verify new task', async() => {
        const taskDesc = await page.$eval('.task-item .task-description', el => el.textContent);
        expect(taskDesc).toBe('Write unit tests');
    });

    // Test case to edit a task
    it('Edit a task', async () => {
        await page.click('.edit-task');
        await page.waitForSelector('#task-desc');
        await page.evaluate(() => { document.querySelector('#task-desc').value = ''; });
        await page.type('#task-desc', 'Write more unit tests');
        await page.click('.save');

        const taskDesc = await page.$eval('.task-item .task-description', el => el.textContent);
        expect(taskDesc).toBe('Write more unit tests');
    });

    // Test case to reload the page and verify the edited task is still present
    it('Reloading and verify an edited task', async() => {
        const taskDesc = await page.$eval('.task-item .task-description', el => el.textContent);
        expect(taskDesc).toBe('Write more unit tests');
    });

    // Test case to delete a task
    it('Delete a task', async () => {
        await page.click('.edit-task');
        await page.waitForSelector('#delete-task');
        await page.click('#delete-task');

        const taskItems = await page.$$('.task-item');
        expect(taskItems.length).toBe(0);

        // Check localStorage for no tasks
        let entryDate = await page.evaluate(() => {
            return localStorage.getItem('entry-display');
        });

        entryDate = convertDateString(entryDate);

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
            let entryDate = await page.evaluate(() => {
                return localStorage.getItem('entry-display');
            });

            entryDate = convertDateString(entryDate);

            const journalEntry = await page.evaluate((entryDate) => {
                const entry = JSON.parse(localStorage.getItem(`entry-${entryDate}`));
                if (!entry) {
                    throw new Error(`Journal entry for ${entryDate} is not found`);
                }
                return entry;
            }, entryDate);

            expect(journalEntry.sentiment).toBe(sentiment);
        }
    });

    // Test case to navigate to another date and back to verify the sentiment is saved
    it('Navigate to another date and back to verify save (Journal)', async () => {
        await page.waitForSelector('#prev-day'); 
        await page.click('#prev-day');

        await page.waitForSelector('#next-day'); 
        await page.click('#next-day');
        
        await page.waitForSelector('.CodeMirror');

        const selectedSentiment = await page.evaluate(() => {
            const checkedRadio = document.querySelector('input[name="feeling"]:checked');
            return checkedRadio ? checkedRadio.value : null;
        });

        expect(selectedSentiment).toBe('joyful');
    });

    // Test case to reload the page and verify the selected sentiment is still present
    it('Reload and verify selected sentiment', async () => {
        await page.reload();
        await page.waitForSelector('.CodeMirror');

        const selectedSentiment = await page.evaluate(() => {
            const checkedRadio = document.querySelector('input[name="feeling"]:checked');
            return checkedRadio ? checkedRadio.value : null;
        });

        expect(selectedSentiment).toBe('joyful');
    });

});