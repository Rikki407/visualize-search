import './style.css';
import Board from './src/Board';

const board = new Board(document.body, 25);
board.makeTable();
document.getElementById('search-button').onclick = board.breadthFirstSearch;
