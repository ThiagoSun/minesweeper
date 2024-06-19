'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BOMBS_COUNT, CELL_BORDERS, GRID_SIZE } from '@/constants/game';
import { useGenerateMatrix } from '@/models/useGenerateMatrix';
import Cell from '@/components/cell';
import { formatTimeBySeconds } from '@/utils/time';
import { MatrixType } from '@/types/game';
import { checkIsOutsideGrid } from '@/utils/game-client';

const Game = () => {
  // Clicked square coordinate list, `${xIndex}-${yIndex}`
  const [clicked, setClicked] = useState<Set<string>>(new Set());
  // Right-Clicked square coordinate list, `${xIndex}-${yIndex}`
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  // Flags count left.
  const [flags, setFlags] = useState(BOMBS_COUNT);
  // Game time in seconds.
  const [time, setTime] = useState(0);
  // Game time counting interval id
  const intervalRef = useRef<NodeJS.Timeout>();
  // Game status
  const [status, setStatus] = useState<'idle' | 'playing' | 'lost' | 'won'>(
    'idle',
  );

  const {
    data: matrix,
    queryData: generateMatrix,
    resetData: resetMatrix,
    loading: generateMatrixLoading,
  } = useGenerateMatrix();

  // When the game status changes
  useEffect(() => {
    if (status === 'idle' || status === 'lost' || status === 'won') {
      intervalRef.current && clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      if (status === 'idle') {
        setTime(0);
      } else {
        // Clear the entire board, set all cells clicked.
        const allCells = matrix.flatMap((row, rowIndex) =>
          row.map((col, colIndex) => `${rowIndex}-${colIndex}`),
        );
        setClicked(new Set(allCells));
      }
    } else if (status === 'playing') {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  }, [status]);

  // If an empty cell is clicked, all adjacent cells will clear until it meets a number.
  const clearSurroundings = useCallback(
    (
      rowIndex: number,
      colIndex: number,
      visitedCells: Set<string>,
      matrix: MatrixType,
      flagged: Set<string>,
    ) => {
      const cell = `${rowIndex}-${colIndex}`;

      // 1.Optimize this function, ignore visited cells
      // 2.Checking the cell isn't outside the grid.
      // 3.Checking the cell isn't flagged.
      if (
        visitedCells.has(cell) ||
        checkIsOutsideGrid(rowIndex, colIndex) ||
        flagged.has(cell)
      ) {
        return;
      }

      visitedCells.add(cell);

      const cellValue = matrix[rowIndex]?.[colIndex];

      // Open current cell if it's empty or closed to bomb(s)
      if (cellValue === '0' || Number(cellValue) > 0) {
        setClicked((clicked) => {
          clicked.add(cell);
          return new Set(clicked);
        });
      }

      // If this cell is empty, checking surrounding cells by recalling this function
      if (cellValue === '0') {
        for (const border of CELL_BORDERS) {
          clearSurroundings(
            rowIndex + border[0],
            colIndex + border[1],
            visitedCells,
            matrix,
            flagged,
          );
        }
      }
    },
    [],
  );

  // Restart the game.
  const handleRestart = useCallback(() => {
    resetMatrix();
    setClicked(new Set());
    setFlagged(new Set());
    setStatus('idle');
    setFlags(BOMBS_COUNT);
  }, [resetMatrix]);

  const handleLeftClick = useCallback(
    async (rowIndex: number, colIndex: number) => {
      const cell = `${rowIndex}-${colIndex}`;

      if (flagged.has(cell) || status === 'won' || status === 'lost') return;

      let newMatrix = matrix;
      if (status === 'idle') {
        if (generateMatrixLoading) {
          return;
        }
        const res = await generateMatrix({ row: rowIndex, col: colIndex });
        if (res) {
          newMatrix = res;
          setStatus('playing');
        } else {
          return;
        }
      }

      // Open this cell
      clicked.add(cell);
      const newClicked = new Set(clicked);
      setClicked(newClicked);

      if (newMatrix[rowIndex][colIndex] === '0') {
        // If an empty cell is clicked, all adjacent cells will clear until it meets a number.
        const visitedCells = new Set<string>();
        clearSurroundings(rowIndex, colIndex, visitedCells, newMatrix, flagged);
      } else if (newMatrix[rowIndex][colIndex] === 'X') {
        setStatus('lost');
        return;
      }
      if (newClicked.size === GRID_SIZE * GRID_SIZE - BOMBS_COUNT) {
        setStatus('won');
      }
    },
    [
      clearSurroundings,
      clicked,
      flagged,
      generateMatrix,
      generateMatrixLoading,
      matrix,
      status,
    ],
  );

  const handleRightClick = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (status !== 'playing') return;

      const cell = `${rowIndex}-${colIndex}`;

      if (!flagged.has(cell) && flags > 0) {
        // Adding the flag.
        setFlagged((flagged) => {
          flagged.add(cell);
          return new Set(flagged);
        });
        setFlags(flags - 1);
      } else if (flagged.has(cell)) {
        // Removing the flag.
        setFlagged((flagged) => {
          flagged.delete(cell);
          return new Set(flagged);
        });
        setFlags(flags + 1);
      }
    },
    [flagged, flags, status],
  );

  const getSurroundingFlagsCount = useCallback(
    (rowIndex: number, colIndex: number) => {
      let count = 0;
      for (const border of CELL_BORDERS) {
        const newRowIndex = rowIndex + border[0];
        const newColIndex = colIndex + border[1];

        // Checking the cell isn't outside the grid layout.
        if (checkIsOutsideGrid(newColIndex, newColIndex)) {
          continue;
        }

        const cell = `${newRowIndex}-${newColIndex}`;
        if (flagged.has(cell)) {
          count++;
        }
      }
      return count;
    },
    [flagged],
  );

  // While clicks on a number cell
  const handleDoubleClick = useCallback(
    async (rowIndex: number, colIndex: number) => {
      const flagCount = getSurroundingFlagsCount(rowIndex, colIndex);

      if (flagCount !== Number(matrix[rowIndex]?.[colIndex])) {
        return;
      }

      for (const border of CELL_BORDERS) {
        const newRowIndex = rowIndex + border[0];
        const newColIndex = colIndex + border[1];

        // Checking the cell isn't outside the grid layout.
        if (checkIsOutsideGrid(newRowIndex, newColIndex)) {
          continue;
        }
        await handleLeftClick(newRowIndex, newColIndex);
      }
    },
    [getSurroundingFlagsCount, handleLeftClick, matrix],
  );

  const timeFormatted = useMemo(() => {
    return formatTimeBySeconds(time);
  }, [time]);

  return (
    <section className="flex flex-col items-center gap-2">
      <div className="flex justify-between font-medium px-2 w-full text-2xl text-slate-600">
        <span>{timeFormatted}</span>
        {status === 'lost' ? (
          <span className={'font-bold text-slate-600'}>Failed 😵‍💫</span>
        ) : status === 'won' ? (
          <span className={'font-bold text-orange-500'}>
            Congratulations! 🎉
          </span>
        ) : null}
        <span className="flex">⛳ x{flags}</span>
      </div>
      <div
        className={`bg-white rounded-lg p-4 text-2xl shadow-md ${status === 'lost' && 'shake'}`}
      >
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                rowIndex={rowIndex}
                colIndex={colIndex}
                cellValue={cell}
                isClicked={clicked.has(`${rowIndex}-${colIndex}`)}
                isFlagged={flagged.has(`${rowIndex}-${colIndex}`)}
                onLeftClick={handleLeftClick}
                onRightClick={handleRightClick}
                onDoubleClick={handleDoubleClick}
              />
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={handleRestart}
        className="text-3xl text-white text-center p-4 px-12 mt-4 bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-lg"
      >
        Restart
      </button>
    </section>
  );
};

export default Game;
