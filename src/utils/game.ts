import { GRID_SIZE } from '@/constants/game';

/**
 * Generate a matrix filled with empty cells.
 */
export const generateEmptyMatrix = () => {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => '0'),
  );
};

/**
 * Check if the cell is outside of the grid.
 * @param rowIndex
 * @param colIndex
 */
export const checkIsOutsideGrid = (rowIndex: number, colIndex: number) => {
  return (
    rowIndex <= -1 ||
    rowIndex >= GRID_SIZE ||
    colIndex <= -1 ||
    colIndex >= GRID_SIZE
  );
};
