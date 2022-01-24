import React, {ReactNode, useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

type SquareValue = 'X' | 'O' | null;

interface SquareProps {
  value: SquareValue;

  onClick(): void;
}

const Square: React.FC<SquareProps> = props => (
  <button className="square" onClick={props.onClick}>
    {props.value}
  </button>
);

interface BoardProps {
  squares: SquareValue[];

  onClick(i: number): void;
}

const Board: React.FC<BoardProps> = props => {
  const renderSquare = (i: number): ReactNode => (
    <Square value={props.squares[i]} onClick={() => props.onClick(i)}/>
  );

  return (
    <div>
      {Array(3).fill('').map((_, row) => (
        <div className="board-row">
          {Array(3).fill('').map((_, column) => renderSquare(row * 3 + column))}
        </div>
      ))}
    </div>
  );
};

const Game: React.FC = () => {
  const [history, setHistory] = useState<{ squares: SquareValue[] }[]>([{squares: Array(9).fill(null)}]);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  const handleClick = (i: number): void => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';

    setHistory(newHistory.concat([{squares: squares}]));
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step: number): void => {
    setStepNumber(step);
    setXIsNext((step % 2) === 0);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const description = move ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i: number) => handleClick(i)}/>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

const calculateWinner = (squares: SquareValue[]): SquareValue => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
};

ReactDOM.render(
  <Game/>,
  document.getElementById('root'),
);
