import Algorithms from './algorithms';
import Cell from './cell';
import colors from './colors';
// import { PriorityQueue } from './utility';

class Board {
    constructor(parent, toggle, speedSlider, sizeSlider) {
        this.parent = parent;
        this.toggle = toggle;
        this.grid = new Map();
        this.start = null;
        this.end = null;
        this.elements = [];
        this.speed = parseInt(speedSlider.value);
        this.cellSize = parseInt(sizeSlider.value);
        Algorithms.call(
            this,
            this.start,
            this.goal,
            this.rows,
            this.cols,
            this.explore
        );
        window.addEventListener('resize', () => this.updateTable());
        speedSlider.addEventListener(
            'input',
            ({ target }) => (this.speed = parseInt(target.value))
        );
        sizeSlider.addEventListener('input', ({ target }) => {
            this.cellSize = parseInt(target.value);
            this.updateTable();
        });
        const startColor = { r: 255, g: 0, b: 0 }; // red
        const endColor = { r: 0, g: 128, b: 128 }; // dark turquoise
        this.fade('background-color', startColor, endColor, 1000);
    }
    getElement(cell) {
        return this.grid.get(`${cell.row}-${cell.col}`);
    }
    setElement(row, col, values) {
        this.grid.set(`${row}-${col}`, { ...values });
    }
    makeTable() {
        this.rows = Math.round(this.parent.clientHeight / (this.cellSize - 1));
        this.cols = Math.floor(window.innerWidth / this.cellSize);
        const table = document.createElement('table');
        table.setAttribute('cellspacing', 1);
        for (let i = 0; i < this.rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < this.cols; j++) {
                const td = document.createElement('td');
                this.styleNormal(td);
                td.addEventListener('click', () => this.onClick(i, j));
                this.setElement(i, j, {
                    explored: 0,
                    td,
                });
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        this.table = table;
        this.parent.appendChild(this.table);
    }

    updateTable() {
        if (this.parent.contains(this.table)) {
            this.parent.removeChild(this.table);
            this.makeTable();
        }
    }

    onClick(row, col, action = !this.toggle.checked ? 'start' : 'goal') {
        if (this[action]) this.styleNormal(this.getElement(this[action]).td);
        this[action] = new Cell(row, col);
        const { td } = this.getElement(this[action]);
        action === 'start' ? this.styleStart(td) : this.styleGoal(td);
    }

    explore(cell) {
        const { td, explored } = this.getElement(cell);
        this.styleExplore(td, explored);
        this.setElement(cell.row, cell.col, {
            explored: explored + 1,
            td,
        });
        return new Promise((res) => setTimeout(res, this.speed));
    }

    styleNormal(td) {
        td.setAttribute(
            'style',
            `height:${this.cellSize - 4}px;
            width:${this.cellSize - 2}px;
            cursor: pointer;
            background-color:${colors.NORMAL};`
        );
    }
    styleStart(td) {
        td.setAttribute(
            'style',
            `height:${this.cellSize - 4}px;
            width:${this.cellSize - 2}px;
            cursor: pointer;background: ${colors.START};`
        );
    }
    styleGoal(td) {
        td.setAttribute('style', `background: ${colors.GOAL};`);
    }
    styleExplore(td) {
        td.setAttribute(
            'style',
            `height:${this.cellSize - 4}px;
            width:${this.cellSize - 2}px;
            cursor: pointer;`
            // background-color: ${colors.EXPLORED[explored % 2]};`
        );
        this.elements.push({ u: 0.0, td });
    }

    fade(property, start, end, duration) {
        const interval = 20;
        const steps = duration / interval;
        const step_u = 1.0 / steps;
        const lerp = (a, b, u) => (1 - u) * a + u * b;
        setInterval(() => {
            this.elements.forEach((el, index) => {
                if (el.u >= 1.0) {
                    this.elements.splice(index, 1);
                }
                let r = parseInt(lerp(start.r, end.r, el.u));
                let g = parseInt(lerp(start.g, end.g, el.u));
                let b = parseInt(lerp(start.b, end.b, el.u));
                let colorname = 'rgb(' + r + ',' + g + ',' + b + ')';
                el.td.style.setProperty(property, colorname);
                el.u += step_u;
            });
        }, interval);
    }
}

export default Board;
