import './stylesheets';
import Board from './src/Board';

const board = new Board(
    document.querySelector('#grid-container'),
    document.querySelector('.toggle-state'),
    document.querySelector('#speed-slider'),
    document.querySelector('#size-slider')
);
window.addEventListener('load', () => board.makeTable());
document.getElementById('search').onclick = board.depthFirstSearch;
