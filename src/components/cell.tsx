import CellButton from '@/components/cell-button';
import { FC, memo, useCallback } from 'react';
import cls from 'classnames';

interface CellProps {
  rowIndex: number;
  colIndex: number;
  cellValue: string | number;
  isClicked: boolean;
  isFlagged: boolean;
  onLeftClick: (rowIndex: number, colIndex: number) => void;
  onRightClick: (rowIndex: number, colIndex: number) => void;
}

const Cell: FC<CellProps> = ({
  rowIndex,
  colIndex,
  cellValue,
  isClicked,
  isFlagged,
  onLeftClick,
  onRightClick,
}) => {
  const onClick = useCallback(() => {
    onLeftClick(rowIndex, colIndex);
  }, [colIndex, onLeftClick, rowIndex]);

  const onContextMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onRightClick(rowIndex, colIndex);
    },
    [colIndex, onRightClick, rowIndex],
  );

  const className = cls(
    `h-[7vmin] w-[7vmin] flex justify-center items-center`,
    {
      'odd:bg-lime-500 even:bg-lime-400 hover:bg-lime-300':
        !isClicked && rowIndex % 2 === 0,
      'odd:bg-lime-400 even:bg-lime-500 hover:bg-lime-300':
        !isClicked && rowIndex % 2 === 1,
      'odd:bg-orange-100 even:bg-orange-50': isClicked && rowIndex % 2 === 0,
      'odd:bg-orange-50 even:bg-orange-100': isClicked && rowIndex % 2 === 1,
    },
  );

  return (
    <div key={`${rowIndex}-${colIndex}`} className={className}>
      {isClicked ? (
        <span
          className={cls({
            'text-green-600': Number(cellValue) <= 1,
            'text-yellow-500': Number(cellValue) === 2,
            'text-red-600': Number(cellValue) === 3,
            'text-purple-600': Number(cellValue) >= 4,
          })}
        >
          {cellValue === 'X' ? '💣' : cellValue === '0' ? null : cellValue}
        </span>
      ) : (
        <CellButton
          onClick={onClick}
          onContextMenu={onContextMenu}
          isFlagged={isFlagged}
        >
          {isFlagged && '⛳'}
        </CellButton>
      )}
    </div>
  );
};

export default memo(Cell);
