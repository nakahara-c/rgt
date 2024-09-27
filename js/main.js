const canvas = document.getElementById('goBoard');
const ctx = canvas.getContext('2d');

const boardSize = 12;
const gridSize = canvas.width / boardSize;
const stoneRadius = gridSize / 3;
const placedPositions = new Set();

const stoneMap = new Map();

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
    ctx.fillStyle = color==='b' ? '#000' : '#fff';
    ctx.fill();
}

function placeRandomStones(color) {
    let x, y;

    do {
        x = Math.floor(Math.random() * boardSize);
        y = Math.floor(Math.random() * boardSize);
    } while (placedPositions.has(`${x},${y}`));

    placedPositions.add(`${x},${y}`);
    stoneMap.set(`${x},${y}`, color);
    
    drawStone(x * gridSize, y * gridSize, color);
}

function checkFiveInARow() {
    const directions = [
        [1, 0],
        [0, 1],
        [1, 1],
        [-1, 1],
    ];

    for (let position of stoneMap.keys()) {
        const [x, y] = position.split(',').map(Number);
        const color = stoneMap.get(`${x},${y}`);
        
        for (let [dx, dy] of directions) {
            let count = 1;

            for (let step = 1; step < 5; step++) {
                const newX = x + dx * step;
                const newY = y + dy * step;

                if (stoneMap.get(`${newX},${newY}`) === color) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= 5) {
                console.log(`5つ連続しています: 色 ${color}, 始点 (${x}, ${y})`);
                return true;
            }
        }
    }
    return false;
}

drawBoard();
for (let i = 0; i < 10; i++) {
    placeRandomStones('b');
    placeRandomStones('w');
}

if (checkFiveInARow()) {
    console.log('5つ連続しました！');
} else {
    console.log('まだ5つ連続していません。');
}
