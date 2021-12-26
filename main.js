import './stylesheets/style.css';
import './stylesheets/neumorphic.css'
import Board from './src/Board';

window.addEventListener('load', () => {
    const board = new Board(
        document.querySelector('#grid-container'),
        document.querySelector('#toggle'),
        document.querySelector('#speed-slider'),
        document.querySelector('#size-slider')
    );
    board.makeTable();
    document.getElementById('search').onclick = () =>
        board.breadthFirstSearch();

    document.getElementById('select').onchange = ({ target }) => {
        document.getElementById('search').onclick = () => board[target.value]();
    };
});
