let board;
const rowCount = 21;
const colCount = 19;
const tileSize = 32;
const boardWidth = colCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

//images
let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "X       bpo       X",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX" 
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;

const directions = ["U", "D", "L", "R"];
let score = 0;
let lives = 3;
let gameOver = false;

// Function to initialize the game
// This function will set up the game board, load images, and start the game loop
window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    loadImages();
    loadMap();
    console.log(walls.size);
    console.log(foods.size);
    console.log(ghosts.size);

    for (let ghost of ghosts.values()) {
        const randomDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(randomDirection);
    }

    update();
    document.addEventListener("keydown", movePacman);
}

// Function to load the map from the tileMap array
// This function will create Block objects for walls, foods, ghosts, and pacman 
function loadMap() {
    walls.clear();
    foods.clear();
    ghosts.clear();
    // Reset score and lives
    for (let r=0;r< rowCount; r++) {
        for (let c=0; c< colCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];

            const x = c* tileSize;  
            const y = r* tileSize;
            // Create Block objects based on the tileMap character
            if (tileMapChar === "X") {
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar === "P") {
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
            }
            else if (tileMapChar === "b") {
                const blueGhost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(blueGhost);
            }
            else if (tileMapChar === "o") {
                const orangeGhost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(orangeGhost);
            }
            else if (tileMapChar === "p") {
                const pinkGhost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(pinkGhost);
            }
            else if (tileMapChar === "r") {
                const redGhost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(redGhost);
            }
            else if (tileMapChar === " ") {
                const food = new Block(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }
        }
    }
}

// Function to load images for the game
// This function will create Image objects for ghosts, pacman, and walls
function loadImages() {
    blueGhostImage = new Image();
    blueGhostImage.src = "images/blueGhost.png";

    orangeGhostImage = new Image();
    orangeGhostImage.src = "images/orangeGhost.png";

    pinkGhostImage = new Image();
    pinkGhostImage.src = "images/pinkGhost.png";

    redGhostImage = new Image();
    redGhostImage.src = "images/redGhost.png";

    pacmanUpImage = new Image();
    pacmanUpImage.src = "images/pacmanUp.png";

    pacmanDownImage = new Image();
    pacmanDownImage.src = "images/pacmanDown.png";

    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "images/pacmanLeft.png";

    pacmanRightImage = new Image();  
    pacmanRightImage.src = "images/pacmanRight.png";
    
    wallImage = new Image();
    wallImage.src = "images/wall.png";   

}

// Function to update the game state
// This function will move pacman, draw the game board, and check for collisions
function update() {
    if (gameOver) {
        return; // Stop updating if the game is over
    }
    move();
    draw();
    setTimeout(update, 50);// Update every 50 milliseconds, 20 FPS

}

// Function to draw the game board
// This function will clear the canvas and draw pacman, ghosts, walls, and food
function draw() {
    // Clear the canvas
    context.clearRect(0, 0, boardWidth, boardHeight);
    // Draw the background
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    // Draw walls, ghosts, and food
    for (let ghost of ghosts.values()) {
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }
    for (let wall of walls.values()) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }
    context.fillStyle = "white";
    for (let food of foods.values()) {
        context.fillRect(food.x, food.y, food.width, food.height);
    }

    // Draw the score
    context.fillStyle = "white";
    context.font = "20px Arial";
    if (gameOver){
        context.fillStyle = "red";
        context.font = "40px Arial";
        context.fillText("Game Over!", boardWidth / 2 - 100, boardHeight / 2);
        context.font = "20px Arial";
        context.fillText("Final Score: " + score, boardWidth / 2 - 70, boardHeight / 2 + 30);
        context.fillText("Press Enter to restart", boardWidth / 2 - 80, boardHeight/ 2 + 60);
        return; // Stop drawing if the game is over
    } else {
        context.fillText("Score: " + score, 10, 20);    
        context.fillText("Lives: " + lives, boardWidth - 100, 20);
    }
}

// Function to move pacman
// This function will update pacman's position based on its velocity and check for collisions with walls
function move(){
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;
    // Check for collision with walls
    for (let wall of walls.values()) {
        if (checkCollision(pacman, wall)) {
            // Reset position to start position
            pacman.x -= pacman.velocityX; // Undo the last move
            pacman.y -= pacman.velocityY; // Undo the last move
            break; // Exit the loop after collision
        }
    }
    for (let ghost of ghosts.values()) {

        if (ghost.y == tileSize*9 && ghost.direction != 'U' && ghost.direction != 'D') {
            // If ghost is at row 9, change direction to up or down
            const rand = Math.random();
            if (rand < 0.3) {
                ghost.updateDirection("U");
            } else if (rand < 0.6) {
                ghost.updateDirection("D");
            }
            // else: do nothing, keep current direction
        }
        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;
        // Check for collision with walls
        for (let wall of walls.values()) {
            if (checkCollision(ghost, wall)) {
                // Reset position to start position
                ghost.x -= ghost.velocityX; // Undo the last move
                ghost.y -= ghost.velocityY; // Undo the last move
                ghost.updateDirection(directions[Math.floor(Math.random() * 4)]); // Change direction randomly
                break; // Exit the loop after collision
            }
        }
        // Check for collision with pacman
        if (checkCollision(pacman, ghost)) {
            // Game over logic can be added here
            lives -= 1; // Decrease lives by 1
            if (lives <= 0) {
                gameOver = true; // Set game over flag
            }
            resetPosition(); // Reset pacman's position
            console.log("Pacman collided with a ghost!");
            return; // Exit the function to stop further processing
        }
    }

    let foodEaten = null;
    // Check for collision with food
    for (let food of foods.values()) {
        if (checkCollision(pacman, food)) {
            // Remove the food from the set
            foods.delete(food);
            foodEaten = food; // Store the eaten food for score update
            score += 10;
            break; // Exit the loop after eating one food
        }
    }

    foods.delete(foodEaten); // Remove the eaten food from the set
    // Check if all food is eaten
    if (foods.size === 0) {
        loadMap(); // Reload the map if all food is eaten
        resetPosition(); // Reset pacman's position
    }
}


// Function to check for collision between two rectangles
// This function will return true if the rectangles overlap, false otherwise
function checkCollision(a,b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;    
}
// Function to move pacman based on keyboard input
function movePacman(event) {
    if (gameOver) {if (event.key === "Enter") {
            // Reset the game
            score = 0;
            lives = 3;
            gameOver = false;
            loadMap(); // Reload the map to reset the game state
            update(); // Restart the game loop
        }}
        // Check for arrow keys or WASD keys to change pacman's direction
        if (event.key === "ArrowUp" || event.key === "w") {
            pacman.updateDirection("U");
        } else if (event.key === "ArrowDown" || event.key === "s") {
            pacman.updateDirection("D");
        }
        else if (event.key === "ArrowLeft" || event.key === "a") {
            pacman.updateDirection("L");
        }
        else if (event.key === "ArrowRight" || event.key === "d") {
            pacman.updateDirection("R");
        }

        if (pacman.direction === "U") {
            pacman.image = pacmanUpImage;
        }
        else if (pacman.direction === "D") {
            pacman.image = pacmanDownImage;
        }
        else if (pacman.direction === "L") {
            pacman.image = pacmanLeftImage;
        }
        else if (pacman.direction === "R") {
            pacman.image = pacmanRightImage;
        }

        

}
// Function to reset pacman's position and ghosts' positions
function resetPosition() {
    pacman.reset();
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    for (let ghost of ghosts.values()) {
        ghost.reset();
        const randomDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(randomDirection); // Change direction randomly
    }
}


    

// Class to represent a block in the game
// This class will be used for walls, foods, ghosts, and pacman
class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;

        this.direction = "R"; // Default direction
        this.velocityX = 0;
        this.velocityY = 0;
    }
    // Method to update the direction of the block
    updateDirection(direction) {
        const prevDirection = this.direction;
        this.direction = direction
        this.updateVelocity();
        this.x += this.velocityX; // Update position based on new velocity  
        this.y += this.velocityY; // Update position based on new velocity

        for (let wall of walls.values()) {
            if (checkCollision(this, wall)) {
                // Reset position to start position
                this.x -= this.velocityX; // Update position based on new velocity  
                this.y -= this.velocityY; // Update position based on new velocity
                this.direction = prevDirection; // Revert to previous direction
                this.updateVelocity(); // Update velocity based on previous direction
                return; // Exit the loop after collision
            }
        }
    }
    // Method to update the velocity based on the current direction
    updateVelocity() {
        if (this.direction === "U") {
            this.velocityX = 0;
            this.velocityY = -tileSize/4; // Move up at 1/4 tile speed
        }
        else if (this.direction === "D") {
            this.velocityX = 0;
            this.velocityY = tileSize/4; // Move down at 1/4 tile speed
        }   
        else if (this.direction === "L") {
            this.velocityX = -tileSize/4; // Move left at 1/4 tile speed
            this.velocityY = 0;
        }
        else if (this.direction === "R") {
            this.velocityX = tileSize/4; // Move right at 1/4 tile speed
            this.velocityY = 0;
        }
    }
    // Method to reset the position of the block to its starting position
    reset(){
    this.x = this.startX;
    this.y = this.startY;
}
}