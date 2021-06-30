import React, {Component} from 'react';
import Board from './Board';
import './App.css';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 0,
      cols: 0, 
      bombs: 0,
      board: [],
      bombLocations: [],
    }
  }

  setSurrounding(rows, cols, x, y, board) {
    let updateBoard = board;
    for (let i = y - 1; i <= y + 1; i++) {
      for (let j = x - 1; j <= x + 1; j ++) {
        if (i < 0 || i > rows -1  || j < 0 || j > cols - 1 || board[i][j].value === 'X') {
          continue;
        }
        updateBoard[i][j].value++;
      }
    }
    return updateBoard;
  }

  addNumbers = (rows, cols, bombs) => {
    let board = [];
    for (let y = 0; y < cols; y++) {
      let row = [];
      for (let x = 0; x < rows; x++) {
        row.push({value: 0, status: 'hide'});
      }
      board.push(row);
    }

    let bombCount = 0;
    const locations = [];
    while (bombCount < bombs) {
      let x = Math.floor(Math.random() * cols);
      let y = Math.floor(Math.random() * rows);
      if (board[y][x].value > -1) {
        locations.push({x, y});
        board[y][x] = {value: 'X', status: 'hide'};
        board = this.setSurrounding(rows, cols, x, y, board);
        bombCount++;
      }
    }
    this.setState({bombLocations: locations});

    return board;
  }

  startGame = (rows = 10, cols = 10, bombs = 10) => {
    // perform error handling
    // rows/cols/bombs < 1, etc
    // only start game if game not in progress
    const startBoard = this.addNumbers(rows, cols, bombs);
    this.setState({
      rows, cols, bombs, board: startBoard,
    });
  }

  endGame = () => {
    this.setState({
      rows: 0,
      cols: 0, 
      bombs: 0,
      board: [],
      bombLocations: [],
    });
  }

  render() {
    const {rows, cols, bombs, board, bombLocations} = this.state;
    return (
      <body>
        <h1>
          MINESWEEPER
        </h1>
      <Board rows={rows} cols={cols} bombs={bombs} board={board} bombLocations={bombLocations} />
      <button onClick={() => this.startGame()}>Start Game</button>
      <button onClick={() => this.endGame()}>End Game</button>
      </body>
    );
  }
}

export default App;
