import { GRID_SIZE } from '@/constants/game';

export const checkIsOutsideGrid = (rowIndex: number, colIndex: number) => {
  return (
    rowIndex <= -1 ||
    rowIndex >= GRID_SIZE ||
    colIndex <= -1 ||
    colIndex >= GRID_SIZE
  );
};
