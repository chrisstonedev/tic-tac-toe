import Square, {SquareValue} from './Square';
import React, {ReactNode} from 'react';

interface BoardProps {
  squares: SquareValue[];
  winningSquares: number[];

  onClick(i: number): void;
}

const Board: React.FC<BoardProps> = props => {
  const renderSquare = (i: number): ReactNode => (
    <Square key={'square' + i} value={props.squares[i]} isWinner={props.winningSquares.includes(i)}
            onClick={() => props.onClick(i)}/>
  );

  return (
    <div>
      {Array(3).fill('').map((_, row) => (
        <div className="board-row" key={'row' + row}>
          {Array(3).fill('').map((_, column) => renderSquare(row * 3 + column))}
        </div>
      ))}
    </div>
  );
};

export default Board;
