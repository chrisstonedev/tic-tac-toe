import React from 'react';

export type SquareValue = 'X' | 'O' | null;

export interface SquareProps {
  value: SquareValue;
  isWinner: boolean;

  onClick(): void;
}

const Square: React.FC<SquareProps> = props => (
  <button className={'square' + (props.isWinner ? ' winner' : '')} onClick={props.onClick}>
    {props.value}
  </button>
);

export default Square;