import React, {useEffect, useState} from 'react';

export const Board = props => {
  const {
    rows,
    cols, 
    bombs,
    board,
  } = props;

  const [renderGame, shouldRenderGame] = useState(false);
  const [gameOver, updateGameOver] = useState(false);
  const [bombed, updateBombed] = useState(false);
  const [bombsFound, updateBombs] = useState(0);
  const [currentBoard, updateBoard] = useState(board);
  const [turns, updateTurns] = useState(0);

  useEffect(() => {
    shouldRenderGame(rows > 0 && cols > 0 && bombs > 0);
    updateGameOver(false);
    updateBombed(false);
    updateBombs(0);
    updateTurns(0);
    updateBoard(board);
  }, [rows, cols, bombs]);

  useEffect(() => {
    updateBoard(currentBoard);
  }, [turns]);

  const xValues = [''];
  const yValues = [];

  for (let x = 0; x < cols; x++) {
    xValues.push(x);
  }
  
  for (let y = 0; y < rows; y++) {
    yValues.push(y);
  }

  /*
  setSurrounding(rows, cols, x, y, board) {
    let updateBoard = board;
    for (let i = y - 1; i <= y + 1; i++) {
      for (let j = x - 1; j <= x + 1; j ++){
        if (i < 0 || i > rows -1  || j < 0 || j > cols - 1 || board[i][j].value === 'X') {
          continue;
        } 
        updateBoard[i][j].value++;
      }
    }
    return updateBoard;
  }
  */

  /*const showCell = (mini, board) => {
    const tempBoard = board;
    for (let row = 0; row < mini.length; row++) {
      for (let col = 0; col < mini[row].length; col++) {
        const {x, y, value} = mini[row][col];
        if (tempBoard[y][x].status === 'hide') {
          tempBoard[y][x].status = 'show';
          if (value === 0) {
            getMini(x, y, board);
          }
        }
      }
    }
    
    return tempBoard;
  }
  
  const getMini = (x, y, board) => {
    const miniBoard = [];
    for (let i = y - 1; i <= y + 1; i++) {
      const miniRow = [];
      for (let j = x - 1; j <= x + 1; j ++) {
        if (i < 0 || i > rows -1  || j < 0 || j > cols - 1 || board[i][j].value === 'X') {
          continue;
        }
        miniRow.push({x: j, y: i, value: board[i][j].value});
      }
      miniBoard.push(miniRow);
    }

    return miniBoard;
  }

  const fillBlanks = (x, y, board) => {
    const miniBoard = getMini(x, y, board);
    let fillBoard = board;
    fillBoard = showCell(miniBoard, board);
    return fillBoard;
  }*/

  const showCell = (board, list) => {
    console.log('showCell');
    const tempBoard = board;
    for (let item in list) {
      tempBoard[item.y][item.x].status = 'show';
    }
    return tempBoard;
  }

  const getSurroundings = (coor, board, checked, unchecked = []) => {
    const {x, y} = coor;
    const tempChecked = checked;
    const tempUnchecked = unchecked;
    tempChecked.push(coor)
    for (let i = y - 1; i <= y + 1; i++) {
      for (let j = x - 1; j <= x + 1; j ++) {
        if (i < 0 || i > rows - 1 || j < 0 || j > cols - 1) {
          continue;
        }
        const obj = {x: j, y: i};
        if (!tempChecked.includes(obj) && !tempUnchecked.includes(obj)) {
          if (board[i][j].value > 0) {
            tempChecked.push(obj);
          } else {
            tempUnchecked.push(obj);
          }
        }
        console.log('checked:', tempChecked, 'unchecked:', tempUnchecked);
      }
    }

    if (tempUnchecked.length === 0 || tempUnchecked.length > rows * cols) {
      return tempChecked;
    } else {
      const newCoor = tempUnchecked.shift();
      console.log(newCoor);
      getSurroundings(newCoor, board, tempChecked, tempUnchecked);
    }
  }

  const getList = (x, y , board) => {
    let coordinates = [];
    coordinates = getSurroundings({x, y,}, board, coordinates);
    
    return showCell(board, coordinates);
  }
  

  const myTurn = (x, y) => {
    let tempBoard = currentBoard;
    if(currentBoard[y][x].value === 'X') {
      tempBoard[y][x].status = 'bomb';
      updateBombs(bombsFound + 1);
      updateBombed(true);
      updateGameOver(true);
    } else if (currentBoard[y][x].value > 0) {
      tempBoard[y][x].status = 'show';
    } else if (currentBoard[y][x].value === 0) {
      tempBoard = getList(x, y, currentBoard);
    }
    updateBoard(tempBoard);
    updateTurns(turns + 1);
  }


  return (
    <div>
      {gameOver && bombed && 
        <h3>
          GAME OVER! YOU LOSE ^^
        </h3>
      }
      {gameOver && !bombed && 
        <h3>
          GAME OVER! YOU WIN ^^
        </h3>
      }
      {!renderGame && <p> press start game! </p>}
      {renderGame && 
        <div>
          <h3>
            Current Number of Turns: {turns}
          </h3>
          <h3>
            Found {bombsFound} out of {bombs}
          </h3>
          <table>
            <tr>{xValues.map(x => (<th>{x}</th>))}</tr>
            {yValues.map((y) => (
              <tr>
                <td>{y}</td>
                {board[y].map((row, index) => (
                  <td className={`${row.status}`}><button onClick={() => myTurn(index, y)} disabled={gameOver || row.status === 'show'}>{row.value}</button></td>
                ))}
              </tr>
            ))}
          </table>
        </div>
      }
    </div>
  );
};

export default Board;