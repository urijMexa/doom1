import '../css/style.css';
import GameBoard from './GameBoard';
import GameController from './GameController';

document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = new GameBoard(4);
    const gameController = new GameController(gameBoard);
    gameController.init();
});
