// maze.js

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 20;
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);
const maze = createMaze(rows, cols);
const player = { row: 1, col: 1 };
const start = { row: 1, col: 1 };
const end = { row: rows - 2, col: cols - 2 };
let congratsAnimationId;

function createMaze(rows, cols) {
  const maze = new Array(rows);
  for (let i = 0; i < rows; i++) {
    maze[i] = new Array(cols).fill(true);
  }
  return maze;
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (maze[i][j]) {
        ctx.fillStyle = '#fff';
      } else {
        ctx.fillStyle = '#000';
      }
      ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }

  // Draw start and end points
  ctx.fillStyle = 'green';
  ctx.fillRect(start.col * cellSize, start.row * cellSize, cellSize, cellSize);

  ctx.fillStyle = 'red';
  ctx.fillRect(end.col * cellSize, end.row * cellSize, cellSize, cellSize);

  // Draw player
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.col * cellSize, player.row * cellSize, cellSize, cellSize);
}

function generateMaze(row, col) {
  maze[row][col] = false;

  const directions = [
    { row: -2, col: 0 },
    { row: 0, col: 2 },
    { row: 2, col: 0 },
    { row: 0, col: -2 }
  ];

  directions.sort(() => Math.random() - 0.5);

  for (const direction of directions) {
    const newRow = row + direction.row;
    const newCol = col + direction.col;

    if (newRow > 0 && newRow < rows && newCol > 0 && newCol < cols && maze[newRow][newCol]) {
      maze[row + direction.row / 2][col + direction.col / 2] = false;
      generateMaze(newRow, newCol);
    }
  }
}

function movePlayer(event) {
  switch (event.key) {
    case 'ArrowUp':
      if (player.row > 0 && !maze[player.row - 1][player.col]) {
        player.row -= 1;
      }
      break;
    case 'ArrowDown':
      if (player.row < rows - 1 && !maze[player.row + 1][player.col]) {
        player.row += 1;
      }
      break;
    case 'ArrowLeft':
      if (player.col > 0 && !maze[player.row][player.col - 1]) {
        player.col -= 1;
      }
      break;
    case 'ArrowRight':
      if (player.col < cols - 1 && !maze[player.row][player.col + 1]) {
        player.col += 1;
      }
      break;
  }

  if (player.row === end.row && player.col === end.col) {
    congratulatePlayer();
  }

  drawMaze();
}

function congratulatePlayer() {
  clearInterval(congratsAnimationId);
  congratsAnimationId = setInterval(() => {
    document.body.style.backgroundColor = getRandomColor();
  }, 200);
  setTimeout(() => {
    clearInterval(congratsAnimationId);
    document.body.style.backgroundColor = '#fff';
    alert('Congratulations! You completed the maze!');
  }, 3000);
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function init() {
  generateMaze(1, 1);
  drawMaze();
  document.addEventListener('keydown', movePlayer);
}

init();
