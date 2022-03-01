const board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

const p1s = document.getElementById("p1");
var p2s = document.getElementById("p2");

const size = 90;
const rows = 6;
const cols = 7;

let playerTurn = false;

const btn = document.getElementById("draw");
btn.addEventListener("click", () => drawBoard(board));

drawBoard(board);

function drawBoard(board) {

  const ctx = document.querySelector("canvas").getContext("2d");

  for (let y = 0; y < rows * size; y += size) {
    const cellY = board[y / size];
    for (let x = 0; x < cellY.length * size; x += size) {

      // draw grid
      const fillRect = false;
      ctx.rect(x, y, size, size);
      if (fillRect) {
        ctx.fill();
      }

      ctx.stroke();

      // draw cells
      let cell = cellY[x/size];

      let rgb = "rgb(255,255,255)";
      if (cell === 1) {
        rgb = "rgb(255,1,1)"
      }
      else if (cell === 2) {
        rgb = "rgb(1, 1, 255)";
      }

      ctx.fillStyle = rgb
      ctx.fillRect(5+x, 5+y, size-10, size-10);
    }
  }
}

function getPlayerCell() {
  if (playerTurn) {
    return 1;
  } else {
    return 2;
  }
}

function takeTurn() {
  playerTurn = !playerTurn;
}

function freeSpace(index) {
  return getCell(index, 0) === 0;
}

function getCell(x, y) {
  return board[y][x];
}

function setCell(x, y, n) {
  board[y][x] = n;
}

function insertAt(index) {
  let i = 0;

  while (i < rows - 1 && getCell(index, i + 1) === 0) {
    i++;
  }

  setCell(index, i, getPlayerCell())
}

function checkHorizontal(x, y, player) {
  if (x > 3) {
    return false;
  }

  for (let i = 0; i < 4; i++) {
    if (getCell(x + i, y) !== player) {
      return false;
    }
  }
  return true;
}

function checkVertical(x, y, player) {
  if (y > 2) {
    return false;
  }

  for (let i = 0; i < 4; i++) {
    if (getCell(x, y + i) !== player) {
      return false;
    }
  }

  return true;
}

function checkAcrossPos(x, y, player) {
  if (x > 3 || y < 3) {
    return false;
  }

  for(let i = 0; i < 4; i++) {
    if (getCell(x+i, y-i) !== player) {
      return false;
    }
  }

  return true;
}

function checkAcrossNeg(x, y, player) {
  if  (x < 3 || y < 3) {
    return false;
  }

  for(let i = 0; i < 4; i++) {
    if (getCell(x-i, y-i) !== player) {
      return false;
    }
  }

  return true;
}

function givePoint(player) {
  if (player === 1) {
    p1s.textContent++;
  } else {
    p2s.textContent++;
  }
}

async function winnerFound(player) {
  drawBoard(board);
  await sov(50);
  givePoint(player);
  alert("Winner: p" + player);
  clearBoard();

}

function clearBoard() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      setCell(x, y, 0);

    }
  }
  drawBoard(board);
}

function checkForWinner() {
  let player = getPlayerCell();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = getCell(x, y);
      if (cell !== 0) {
        let horizontalCount = checkHorizontal(x, y, player);
        let verticalCount = checkVertical(x, y, player);
        let acrossCountPos = checkAcrossPos(x, y, player);
        let acrossCountNeg = checkAcrossNeg(x, y, player);
        if (horizontalCount || verticalCount || acrossCountPos || acrossCountNeg) {
          winnerFound(player);
          return;
        }
      }
    }
  }
}

function choose(index) {
  if (freeSpace(index)) {
    insertAt(index);
    checkForWinner();
    takeTurn();
  }
  drawBoard(board);
}

function sov(ms) {
  return new Promise(func => setTimeout(func, ms));
}
