import './stylesheets/style.css';
import './stylesheets/neumorphic.css';
import Board from './src/board';

const rootCSSKeys = [
    { key: '--main-color', light: '#fd8421', dark: '#79e3b6' },
    { key: '--main-color-light', light: '#f39b53', dark: '#a8f7d6' },
    { key: '--main-color-shadow', light: '#d16a15', dark: '#5cb891' },
    { key: '--accent-color', light: '#fd8421', dark: '#79e3b6' },
    { key: '--hole-neutral', light: '#aeaecb', dark: '#aeaecb' },
    { key: '--hole-light', light: '#cbcbdb', dark: '#cbcbdb' },
    { key: '--hole-shadow', light: '#9595b0', dark: '#9595b0' },
    {
        key: '--thumb-shine',
        light: 'rgba(255, 255, 255, 0.4)',
        dark: 'rgba(190, 177, 177, 0.4)',
    },
    { key: '--l-neutral', light: '#dedeed', dark: '#303040' },
    { key: '--l-light', light: '#f1f1f7', dark: '#424255' },
    { key: '--l-shadow', light: '#aaa4c4', dark: '#151322' },
    { key: '--l-object', light: '#8f8fb5', dark: '#9d9da7' },
];

let lightTheme = false;
const themeButton = document.getElementById('theme');
themeButton.onclick = () => {
    lightTheme = !lightTheme;
    themeButton.firstElementChild.classList.toggle('fa-sun');
    themeButton.firstElementChild.classList.toggle('fa-moon');
    rootCSSKeys.forEach(({ key, light, dark }) =>
        document.documentElement.style.setProperty(
            key,
            lightTheme ? light : dark
        )
    );
};

window.addEventListener('load', () => {
    const board = new Board(
        document.getElementById('grid-container'),
        document.getElementById('toggle'),
        document.getElementById('speed-slider'),
        document.getElementById('size-slider'),
        document.getElementById('w-slider')
    );
    board.makeTable();

    document.getElementById('search').onclick = () =>
        board.breadthFirstSearch();

    document.getElementById('select').onchange = ({ target }) => {
        document.getElementById('search').onclick = () => board[target.value]();
        document
            .getElementById('heuristic')
            .setAttribute(
                'style',
                `display: ${target.value === 'aStarSearch' ? 'flex' : 'none'};`
            );
    };
});
