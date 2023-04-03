const boardSize = 9;
const squareSize = 3;
const emptySquare = 0;

var board = [];

// Initialize the game board
function initBoard() {
  board = Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, () => ({
      value: emptySquare,
      inputValid: true,
    }))
  );
}

// Generate a new game board
function generateBoard() {
  const board = [];

  // Initialize the board with empty squares
  for (let row = 0; row < boardSize; row++) {
    board[row] = [];
    for (let col = 0; col < boardSize; col++) {
      board[row][col] = emptySquare;
    }
  }

  // Fill in the board with random numbers
  for (let row = 0; row < boardSize; row += squareSize) {
    for (let col = 0; col < boardSize; col += squareSize) {
      fillSquare(board, row, col);
    }
  }

  // Remove some squares to create the puzzle
  removeSquares(board);

  return board;
}

// Fill a 3x3 square with random numbers
function fillSquare(board, startRow, startCol) {
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let index = 0;
  for (let row = startRow; row < startRow + squareSize; row++) {
    for (let col = startCol; col < startCol + squareSize; col++) {
      if (index < nums.length) {
        board[row][col] = nums[index];
        index++;
      }
    }
  }
}

// Remove some squares from the board to create the puzzle
function removeSquares(board) {
  const numSquaresToRemove = Math.floor(Math.random() * 20) + 30; // remove between 30 and 50 squares
  for (let i = 0; i < numSquaresToRemove; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * boardSize);
      col = Math.floor(Math.random() * boardSize);
    } while (board[row][col] === emptySquare);
    board[row][col] = emptySquare;
  }
}

// Shuffle an array using the Fisher-Yates algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Render the game board
function renderBoard() {
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";

  for (let row = 0; row < boardSize; row++) {
    const divRow = document.createElement("div");
    divRow.classList.add("row");

    for (let col = 0; col < boardSize; col++) {
      const divSquare = document.createElement("div");
      divSquare.classList.add("square");
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.value =
        board[row][col].value !== emptySquare ? board[row][col].value : "";
      input.addEventListener("input", (event) => onInput(event, row, col));
      if (!board[row][col].inputValid) {
        divSquare.classList.add("invalid");
      }
      divSquare.appendChild(input);
      divRow.appendChild(divSquare);
    }

    gameBoard.appendChild(divRow);
  }
}

// Start a new game
function newGame() {
  initBoard();
  generateBoard();
  renderBoard();
}

// Check if the game board is valid
function checkBoard() {
  let isValid = true;

  // Check rows
  for (let row = 0; row < boardSize; row++) {
    const values = board[row].map((square) => square.value);
    if (!checkValues(values)) {
      isValid = false;
      markInvalidRow(row);
    }
  }

  // Check columns
  for (let col = 0; col < boardSize; col++) {
    const values = board.map((row) => row[col].value);
    if (!checkValues(values)) {
      isValid = false;
      markInvalidCol(col);
    }
  }

  // Check squares
  for (let row = 0; row < boardSize; row += squareSize) {
    for (let col = 0; col < boardSize; col += squareSize) {
      const values = [];
      for (let i = 0; i < squareSize; i++) {
        for (let j = 0; j < squareSize; j++) {
          values.push(board[row + i][col + j].value);
        }
      }
      if (!checkValues(values)) {
        isValid = false;
        markInvalidSquare(row, col);
      }
    }
  }

  if (isValid) {
    alert("Board is valid!");
  } else {
    alert("Board is not valid!");
  }
}

// Check if an array of values is valid (no duplicates except for empty squares)
function checkValues(values) {
  const nonEmptyValues = values.filter((value) => value !== emptySquare);
  return new Set(nonEmptyValues).size === nonEmptyValues.length;
}

// Mark a row as invalid
function markInvalidRow(row) {
  for (let col = 0; col < boardSize; col++) {
    board[row][col].inputValid = false;
  }
  renderBoard();
}

// Mark a column as invalid
function markInvalidCol(col) {
  for (let row = 0; row < boardSize; row++) {
    board[row][col].inputValid = false;
  }
  renderBoard();
}

// Mark a square as invalid
function markInvalidSquare(startRow, startCol) {
  for (let row = startRow; row < startRow + squareSize; row++) {
    for (let col = startCol; col < startCol + squareSize; col++) {
      board[row][col].inputValid = false;
    }
  }
  renderBoard();
}

// Handle user input
function onInput(event, row, col) {
  const value = event.target.value;
  if (/^[1-9]$/.test(value) || value === "") {
    board[row][col].value = value === "" ? emptySquare : parseInt(value);
    board[row][col].inputValid = true;
    renderBoard();
  } else {
    event.target.value =
      board[row][col].value !== emptySquare ? board[row][col].value : "";
  }
}

// Initialize the game
function init() {
  const newGameButton = document.getElementById("newGame");
  newGameButton.addEventListener("click", newGame);

  const checkBoardButton = document.getElementById("checkBoard");
  checkBoardButton.addEventListener("click", checkBoard);

  newGame();
}

// Start the game when the page loads
window.addEventListener("load", init);
