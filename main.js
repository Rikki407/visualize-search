import './stylesheets';
import Board from './src/Board';

const board = new Board(
    document.getElementById('grid-container'),
    document.querySelector('.toggle-state'),
    document.querySelector('#speed-slider'),
    document.querySelector('#size-slider')
);
board.makeTable();
document.getElementById('search').onclick = board.breadthFirstSearch;
