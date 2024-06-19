import { GRID_SIZE } from '@/constants/game';
import { generateEmptyMatrix, checkIsOutsideGrid } from './game';

describe('Game Utils', () => {
  describe('generateEmptyMatrix', () => {
    it('should return a GRID_SIZE x GRID_SIZE matrix filled with "0"', () => {
      const result = generateEmptyMatrix();
      expect(result.length).toBe(GRID_SIZE);
      expect(result[0].length).toBe(GRID_SIZE);
      expect(result[0][0]).toBe('0');
    });
  });

  describe('checkIsOutsideGrid', () => {
    it('should return true for coordinates outside the grid', () => {
      expect(checkIsOutsideGrid(-1, 0)).toBe(true);
      expect(checkIsOutsideGrid(GRID_SIZE, 0)).toBe(true);
      expect(checkIsOutsideGrid(0, -1)).toBe(true);
      expect(checkIsOutsideGrid(0, GRID_SIZE)).toBe(true);
    });

    it('should return false for coordinates inside the grid', () => {
      expect(checkIsOutsideGrid(0, 0)).toBe(false);
      expect(checkIsOutsideGrid(GRID_SIZE - 1, GRID_SIZE - 1)).toBe(false);
    });
  });
});
