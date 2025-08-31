import goblinImg from '../img/goblin.png';

export default class GameController {
  constructor(gameBoard) {
    this.gameBoard = gameBoard;
    this.score = 0;
    this.misses = 0;
    this.maxMisses = 5;
    this.currentPosition = -1;
    this.goblinElement = null;
    this.intervalId = null;

    // Привязываем методы к контексту
    this.onCellClick = this.onCellClick.bind(this);
    this.moveGoblin = this.moveGoblin.bind(this);
  }

  init() {
    this.createGoblin();
    this.gameBoard.boardElement.addEventListener('click', this.onCellClick);
    document.getElementById('restart-button')
      .addEventListener('click', () => this.restartGame());
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
    this.updateStats();
    this.intervalId = setInterval(this.moveGoblin, 1000);
  }

  moveGoblin() {
    if (this.currentPosition !== -1) {
      this.misses++;
      this.updateStats();
      if (this.isGameOver()) {
        this.endGame();
        return;
      }
    }

    // Удаляем гоблина из старой ячейки
    if (this.gameBoard.cells[this.currentPosition]) {
      this.gameBoard.cells[this.currentPosition].innerHTML = '';
    }

    let newPosition;
    do {
      newPosition = Math.floor(Math.random() * this.gameBoard.cells.length);
    } while (newPosition === this.currentPosition);

    this.currentPosition = newPosition;
    this.gameBoard.cells[this.currentPosition].append(this.goblinElement);
  }

  onCellClick(event) {
    const cell = event.target.closest('.cell');
    if (!cell) return;

    if (cell.contains(this.goblinElement)) {
      this.score++;
      this.goblinElement.remove();
      this.currentPosition = -1; // Сбрасываем позицию, чтобы не засчитать промах
      clearInterval(this.intervalId); // Сбрасываем таймер
      this.updateStats();
      this.moveGoblin(); // Сразу перемещаем гоблина
      this.intervalId = setInterval(this.moveGoblin, 1000); // И запускаем таймер заново
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
    clearInterval(this.intervalId);
    this.gameBoard.boardElement.removeEventListener('click', this.onCellClick);
    document.getElementById('final-score').textContent = this.score;
    document.getElementById('game-over-modal')
      .classList
      .add('active');
  }

  restartGame() {
    document.getElementById('game-over-modal')
      .classList
      .remove('active');
    this.gameBoard.boardElement.addEventListener('click', this.onCellClick);
    this.startGame();
  }
}
