const canvas = document.getElementById('goBoard');
const ctx = canvas.getContext('2d');

const boardSize = 12;
const gridSize = canvas.width / boardSize;
const stoneRadius = gridSize / 3;

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawBoard() {
    for (let i = 0; i < boardSize; i++) {
        drawLine(i * gridSize, 0, i * gridSize, canvas.height);
        drawLine(0, i * gridSize, canvas.width, i * gridSize);
    }
    
    drawStars();
}

function drawStars() {
    const starPositions = [
        [3, 3], [3, 6], [3, 9],
        [6, 3], [6, 6], [6, 9],
        [9, 3], [9, 6], [9, 9],
    ];

    starPositions.forEach(pos => {
        const [x, y] = pos;
        drawStar(x * gridSize, y * gridSize);
    });
}

function drawStar(x, y) {
    const starRadius = 5;
    ctx.beginPath();
    ctx.arc(x, y, starRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
}

function drawStone(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, stoneRadius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function placeRandomStones(numStones) {
    const placedPositions = new Set();

    for (let i = 0; i < numStones; i++) {
        let x, y;

        do {
            x = Math.floor(Math.random() * boardSize);
            y = Math.floor(Math.random() * boardSize);
        } while (placedPositions.has(`${x},${y}`));

        placedPositions.add(`${x},${y}`);

        const color = Math.random() < 0.5 ? 'black' : 'white';
        
        drawStone(x * gridSize, y * gridSize, color);
    }
}

drawBoard();
placeRandomStones(20);
