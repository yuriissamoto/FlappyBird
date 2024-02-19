
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird

let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.2;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //load images
    birdImg = new Image();
    birdImg.src = "./img/flappybird.png";
    birdImg.onload = function() {
        drawBird(); // Draw bird on the screen when the image is loaded
    }

    topPipeImg = new Image();
    topPipeImg.src = "./img/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./img/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1000); //every 1.5 seconds
    document.addEventListener("keydown", moveBird);
    board.addEventListener('click', moveBirdOnClick);
}

// Function to draw the bird on the screen
function drawBird() {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
   
}

// Adicione uma variável para controlar se o intervalo de atualização está em execução
let updateInterval;


// Function to move the bird when clicked on the screen
// Função para mover o pássaro quando clicado na tela
// Função para mover o pássaro quando clicado na tela
function moveBirdOnClick() {
    if (!gameOver) {
        velocityY = -5; // Define a velocidade do pulo do pássaro
    } else {
        startGame(); // Inicia um novo jogo se o jogo estiver encerrado
    }
}

// Function to update the game state
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Draw the bird on the screen
    drawBird();

    // Update the position of the bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);

    // Draw pipes and handle collisions
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // Clear off-screen pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Display the score
    updateScore();

    // Check for game over
    if (bird.y > board.height || gameOver) {
        gameOver = true;
        alert('Game Over! Score: ' + score);
        location.onload(); // Reload the page to restart the game
    }
}

// Function to update the score display
function updateScore() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.innerText = `Score: ${score}`;
    scoreDisplay.textContent = `Score: ${score}`;
}

// Function to place pipes on the screen
function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/8 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/2;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

// Function to move the bird when the space bar is pressed
// Função para mover o pássaro quando a tecla for pressionada
// Função para mover o pássaro quando a tecla for pressionada
function moveBird(e) {
    if (!gameOver && (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX")) {
        velocityY = -5; // Define a velocidade do pulo do pássaro
    } else {
        startGame(); // Inicia um novo jogo se o jogo estiver encerrado
    }
}

// Function to detect collisions between the bird and pipes
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// Função para iniciar um novo jogo
function startGame() {
    // Reinicia as variáveis do jogo
    gameOver = false;
    score = 0;
    bird.y = birdY;
    pipeArray = [];
    velocityY = 0; // Reinicia a velocidade do pássaro
    clearInterval(updateInterval); // Limpa o intervalo de atualização
    updateInterval = null; // Define o intervalo como nulo
}