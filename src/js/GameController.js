import goblinImg from '../img/goblin.png';

export default class GameController {
  constructor(gameBoard) {
    this.gameBoard = gameBoard;
    this.score = 0;
    this.misses = 0;
    this.maxMisses = 5;
    this.currentPosition = -1;
    this.goblinElement = null;
    this.gameIsActive = false;
    this.timeoutId = null;
    this.goblinHit = false;

    this.onCellClick = this.onCellClick.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
  }

  init() {
    this.createGoblin();
    this.gameBoard.boardElement.addEventListener('click', this.onCellClick);
    document.getElementById('restart-button').addEventListener('click', () => this.restartGame());
    this.startGame();
  }

  createGoblin() {
    const goblin = document.createElement('img');
    goblin.src = goblinImg;
    goblin.classList.add('goblin');
    this.goblinElement = goblin;
  }

  startGame() {
    this.score = 0;
    this.misses = 0;
    this.currentPosition = -1;
    this.gameIsActive = true;
    this.goblinHit = true; // Ставим true, чтобы первый ход не засчитался как промах
    this.updateStats();
    this.gameLoop();
  }

  gameLoop() {
    if (!this.goblinHit) {
      this.misses++;
      this.updateStats();
      if (this.isGameOver()) {
        this.endGame();
        return;
      }
    }

    if (this.gameBoard.cells[this.currentPosition]) {
      this.gameBoard.cells[this.currentPosition].innerHTML = '';
    }

    this.goblinHit = false;

    let newPosition;
    do {
      newPosition = Math.floor(Math.random() * this.gameBoard.cells.length);
    } while (newPosition === this.currentPosition);

    this.currentPosition = newPosition;
    this.gameBoard.cells[this.currentPosition].append(this.goblinElement);

    this.timeoutId = setTimeout(this.gameLoop, 1000);
  }

  onCellClick(event) {
    if (!this.gameIsActive) {
      return;
    }

    const cell = event.target.closest('.cell');
    if (!cell) {
      return;
    }

    if (cell.contains(this.goblinElement)) {
      if (this.goblinHit) {
        return;
      }
      this.score++;
      this.updateStats();
      this.goblinHit = true;
      this.gameBoard.cells[this.currentPosition].innerHTML = '';
    } else {
      this.misses++;
      this.updateStats();
      if (this.isGameOver()) {
        this.endGame();
      }
    }
  }

  updateStats() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('misses').textContent = this.misses;
  }

  isGameOver() {
    return this.misses >= this.maxMisses;
  }

  endGame() {
    this.gameIsActive = false;
    clearTimeout(this.timeoutId);
    if (this.gameBoard.cells[this.currentPosition]) {
      this.gameBoard.cells[this.currentPosition].innerHTML = '';
    }
    document.getElementById('final-score').textContent = this.score;
    document.getElementById('game-over-modal').classList.add('active');
  }

  restartGame() {
    document.getElementById('game-over-modal').classList.remove('active');
    this.startGame();
  }
}
