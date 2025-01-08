const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = generateFood();
let score = 0;
let level = 1;
let gameSpeed = 200;
let isGameRunning = false;

const gameOverScreen = document.getElementById("game-over");
const startScreen = document.getElementById("game-start");
const restartButton = document.getElementById("restart-button");
const startButton = document.getElementById("start-button");
const countdownScreen = document.getElementById("countdown");
const countdownNumber = document.getElementById("countdown-number");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");

restartButton.addEventListener("click", resetGame);
startButton.addEventListener("click", startGame);

document.addEventListener("keydown", changeDirection);

function gameLoop() {
    if (!isGameRunning) return;

    moveSnake();

    if (checkCollision()) {
        endGame();
        return;
    }

    if (checkFoodCollision()) {
        growSnake();
        food = generateFood();
        score++;
        if (score % 5 === 0) {
            level++;
            gameSpeed = Math.max(50, gameSpeed - 20);
        }
        updateUI();
    }

    draw();
    setTimeout(gameLoop, gameSpeed);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    ctx.fillStyle = "#333";
    for (let x = 0; x < canvas.width; x += 20) {
        for (let y = 0; y < canvas.height; y += 20) {
            ctx.fillRect(x, y, 20, 20);
            ctx.strokeStyle = "#222";
            ctx.strokeRect(x, y, 20, 20);
        }
    }

    // Draw Snake
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });

    // Draw Food
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x * 20 + 10, food.y * 20 + 10, 10, 0, Math.PI * 2);
    ctx.fill();
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    snake.pop();
}

function changeDirection(event) {
    const key = event.key;
    if (key === "ArrowUp" && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (key === "ArrowDown" && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (key === "ArrowLeft" && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (key === "ArrowRight" && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width / 20 || head.y < 0 || head.y >= canvas.height / 20) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function checkFoodCollision() {
    const head = snake[0];
    const dx = Math.abs(head.x - food.x);
    const dy = Math.abs(head.y - food.y);
    return dx <= 1 && dy <= 1;
}

function growSnake() {
    const tail = snake[snake.length - 1];
    snake.push({ ...tail });
}

function generateFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * 30);
        y = Math.floor(Math.random() * 30);
    } while (snake.some(segment => segment.x === x && segment.y === y));
    return { x, y };
}

function updateUI() {
    scoreDisplay.textContent = `점수: ${score}`;
    levelDisplay.textContent = `레벨: ${level}`;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = generateFood();
    score = 0;
    level = 1;
    gameSpeed = 200;
    isGameRunning = true;
    updateUI();
    gameOverScreen.classList.add("hidden");
    gameLoop();
}

function startGame() {
    startScreen.classList.add("hidden"); // 시작 화면 숨기기
    let countdown = 3;
    countdownNumber.textContent = countdown;
    countdownScreen.classList.remove("hidden");

    const countdownInterval = setInterval(() => {
        countdown--;
        countdownNumber.textContent = countdown;

        if (countdown === 0) {
            clearInterval(countdownInterval);
            countdownScreen.classList.add("hidden");
            isGameRunning = true;
            gameLoop();
        }
    }, 1000);
}

function endGame() {
    isGameRunning = false;
    gameOverScreen.classList.remove("hidden");
    document.getElementById("final-score").textContent = score;
}

// 초기화
resetGame();
