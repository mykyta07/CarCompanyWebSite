const backgroundColour = "black";
const forgroundColour = "white";
const boardWidth = 800;
const boardHeight = 440;

let paddle = {};
let ball = {};
let totalScore = 0;
let pause = true;
let rec = null;
let circ = null;
let score = null;

const canvas = document.getElementById("container");
const c = canvas.getContext("2d");

window.onload = function () {
  canvas.width = boardWidth;
  canvas.height = boardHeight;
  init();
};

const getRandomInt = function (min, max) {
  const randomInt = Math.floor(Math.random() * (max - min) + min);
  return randomInt === 0 ? 2 : randomInt;
};

const drawBoard = function () {
  c.fillStyle = backgroundColour;
  c.fillRect(0, 0, canvas.width, canvas.height);
};

const particle = function (x, y, dx, dy, r) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.r = r;
  this.colour = forgroundColour;
  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    c.fillStyle = this.colour;
    c.fill();
  };
  this.update = function () {
    if (this.x - this.r * 2 >= boardWidth - paddle.w - 5) {
      pause = true;
      saveScore(totalScore);
      totalScore = 0;
    }
    if (
      this.x + this.r > boardWidth - paddle.w - 6 &&
      this.y > Math.abs(paddle.y - paddle.h / 2) &&
      this.y < Math.abs(paddle.y + paddle.h / 2)
    ) {
      this.dx = -this.dx;
      totalScore += 1;
      paddle.h -= paddle.h / 10;
    }
    if (this.x - this.r <= 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.r >= boardHeight || this.y - this.r <= 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  };
};

const rectangle = function () {
  this.y = paddle.y;
  this.h = paddle.h;
  this.w = paddle.w;
  this.colour = forgroundColour;
  this.draw = function () {
    c.beginPath();
    c.rect(boardWidth - (this.w + 6), this.y - this.h / 2, this.w, this.h);
    c.fillStyle = this.colour;
    c.fill();
  };
  this.update = function () {
    this.h = paddle.h;
    this.y =
      paddle.y <= this.h / 2
        ? this.h / 2
        : paddle.y - this.h / 2 >= boardHeight - this.h
        ? boardHeight - this.h / 2
        : paddle.y;
    this.draw();
  };
};

const scoreText = function () {
  this.draw = function () {
    c.font = "20px sans-serif";
    c.fillStyle = forgroundColour;
    c.fillText(totalScore, boardWidth / 2 - (totalScore >= 10 ? 12 : 6), 25);
  };
  this.update = function () {
    this.draw();
  };
};

const init = function () {
  paddle = {
    w: 12,
    h: boardHeight / 4,
    y: boardHeight / 2,
  };
  ball = {
    r: 6,
    dx: getRandomInt(8, 12),
    dy: getRandomInt(-6, 6),
  };
  circ = new particle(
    boardWidth / 2 - ball.r / 2 - ball.dx / 2,
    boardHeight / 2 - ball.r / 2 - ball.dy / 2,
    ball.dx,
    ball.dy,
    ball.r
  );
  rec = new rectangle();
  score = new scoreText(totalScore);

  drawBoard();
  score.update();
  circ.update();
  rec.update();

  displayTopAndBottomScores();

  canvas.style.cursor = "pointer";

  window.addEventListener("mousemove", function (event) {
    const clientRect = canvas.getBoundingClientRect();
    paddle.y = event.y - clientRect.top;
  });

  window.addEventListener("click", launchGame);
};

const launchGame = function () {
  canvas.style.cursor = "none";
  pause = false;
  totalScore = 0;
  animate();
};

const animate = function () {
  c.clearRect(0, 0, boardWidth, boardHeight);
  window.removeEventListener("click", launchGame);
  drawBoard();
  score.update();
  circ.update();
  rec.update();
  pause === false ? window.requestAnimationFrame(animate) : init();
};

function saveScore(score) {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push(score);
  localStorage.setItem("scores", JSON.stringify(scores));
}

function getAllScores() {
  return JSON.parse(localStorage.getItem("scores")) || [];
}

function displayTopAndBottomScores() {
  let topScoresList = document.getElementById("topScoresList");
  let bottomScoresList = document.getElementById("bottomScoresList");

  topScoresList.innerHTML = "";
  bottomScoresList.innerHTML = "";

  let scores = getAllScores();
  scores.sort((a, b) => b - a);

  for (let i = 0; i < Math.min(3, scores.length); i++) {
    let listItem = document.createElement("li");
    listItem.textContent = "Найкращий топ " + (i + 1) + ": " + scores[i];
    topScoresList.appendChild(listItem);
  }

  for (let i = scores.length - 1; i >= Math.max(0, scores.length - 3); i--) {
    let listItem = document.createElement("li");
    listItem.textContent =
      "Найгірший " + (scores.length - i) + ": " + scores[i];
    bottomScoresList.appendChild(listItem);
  }
}
