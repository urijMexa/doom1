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

    // Новый флаг для надежной регистрации попадания
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
    this.goblinHit = true; // Ставим true в начале, чтобы первый ход не засчитался как промах
    this.updateStats();
    this.gameLoop();
  }

  gameLoop() {
    // 1. Проверяем, был ли промах
    if (!this.goblinHit) {
      this.misses++;
      this.updateStats();
      if (this.isGameOver()) {
        this.endGame();
        return;
      }
    }

    // 2. Убираем гоблина со старой позиции
    if (this.gameBoard.cells[this.currentPosition]) {
      this.gameBoard.cells[this.currentPosition].innerHTML = '';
    }

    // 3. Сбрасываем флаг попадания для следующего цикла
    this.goblinHit = false;

    // 4. Находим новую случайную позицию и размещаем гоблина
    let newPosition;
    do {
      newPosition = Math.floor(Math.random() * this.gameBoard.cells.length);
    } while (newPosition === this.currentPosition);

    this.currentPosition = newPosition;
    this.gameBoard.cells[this.currentPosition].append(this.goblinElement);

    // 5. Планируем следующий вызов этого же цикла через 1 секунду
    this.timeoutId = setTimeout(this.gameLoop, 1000);
  }

  onCellClick(event) {
    if (!this.gameIsActive || this.goblinHit) {
      // Игнорируем клики, если игра не активна или по этому гоблину уже кликнули
      return;
    }

    const cell = event.target.closest('.cell');
    if (cell && cell.contains(this.goblinElement)) {
      // Успешное попадание!
      this.score++;
      this.updateStats();
      this.goblinHit = true; // Устанавливаем флаг

      // Немедленно убираем гоблина, чтобы нельзя было кликнуть дважды
      this.gameBoard.cells[this.currentPosition].innerHTML = '';

      // Мы НЕ трогаем таймер и НЕ вызываем gameLoop.
      // Игровой цикл сам разберется со всем по своему расписанию.
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
  } // SS
}
