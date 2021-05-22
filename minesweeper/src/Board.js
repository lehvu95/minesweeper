import React, {useEffect, useState} from 'react';

export const Board = props => {
  const {
    rows,
    cols, 
    bombs,
    bombsFound,
    gameOver,
    board,
  } = props;

  const [renderGame, shouldRenderGame] = useState(false);

  useEffect(() => {
    shouldRenderGame(rows > 0 && cols > 0 && bombs > 0);
  }, [rows, cols, bombs])

  const xValues = [''];
  const yValues = [];

  for (let x = 0; x < cols; x++) {
    xValues.push(x);
  }
  
  for (let y = 0; y < rows; y++) {
    yValues.push(y);
  }


  return (
    <div>
      {!renderGame && <p> press start game! </p>}
      {renderGame && 
        <table>
          <tr>{xValues.map(x => (<th>{x}</th>))}</tr>
          {yValues.map((y) => (
            <tr>
              <td>{y}</td>
              {board[y].map((row) => (
                <td><button>{row}</button></td>
              ))}
            </tr>
          ))}
        </table>
      }
    </div>
  );
};

export default Board;