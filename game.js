const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("bestScore");
const overlay = document.getElementById("overlay");
const startButton = document.getElementById("startBtn");
const pauseButton = document.getElementById("pauseBtn");
const restartButton = document.getElementById("restartBtn");
const directionButtons = document.querySelectorAll("[data-direction]");

const cells = 20;
const cellSize = canvas.width / cells;
const tickMs = 110;
const bestScoreKey = "snake-best-score";

const directions = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

let snake;
let food;
let direction;
let nextDirection;
let score;
let bestScore;
let timerId;
let state;

function loadBestScore() {
  return Number.parseInt(window.localStorage.getItem(bestScoreKey) || "0", 10);
}

function saveBestScore(value) {
  window.localStorage.setItem(bestScoreKey, String(value));
}

function resetGame() {
  snake = [
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ];
  direction = directions.right;
  nextDirection = directions.right;
  score = 0;
  state = "ready";
  food = createFood();
  stopTimer();
  updateScore();
  setOverlay("按空格开始", "方向键或 WASD 控制移动，吃到食物会变长。", true);
  draw();
}

function startGame() {
  if (state === "running") {
    return;
  }

  if (state === "gameover") {
    resetGame();
  }

  state = "running";
  setOverlay("", "", false);
  stopTimer();
  timerId = window.setInterval(tick, tickMs);
}

function pauseGame() {
  if (state === "running") {
    state = "paused";
    stopTimer();
    setOverlay("已暂停", "按空格或点击开始继续游戏。", true);
    return;
  }

  if (state === "paused") {
    startGame();
  }
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function tick() {
  direction = nextDirection;
  const head = snake[0];
  const nextHead = {
    x: head.x + direction.x,
    y: head.y + direction.y,
  };

  if (hitsWall(nextHead) || hitsSnake(nextHead)) {
    endGame();
    return;
  }

  snake.unshift(nextHead);

  if (nextHead.x === food.x && nextHead.y === food.y) {
    score += 10;
    food = createFood();
    updateScore();
  } else {
    snake.pop();
  }

  draw();
}

function endGame() {
  state = "gameover";
  stopTimer();
  setOverlay("游戏结束", "按空格或点击重新开始再来一局。", true);
  draw();
}

function changeDirection(name) {
  const wanted = directions[name];
  if (!wanted) {
    return;
  }

  const isOpposite = wanted.x + direction.x === 0 && wanted.y + direction.y === 0;
  if (isOpposite) {
    return;
  }

  nextDirection = wanted;
  if (state === "ready") {
    startGame();
  }
}

function hitsWall(position) {
  return position.x < 0 || position.x >= cells || position.y < 0 || position.y >= cells;
}

function hitsSnake(position) {
  return snake.some((segment) => segment.x === position.x && segment.y === position.y);
}

function createFood() {
  let candidate;

  do {
    candidate = {
      x: Math.floor(Math.random() * cells),
      y: Math.floor(Math.random() * cells),
    };
  } while (snake.some((segment) => segment.x === candidate.x && segment.y === candidate.y));

  return candidate;
}

function updateScore() {
  bestScore = Math.max(bestScore, score);
  scoreElement.textContent = String(score);
  bestScoreElement.textContent = String(bestScore);
  saveBestScore(bestScore);
}

function setOverlay(title, message, visible) {
  overlay.classList.toggle("hidden", !visible);
  overlay.querySelector("h2").textContent = title;
  overlay.querySelector("p").textContent = message;
}

function draw() {
  drawBoard();
  drawFood();
  drawSnake();
}

function drawBoard() {
  ctx.fillStyle = "#0a110f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(238, 247, 241, 0.055)";
  ctx.lineWidth = 1;

  for (let i = 1; i < cells; i += 1) {
    const line = i * cellSize;
    ctx.beginPath();
    ctx.moveTo(line, 0);
    ctx.lineTo(line, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, line);
    ctx.lineTo(canvas.width, line);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    const inset = index === 0 ? 3 : 5;
    const x = segment.x * cellSize + inset;
    const y = segment.y * cellSize + inset;
    const size = cellSize - inset * 2;

    ctx.fillStyle = index === 0 ? "#9ed88f" : "#55b66c";
    roundRect(x, y, size, size, 7);
    ctx.fill();
  });
}

function drawFood() {
  const centerX = food.x * cellSize + cellSize / 2;
  const centerY = food.y * cellSize + cellSize / 2;

  ctx.fillStyle = "#ffcf5a";
  ctx.beginPath();
  ctx.arc(centerX, centerY, cellSize * 0.32, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

document.addEventListener("keydown", (event) => {
  const keyMap = {
    ArrowUp: "up",
    w: "up",
    W: "up",
    ArrowDown: "down",
    s: "down",
    S: "down",
    ArrowLeft: "left",
    a: "left",
    A: "left",
    ArrowRight: "right",
    d: "right",
    D: "right",
  };

  if (event.code === "Space") {
    event.preventDefault();
    state === "running" ? pauseGame() : startGame();
    return;
  }

  const mappedDirection = keyMap[event.key];
  if (mappedDirection) {
    event.preventDefault();
    changeDirection(mappedDirection);
  }
});

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", pauseGame);
restartButton.addEventListener("click", resetGame);

directionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    changeDirection(button.dataset.direction);
  });
});

bestScore = loadBestScore();
bestScoreElement.textContent = String(bestScore);
resetGame();
