# minesweeper

Minesweeper: Build a minesweeper game using React and Typescript. You can use any front-end library but it's not required. No need to sweat too much over on the pixel details. As long as it works and has a good structure to update the designs later is fine.

start game
- number of bombs, x and y lengths
- use -1 for bomb

give turn
- give x and y index to determine click
- search x, y to determine if bomb activated
- search surrounding x, y to determine number of adjacent bombs and display number
- activate all surrounding "safe" spaces
- display board after each turn

board design
{
  x: int,
  y: int,
  bombs: int,
  bombsFound: int,
  board: [[],...],
  gameOver: bool,
}


# FUTURE UPDATES could include
- allow user to choose # rows, columns, and bombs
- include error handling for user input
- dialog confirm box for activating a flagged cell (you flagged this cell as a bomb, are you sure you want to activate it?)
- update UI and formatting
- improve messaging
- remove context menu when right click for flag
- implement redux to keep state upon page refresh
