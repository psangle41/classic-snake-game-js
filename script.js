const board = document.getElementById('board');
const instructionText = document.getElementById('instruction-text');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const gameOverText = document.getElementById('gameOver');

gameOverText.style.display = 'none';

const gridSize = 20;
let snake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
];
let food = generateFood();
let direction = 'RIGHT';
let gameInterval;
let gameStarted = false;
let gameOver = false;
let gameSpeedDelay = 200;
let highScore = 0;

function draw() {
  if (gameOver) return;
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

function drawSnake() {
  snake.forEach((segment, index) => {
    const snakeElement = createBoardElement('div', 'snake');
    setPosition(snakeElement, segment);
    if (index === 0) {
      const eyeElement = createBoardElement('div', 'eye');
      snakeElement.appendChild(eyeElement);
    }
    board.appendChild(snakeElement);
  });
}

function drawFood() {
  const foodElement = createBoardElement('div', 'food');
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

function createBoardElement(element, className = '') {
  const newElement = document.createElement(element);
  newElement.className = className;
  return newElement;
}

function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

function move() {
  if (gameOver) return; // Stop movement if the game is over

  const head = { ...snake[0] };
  switch (direction) {
    case 'UP':
      head.y--;
      break;
    case 'DOWN':
      head.y++;
      break;
    case 'LEFT':
      head.x--;
      break;
    case 'RIGHT':
      head.x++;
      break;
    default:
      break;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function startGame() {
  gameStarted = true;
  gameOver = false; // Reset the game over flag
  instructionText.style.display = 'none';
  gameOverText.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  board.innerHTML = ''; // Clear the board
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
  ];
  food = generateFood();
  direction = 'RIGHT'; // Correct case sensitivity
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (highScore < currentScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  gameOver = true; // Set the game over flag
  instructionText.style.display = 'block';
  board.innerHTML = ''; // Clear the board
  gameOverText.style.display = 'block';
}

function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') direction = 'UP';
        break;
      case 'ArrowDown':
        if (direction !== 'UP') direction = 'DOWN';
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') direction = 'LEFT';
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') direction = 'RIGHT';
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress);
