import './stylesheets/style.css';
import './stylesheets/neumorphic.css';
import Board from './src/Board';

const rootCSSKeys = [
    { '--main-color': { light: '#fd8421', dark: '#fd8421' } },
    { '--main-color-light': { light: '#f39b53', dark: '#f39b53' } },
    { '--main-color-shadow': { light: '#d16a15', dark: '#d16a15' } },
    { '--accent-color': { light: '#79e3b6', dark: '#79e3b6' } },
    { '--hole-neutral': { light: '#aeaecb', dark: '#aeaecb' } },
    { '--hole-light': { light: '#cbcbdb', dark: '#cbcbdb' } },
    { '--hole-shadow': { light: '#9595b0', dark: '#9595b0' } },
    {
        '--thumb-shine': {
            light: 'rgba(255, 255, 255, 0.4)',
            dark: 'rgba(190, 177, 177, 0.4)',
        },
    },
    { '--l-neutral': { light: '#dedeed', dark: '#303040' } },
    { '--l-light': { light: '#f1f1f7', dark: '#424255' } },
    { '--l-shadow': { light: '#aaa4c4', dark: '#151322' } },
    { '--l-object': { light: '#8f8fb5', dark: '#6d6d88' } },
];
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
    document.documentElement.style.setProperty('--hole-neutral', '#79e3b6');
});
