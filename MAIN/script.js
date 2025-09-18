const boardEl = document.getElementById('board');
const cellTpl = document.getElementById('cellTpl');
const turnLabel = document.getElementById('turnLabel');
const currentPlayerLabel = document.getElementById('currentPlayerLabel');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const resultEl = document.getElementById('result');

const resetRoundBtn = document.getElementById('resetRound');
const resetAllBtn = document.getElementById('resetAll');
const nameXInput = document.getElementById('nameX');
const nameOInput = document.getElementById('nameO');

let board = Array(9).fill(null);
let current = 'X';
let running = true;
let scores = { X: 0, O: 0 };

function initBoard() {
  boardEl.innerHTML = '';
  board.forEach((val, idx) => {
    const cell = cellTpl.content.firstElementChild.cloneNode(true);
    cell.dataset.index = idx;
    cell.addEventListener('click', onCellClick);
    cell.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && !cell.disabled) {
        onCellClick({ currentTarget: cell });
      }
    });
    boardEl.appendChild(cell);
  });
  renderBoard();
}

function renderBoard() {
  [...boardEl.children].forEach((cell, idx) => {
    cell.textContent = board[idx] ?? '';
    cell.disabled = Boolean(board[idx]) || !running;
    cell.setAttribute('aria-label', board[idx] ? `Cell ${idx+1}: ${board[idx]}` : `Empty cell ${idx+1}`);
  });
}

function onCellClick(e) {
  const idx = Number(e.currentTarget.dataset.index);
  if (!running || board[idx]) return;

  board[idx] = current;
  renderBoard();

  const winPattern = checkWin();
  if (winPattern) {
    highlightWinningCells(winPattern);
    running = false;
    scores[current] += 1;
    updateScoresUI();
    const winnerName = displayName(current);
    showResult(`${winnerName} (${current}) wins!`, 'win');
    return;
  }

  if (checkDraw()) {
    running = false;
    showResult(`It's a draw!`, 'draw');
    return;
  }

  current = (current === 'X') ? 'O' : 'X';
  updateTurnLabel();
}

function checkWin() {
  const patterns = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diagonals
  ];
  for (const pattern of patterns) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return pattern;
    }
  }
  return null;
}

function checkDraw() {
  return board.every(Boolean);
}

function highlightWinningCells(pattern) {
  pattern.forEach(idx => {
    boardEl.children[idx].style.background = '#dcfce7';
  });
}

function updateTurnLabel() {
  currentPlayerLabel.textContent = current;
}

function updateScoresUI() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
}

function displayName(player) {
  const input = player === 'X' ? nameXInput : nameOInput;
  return input.value.trim() || player;
}

function showResult(msg, cls) {
  resultEl.textContent = msg;
  resultEl.hidden = false;
  resultEl.className = `result ${cls}`;
}

function resetRound() {
  board = Array(9).fill(null);
  current = 'X';
  running = true;
  resultEl.hidden = true;
  resultEl.className = 'result';
  initBoard();
  updateTurnLabel();
}

function resetAll() {
  if (!confirm("Reset ALL scores and names?")) return;
  scores = { X: 0, O: 0 };
  nameXInput.value = '';
  nameOInput.value = '';
  updateScoresUI();
  resetRound();
}

// Event listeners
resetRoundBtn.addEventListener('click', resetRound);
resetAllBtn.addEventListener('click', resetAll);

// Init
initBoard();
updateTurnLabel();
updateScoresUI();
