import { formatTimeBySeconds } from './time'; // Replace 'yourFile' with the actual file name

describe('formatTimeBySeconds function', () => {
  test('should convert seconds greater than 59 to time format', () => {
    expect(formatTimeBySeconds(60)).toBe('01:00');
    expect(formatTimeBySeconds(90)).toBe('01:30');
    expect(formatTimeBySeconds(120)).toBe('02:00');
    expect(formatTimeBySeconds(180)).toBe('03:00');
    expect(formatTimeBySeconds(360)).toBe('06:00');
  });
});
