import React, {useState} from 'react';
import {SquareValue} from './Square';
import Board from './Board';

const Game: React.FC = () => {
  const [history, setHistory] = useState<{ squares: SquareValue[] }[]>([{squares: Array(9).fill(null)}]);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  const handleClick = (i: number): void => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
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
  const calculateResult = calculateWinner(current.squares);
  const winner = calculateResult.winner;
  const winningSquares = calculateResult.winningSquares || [];
  const availableMoves: number[] = [];
  if (stepNumber > 0) {
    availableMoves.push(0);
  }
  if (stepNumber > 1 && history.length > 2) {
    availableMoves.push(stepNumber - 1);
  }

  const moves = availableMoves.map(step => {
    const description = step ? 'Undo last move' : (winner ? 'Play new game' : 'Reset game');
    return (
      <li key={step}>
        <button onClick={() => jumpTo(step)}>{description}</button>
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
        <Board squares={current.squares} winningSquares={winningSquares} onClick={(i: number) => handleClick(i)}/>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ul>{moves}</ul>
      </div>
    </div>
  );
};

const calculateWinner = (squares: SquareValue[]): { winner: SquareValue, winningSquares?: number[] } => {
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
  let crazyTest = lines.filter(line =>
    squares[line[0]] && squares[line[0]] === squares[line[1]] && squares[line[0]] === squares[line[2]]);
  if (crazyTest.length > 0) {
    return {winner: squares[crazyTest[0][0]], winningSquares: [...new Set(crazyTest.flat())]};
  }
  return {winner: null};
};

export default Game;