'use strict';
import { wordList } from './wordList.js';

const typingArea = document.getElementById('typing_area');
let typeText = '';
let order = [];
let shuffledOrder = [];
const canvas = document.getElementById('goBoard');
const ctx = canvas.getContext('2d');

const boardSize = 14;
const gridSize = canvas.width / boardSize;
const stoneRadius = gridSize / 3;
const placedPositions = new Set();
let isFinished = false;

const stoneMap = new Map();
drawBoard();

setWordEnglish(1000, typingArea);
function setWordEnglish(keysCount, typingArea) {
    let shuffledWordList;
    shuffledWordList = fisherYatesShuffle(wordList);
    typeText = shuffledWordList.join(' ');
    typingArea.value = typeText.slice(0, keysCount);

    order = [];
    shuffledOrder = [];

    for (let i = 0; i < (keysCount * 2); i++) order.push(i);
    shuffledOrder = reorder(fisherYatesShuffle(order), keysCount);

    window.addEventListener('keydown', judgeKeys, false);

    return;
}

function judgeKeys(e) {
    e.preventDefault();
    let typedKey = e.key;
    let nextKey = typeText[0];

    if (typedKey === nextKey) {
        correctType(typedKey);
    } else {
        incorrectType(typedKey);
    }
}

function correctType(key) {
    typeText = typeText.slice(1);
    typingArea.value = typeText;
    if (key === ' ') placeRandomStones('b');
}

function incorrectType(key) {
    typingArea?.classList.add('missed');
    setTimeout(() => {
        typingArea?.classList.remove('missed');
    }, 1000);
}

function fisherYatesShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function reorder(array, cnt) {
    let result = [...array];
    let cnt2 = cnt * 2;
    for (let i = 0; i < array.length; i++) {
        let a = array[i];
        let b = (a + cnt) % cnt2;
        let aIndex = i;
        let bIndex = array.indexOf(b);
        if (a < b && aIndex > bIndex) {
            [result[aIndex], result[bIndex]] = [result[bIndex], result[aIndex]];
        }
    }
    return result;
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawBoard() {
    for (let i = 1; i < boardSize; i++) {
        drawLine(i * gridSize, gridSize, i * gridSize, canvas.height - gridSize);
        drawLine(gridSize, i * gridSize, canvas.width - gridSize, i * gridSize);
    }
    
    drawStars();
}

function drawStars() {
    const starPositions = [
        [4, 4], [4, 7], [4, 10],
        [7, 4], [7, 7], [7, 10],
        [10, 4], [10, 7], [10, 10],
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
        x = Math.floor(Math.random() * (boardSize - 1)) + 1;
        y = Math.floor(Math.random() * (boardSize - 1)) + 1;
    } while (placedPositions.has(`${x},${y}`));

    placedPositions.add(`${x},${y}`);
    stoneMap.set(`${x},${y}`, color);
    
    drawStone(x * gridSize, y * gridSize, color);

    const restult = checkFiveInARow();
    if (restult) {
        isFinished = true;
    }
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

const place = () => {
    if (!isFinished) {
        placeRandomStones('w');
        setTimeout(place, 100);
    }
}

setTimeout(place, 100);