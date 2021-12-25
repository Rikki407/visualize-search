import './stylesheets';
import Board from './src/Board';

window.addEventListener('load', () => {
    const board = new Board(
        document.querySelector('#grid-container'),
        document.querySelector('#toggle'),
        document.querySelector('#speed-slider'),
        document.querySelector('#size-slider')
    );
    board.makeTable();
    document.getElementById('search').onclick = () => board.depthFirstSearch();
});
