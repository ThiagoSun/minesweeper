import { generateMatrix } from './game-server';
import { BOMBS_COUNT, GRID_SIZE } from '@/constants/game';
import { MatrixType } from '@/types/game';

describe('generateMatrix', () => {
  it('should generate a matrix of size GRID_SIZE * GRID_SIZE', () => {
    const matrix: MatrixType = generateMatrix(0, 0);
    expect(matrix.length).toBe(GRID_SIZE);
    expect(matrix[0].length).toBe(GRID_SIZE);
  });

  it('should not have the first clicked cell as a bomb', () => {
    const matrix: MatrixType = generateMatrix(1, 1);
    expect(matrix[1][1]).not.toBe('X');
  });

  it('should have exactly BOMBS_COUNT bombs in the matrix', () => {
    const matrix: MatrixType = generateMatrix(0, 0);
    let bombsCount = 0;

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 'X') {
          bombsCount++;
        }
      }
    }

    expect(bombsCount).toBe(BOMBS_COUNT);
  });

  it('should have correct count of bombs surrounding each cell', () => {
    const matrix: MatrixType = generateMatrix(0, 0);

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] !== 'X') {
          let bombsCount = 0;

          // Check the 8 surrounding cells
          for (const border of [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
          ]) {
            if (matrix[i + border[0]]?.[j + border[1]] === 'X') {
              bombsCount++;
            }
          }

          expect(Number(matrix[i][j])).toBe(bombsCount);
        }
      }
    }
  });

  it('should generate a different matrix each time it is called', () => {
    const matrix1: MatrixType = generateMatrix(0, 0);
    const matrix2: MatrixType = generateMatrix(0, 0);

    let differentCellsCount = 0;

    for (let i = 0; i < matrix1.length; i++) {
      for (let j = 0; j < matrix1[i].length; j++) {
        if (matrix1[i][j] !== matrix2[i][j]) {
          differentCellsCount++;
        }
      }
    }

    expect(differentCellsCount).toBeGreaterThan(0);
  });
});
