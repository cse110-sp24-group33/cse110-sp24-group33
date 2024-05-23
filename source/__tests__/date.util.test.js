
import { 
  getCurrentDate, 
  formatDateToYYYYMMDD 
} from '../scrpts/date.util';

const testDate = new Date(2024, 5, 23);
global.Date = jest.fn(() => testDate);

decribe('get current Date', () => {
  it('need to return the current date in "Monthe Day, Year" format', () => {
    const expectedDate = "May 23, 2024";
    const result = getCurrentDate();
    expect(result).toBe(expectedDate)
  });
})

describe('formatDateToYYYYMMDD', () => {

  it('should format a date string to YYYYMMDD', () => {
    const dateString = "May 23, 2024";
    const expectedFormattedDate = "20240523";
    const result = formatDateToYYYYMMDD(dateString);
    expect(result).toBe(expectedFormattedDate);
  });
  it('should return "Invalid Date" for invalid date strings', () => {
        const invalidDateString = "invalid-date";
        const result = formatDateToYYYYMMDD(invalidDateString);
        expect(result).toBe("Invalid Date");
    });
});
