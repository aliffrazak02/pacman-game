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
}

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
    "O       bpo       O",
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

function loadMap() {
    walls.clear();
    foods.clear();
    ghosts.clear();

    for (let r=0;r< rowCount; r++) {
        for (let c=0; c< colCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];

            const x = c* tileSize;  
            const y = r* tileSize;

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

class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;
    }
}