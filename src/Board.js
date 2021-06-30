import React, {useEffect, useState} from 'react';

export const Board = props => {
  const {
    rows,
    cols, 
    bombs,
    board,
    bombLocations,
  } = props;

  const [renderGame, shouldRenderGame] = useState(false);
  const [gameOver, updateGameOver] = useState(false);
  const [bombed, updateBombed] = useState(false);
  const [bombsFound, updateBombs] = useState(0);
  const [flags, updateFlags] = useState([]);
  const [currentBoard, updateBoard] = useState(board);
  const [turns, updateTurns] = useState(0);

  useEffect(() => {
    shouldRenderGame(rows > 0 && cols > 0 && bombs > 0);
    updateGameOver(false);
    updateBombed(false);
    updateBombs(0);
    updateTurns(0);
    updateBoard(board);
    updateFlags([]);
  }, [rows, cols, bombs]);

  const xValues = [''];
  const yValues = [];

  for (let x = 0; x < cols; x++) {
    xValues.push(x);
  }
  
  for (let y = 0; y < rows; y++) {
    yValues.push(y);
  }

  const showCell = (board, list) => {
    const tempBoard = board;
    for (let index in list) {
      const coor = list[index];
      tempBoard[coor.y][coor.x].status = 'show';
    }
    return tempBoard;
  }

  const arrayChecker = (arr, obj) => {
    return arr.some((item) => JSON.stringify(item) === JSON.stringify(obj));
  }

  const getSurroundings = (coor, board, checked, unchecked) => {
    const {x, y} = coor;
    const tempChecked = checked ? checked : [];
    const tempUnchecked = unchecked ? unchecked : [];
    tempChecked.push(coor);
    for (let i = y - 1; i <= y + 1; i++) {
      for (let j = x - 1; j <= x + 1; j ++) {
        if (i < 0 || i > rows - 1 || j < 0 || j > cols - 1) {
          continue;
        }
        const obj = {x: j, y: i};
        if (!arrayChecker(tempChecked, obj) && !arrayChecker(tempUnchecked, obj)) {
          if (board[i][j].value > 0) {
            tempChecked.push(obj);
          } else {
            tempUnchecked.push(obj);
          }
        }
      }
    }

    if (tempUnchecked.length === 0) {
      return tempChecked;
    } else {
      const newCoor = tempUnchecked[0];
      tempUnchecked.shift();
      return getSurroundings(newCoor, board, tempChecked, tempUnchecked);
    }
  }

  const getList = (x, y , board) => {
    const start = {x, y};
    const coordinates = getSurroundings(start, board);
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

  const flagCell = (x, y) => {
    let tempBoard = currentBoard;
    const coor = {x, y};
    if (tempBoard[y][x].status === 'hide') {
      tempBoard[y][x].status = 'flag';
      updateBombs(bombsFound + 1);
      if (arrayChecker(bombLocations, coor)) {
        flags.push(coor);
        if (bombs - flags.length === 0) {
          updateGameOver(true);
        }
      }
    } else {
      tempBoard[y][x].status = 'hide';
      updateBombs(bombsFound - 1);
      if (arrayChecker(bombLocations, coor)) {
        const index = flags.findIndex((mark) => JSON.stringify(mark) === JSON.stringify(coor));
        flags.splice(index, 1);
      }
    }
    updateBoard(tempBoard);
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
                  <td className={`${row.status}`}><button onClick={() => myTurn(index, y)} onContextMenu={() => flagCell(index, y)} disabled={gameOver || row.status === 'show'}>{row.status !== 'show' ? '?' : row.value}</button></td>
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