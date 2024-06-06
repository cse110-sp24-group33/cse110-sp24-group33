//date.util.test.js

/**
 * @jest-environment jsdom
 */
import { 
    getCurrentDate, 
    formatDateToYYYYMMDD 
} from '../../public/scripts/date.util.js';

describe('Date Utility Functions', () => {
  test('getCurrentDate should return the current date in "Month Day, Year" format', () => {
    const date = new Date();
    const expectedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    expect(getCurrentDate()).toBe(expectedDate);
  });

  test('formatDateToYYYYMMDD should format date string to YYYYMMDD', () => {
    const dateString = 'May 23, 2024';
    const expectedFormat = '20240523';

    expect(formatDateToYYYYMMDD(dateString)).toBe(expectedFormat);
  });
});
