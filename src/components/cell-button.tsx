interface CellButtonProps {
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isFlagged: boolean;
  children: React.ReactNode;
}

const CellButton = ({
  onClick,
  onContextMenu,
  isFlagged,
  children,
}: CellButtonProps) => (
  <button
    className={`h-full w-full flex items-center justify-center transition`}
    onClick={onClick}
    onContextMenu={onContextMenu}
  >
    {children}
  </button>
);

export default CellButton;
