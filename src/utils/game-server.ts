import 'server-only';

import { BOMBS_COUNT, CELL_BORDERS, GRID_SIZE } from '@/constants/game';
import { MatrixType } from '@/types/game';
import { generateEmptyMatrix } from '@/utils/game';

/**
 * Generate a matrix with count of GRID_SIZE * GRID_SIZE cells.
 * Avoid first click is never a mine by first clicked position(x,y)
 * Each cell is one of following types:
 * 1. 'X': Bomb cell
 * 2. '(number)': With (number) bombs surrounding
 */
export const generateMatrix = (row: number, col: number): MatrixType => {
  const firstClickedCell = `${row}-${col}`;

  const MATRIX = generateEmptyMatrix();
  const bombCells: string[] = [];

  // Generate random bombs in the board.
  for (let count = BOMBS_COUNT; count > 0; count--) {
    let randomRow = Math.floor(Math.random() * GRID_SIZE);
    let randomCol = Math.floor(Math.random() * GRID_SIZE);
    let cell = `${randomRow}-${randomCol}`;

    // If the random cell picked already has a bomb, pick another one.
    while (firstClickedCell === cell || bombCells.includes(cell)) {
      randomRow = Math.floor(Math.random() * GRID_SIZE);
      randomCol = Math.floor(Math.random() * GRID_SIZE);
      cell = `${randomRow}-${randomCol}`;
    }

    MATRIX[randomRow][randomCol] = 'X';
    bombCells.push(cell);
  }

  // Find the number of bombs surrounding by each cell.
  for (let i = 0; i < MATRIX.length; i++) {
    for (let j = 0; j < MATRIX[i].length; j++) {
      if (MATRIX[i][j] !== 'X') {
        let bombsCount = 0;

        // Check the 8 surrounding cells
        for (const border of CELL_BORDERS) {
          if (MATRIX[i + border[0]]?.[j + border[1]] === 'X') {
            bombsCount++;
          }
        }

        MATRIX[i][j] = String(bombsCount);
      }
    }
  }

  return MATRIX;
};
