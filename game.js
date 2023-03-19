const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];
let currentPlayer = 'X';
let leaderboard = {
  players: []
};

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(100, 0);
  ctx.lineTo(100, 300);
  ctx.moveTo(200, 0);
  ctx.lineTo(200, 300);
  ctx.moveTo(0, 100);
  ctx.lineTo(300, 100);
  ctx.moveTo(0, 200);
  ctx.lineTo(300, 200);
  ctx.stroke();

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = board[row][col];
      if (cell !== '') {
        ctx.fillText(cell, col * 100 + 50, row * 100 + 70);
      }
    }
  }
}

function makeMove(row, col) {
  if (board[row][col] === '') {
    board[row][col] = currentPlayer;
    drawBoard();
    const winner = checkWin();
    if (winner) {
      alert(`Player ${winner} wins!`);
      updateLeaderboard(winner, 'win');
      resetGame();
      return;
    }
    if (checkDraw()) {
      alert(`It's a draw!`);
      updateLeaderboard(currentPlayer, 'draw');
      resetGame();
      return;
    }
    switchPlayer();
  }
}

function switchPlayer() {
  if (currentPlayer === 'X') {
    currentPlayer = 'O';
  } else {
    currentPlayer = 'X';
  }
}

function checkWin() {
  // Check rows
  for (let row = 0; row < 3; row++) {
    if (board[row][0] !== '' && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
      return board[row][0];
    }
  }
  // Check columns
  for (let col = 0; col < 3; col++) {
    if (board[0][col] !== '' && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
      return board[0][col];
    }
  }
  // Check diagonals
  if (board[0][0] !== '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return board[0][0];
  }
  if (board[0][2] !== '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return board[0][2];
  }
  return null;
}


function checkDraw() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === '') {
        return false;
      }
    }
  }
  return true;
}

function resetGame() {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  currentPlayer = 'X';
  drawBoard();
  updateLeaderboardTable();
}

function updateLeaderboard(player, result) {
  let playerIndex = leaderboard.players.findIndex(p => p.name === player);
  if (playerIndex === -1) {
    // Player not in leaderboard, add them
    leaderboard.players.push({
      name: player,
      wins: 0,
      losses: 0,
      draws: 0
    });
    playerIndex = leaderboard.players.length - 1;
  }
  if (result === 'win') {
    leaderboard.players[playerIndex].wins++;
  } 
  else if (result === 'loss') {
    leaderboard.players[playerIndex].losses++;
  } 
  else {
    leaderboard.players[playerIndex].draws++;
  }
  saveLeaderboard();
}

function saveLeaderboard() {
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function loadLeaderboard() {
  const leaderboardString = localStorage.getItem('leaderboard');
  if (leaderboardString) {
    leaderboard = JSON.parse(leaderboardString);
  }
}

loadLeaderboard();
drawBoard();

canvas.addEventListener('click', function(event) {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  const row = Math.floor(y / 100);
  const col = Math.floor(x / 100);
  makeMove(row, col);
});

function updateLeaderboardTable() {
  const leaderboardTable = document.getElementById('leaderboard');
  leaderboardTable.innerHTML = '';
  for (const player of leaderboard.players) {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = player.name;
    row.appendChild(nameCell);
    const winsCell = document.createElement('td');
    winsCell.textContent = player.wins;
    row.appendChild(winsCell);
    const lossesCell = document.createElement('td');
    lossesCell.textContent = player.losses;
    row.appendChild(lossesCell);
    const drawsCell = document.createElement('td');
    drawsCell.textContent = player.draws;
    row.appendChild(drawsCell);
    leaderboardTable.appendChild(row);
  }
}

updateLeaderboardTable();
