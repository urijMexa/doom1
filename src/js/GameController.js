export class GameController {
  constructor(board, goblin) {
    this.board = board;
    this.goblin = goblin;
    this.score = 0;
    this.misses = 0;
    this.maxMisses = 5;
    this.isGameActive = true;
    this.timer = null;
    this.goblinTimeout = null;

    this.scoreElement = document.getElementById('score');
    this.missesElement = document.getElementById('misses');
    this.modal = document.getElementById('gameModal');
    this.modalMessage = document.getElementById('modalMessage');
    this.restartButton = document.getElementById('restartButton');

    this.init();
  }

  init() {
    this.updateUI();
    this.startGame();

    this.restartButton.addEventListener('click', () => {
      this.restartGame();
    });
  }

  startGame() {
    this.timer = setInterval(() => {
      if (!this.isGameActive) return;
      this.moveGoblin();
    }, 1000);
  }

  moveGoblin() {
    // Очищаем предыдущий таймаут
    if (this.goblinTimeout) {
      clearTimeout(this.goblinTimeout);
    }

    if (!this.goblin.move()) {
      this.handleMiss();
      return;
    }

    // Устанавливаем таймаут для автоматического скрытия гоблина через 1 секунду
    this.goblinTimeout = setTimeout(() => {
      if (this.isGameActive && this.goblin.isVisible) {
        this.handleMiss(); // Промах если гоблин не был кликнут
        this.goblin.hide();
      }
    }, 1000);
  }

  handleCellClick(index) {
    if (!this.isGameActive) return;

    if (this.goblin.currentPosition === index && this.goblin.isVisible) {
      this.handleHit();
    } else {
      this.handleMissClick();
    }
  }

  handleHit() {
    // Очищаем таймаут скрытия гоблина
    if (this.goblinTimeout) {
      clearTimeout(this.goblinTimeout);
    }

    this.score++;
    this.goblin.hide();
    this.updateUI();
  }

  handleMiss() {
    this.misses++;
    this.updateUI();

    if (this.misses >= this.maxMisses) {
      this.endGame();
    }
  }

  handleMissClick() {
    this.handleMiss();
  }

  updateUI() {
    this.scoreElement.textContent = `Score: ${this.score}`;
    this.missesElement.textContent = `Misses: ${this.misses}/${this.maxMisses}`;
  }

  endGame() {
    this.isGameActive = false;
    clearInterval(this.timer);

    if (this.goblinTimeout) {
      clearTimeout(this.goblinTimeout);
    }

    this.modalMessage.textContent = `Game Over! Your score: ${this.score}`;
    this.modal.style.display = 'block';
  }

  restartGame() {
    this.score = 0;
    this.misses = 0;
    this.isGameActive = true;

    clearInterval(this.timer);
    if (this.goblinTimeout) {
      clearTimeout(this.goblinTimeout);
    }

    this.modal.style.display = 'none';
    this.goblin.hide();
    this.updateUI();
    this.startGame();
  }
}
