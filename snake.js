// Game configuration
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{x: 10, y: 10}];
let food = getRandomFood();
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 10;
let gameLoop;

// Colors
const SNAKE_COLOR = '#2ecc71';
const FOOD_COLOR = '#e74c3c';
const BACKGROUND_COLOR = '#34495e';

// Event Listeners
document.addEventListener('keydown', changeDirection);

// Game Functions
function drawGame() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
}

function clearCanvas() {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = SNAKE_COLOR;
    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * gridSize, 
            segment.y * gridSize, 
            gridSize - 2, 
            gridSize - 2
        );
    });
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        food = getRandomFood();
    } else {
        snake.pop();
    }
}

function drawFood() {
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(
        food.x * gridSize, 
        food.y * gridSize, 
        gridSize - 2, 
        gridSize - 2
    );
}

function getRandomFood() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function checkCollision() {
    // Wall collision
    if (
        snake[0].x < 0 || 
        snake[0].x >= tileCount || 
        snake[0].y < 0 || 
        snake[0].y >= tileCount
    ) {
        gameOver();
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (
            snake[i].x === snake[0].x && 
            snake[i].y === snake[0].y
        ) {
            gameOver();
        }
    }
}

function gameOver() {
    clearInterval(gameLoop);
    gameOverElement.style.display = 'block';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2);
}

function startGame() {
    // Reset game state
    snake = [{x: 10, y: 10}];
    food = getRandomFood();
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = 'Score: 0';
    gameOverElement.style.display = 'none';

    // Start game loop
    gameLoop = setInterval(drawGame, 1000 / gameSpeed);
}

// Start the game
startGame();