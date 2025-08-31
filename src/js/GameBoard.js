export default class GameBoard {
  constructor(size = 4) {
    this.size = size;
    this.boardElement = document.getElementById('game-board');
    this.cells = [];
    this.drawBoard();
  }

  drawBoard() {
    this.boardElement.innerHTML = ''; // Очищаем поле перед отрисовкой
    this.cells = [];
    const cellCount = this.size ** 2;
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.id = i;
      this.boardElement.append(cell);
      this.cells.push(cell);
    }
  }
}
