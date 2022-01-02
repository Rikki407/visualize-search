import Algorithms from './algorithms';
import SelectionArea from '@viselect/vanilla';
import Cell from './cell';
import colors from './colors';

class Board {
    constructor(parent, toggle, speedSlider, sizeSlider, wslider) {
        this.parent = parent;
        this.toggle = toggle;
        this.speedSlider = speedSlider;
        this.sizeSlider = sizeSlider;
        this.wslider = wslider;
        this.start = null;
        this.end = null;
        this.grid = new Map();
        this.block = new Map();
        this.elements = [];
        this.speed = speedSlider.value;
        this.cellSize = sizeSlider.value;
        this.W = parseInt(wslider.value / 50);
        Algorithms.call(this);
        this.oldHeight = window.innerHeight;
        this.oldWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            if (
                Math.abs(this.oldHeight - window.innerHeight) > 60 ||
                this.oldWidth !== window.innerWidth
            ) {
                this.updateTable();
                this.oldHeight = window.innerHeight;
                this.oldWidth = window.innerWidth;
            }
        });
        speedSlider.addEventListener('input', ({ target }) => {
            this.speed = target.value;
        });
        sizeSlider.addEventListener('input', ({ target }) => {
            this.cellSize = target.value;
            this.updateTable();
        });
        wslider.addEventListener('input', ({ target }) => {
            this.W = parseInt(target.value / 50);
        });
        const selection = new SelectionArea({
            selectables: ['td'],
            container: 'table',
            startareas: ['#grid-container'],
            boundaries: ['#grid-container'],
        });
        selection.on('stop', ({ store }) => {
            if (store.selected.length <= 1) return;
            for (const td of store.selected) {
                const i = td.getAttribute('i');
                const j = td.getAttribute('j');
                this.setBlock(i, j);
            }
            for (const td of store.changed.removed) {
                const i = td.getAttribute('i');
                const j = td.getAttribute('j');
                this.setBlock(i, j);
            }
        });
        this.fade('background-color', 800);
    }

    getElement(cell) {
        return this.grid.get(`${cell.row}-${cell.col}`);
    }
    setElement(row, col, values) {
        this.grid.set(`${row}-${col}`, { ...values });
    }
    isBlocked(row, col) {
        return this.block.get(`${row}-${col}`);
    }
    setBlock(row, col, act = true) {
        this.block.set(`${row}-${col}`, act);
        this.styleBlock(this.grid.get(`${row}-${col}`).td);
    }
    makeTable() {
        this.rows = Math.round(this.parent.clientHeight / (this.cellSize - 1));
        if (this.rows * (this.cellSize - 1) > this.parent.clientHeight)
            this.rows -= 1;
        this.cols = Math.floor(window.innerWidth / this.cellSize);
        const table = document.createElement('table');
        table.setAttribute('cellspacing', 1);
        for (let i = 0; i < this.rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < this.cols; j++) {
                const td = document.createElement('td');
                this.styleNormal(td);
                td.setAttribute('i', i);
                td.setAttribute('j', j);
                td.addEventListener('click', () => this.onClick(i, j));
                td.addEventListener('mousemove', (e) => {
                    if (e.shiftKey) this.setBlock(i, j);
                });
                this.setElement(i, j, { td });
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
            this.block = new Map();
            this.makeTable();
        }
    }

    getNeighbors(cell) {
        const neigbors = [];
        if (
            cell.row > 0 &&
            cell.col < this.cols - 1 &&
            !this.isBlocked(cell.row - 1, cell.col + 1)
        )
            neigbors.push(new Cell(cell.row - 1, cell.col + 1, cell));
        if (cell.col < this.cols - 1 && !this.isBlocked(cell.row, cell.col + 1))
            neigbors.push(new Cell(cell.row, cell.col + 1, cell));
        if (
            cell.row < this.rows - 1 &&
            cell.col < this.cols - 1 &&
            !this.isBlocked(cell.row + 1, cell.col + 1)
        )
            neigbors.push(new Cell(cell.row + 1, cell.col + 1, cell));
        if (cell.row < this.rows - 1 && !this.isBlocked(cell.row + 1, cell.col))
            neigbors.push(new Cell(cell.row + 1, cell.col, cell));
        if (
            cell.row < this.rows - 1 &&
            cell.col > 0 &&
            !this.isBlocked(cell.row + 1, cell.col - 1)
        )
            neigbors.push(new Cell(cell.row + 1, cell.col - 1, cell));
        if (cell.col > 0 && !this.isBlocked(cell.row, cell.col - 1))
            neigbors.push(new Cell(cell.row, cell.col - 1, cell));
        if (
            cell.row > 0 &&
            cell.col > 0 &&
            !this.isBlocked(cell.row - 1, cell.col - 1)
        )
            neigbors.push(new Cell(cell.row - 1, cell.col - 1, cell));
        if (cell.row > 0 && !this.isBlocked(cell.row - 1, cell.col))
            neigbors.push(new Cell(cell.row - 1, cell.col, cell));
        return neigbors;
    }

    onClick(row, col, action = !this.toggle.checked ? 'start' : 'goal') {
        if (this.isBlocked(row, col)) return;
        if (this[action]) {
            this.styleNormal(this.getElement(this[action]).td);
            this.setBlock(row, col, false);
        }
        this[action] = new Cell(row, col);
        const { td } = this.getElement(this[action]);
        action === 'start' ? this.styleStart(td) : this.styleGoal(td);
    }

    styleNormal(td) {
        td.setAttribute(
            'style',
            `height:${this.cellSize - 4}px;
            width:${this.cellSize}px;
            cursor: pointer;
            background-color:${colors.NORMAL};`
        );
    }
    styleStart(td) {
        td.setAttribute(
            'style',
            `cursor: pointer;
            background: ${colors.START};`
        );
    }
    styleGoal(td) {
        td.setAttribute('style', `background: ${colors.GOAL};`);
    }
    styleBlock(td) {
        td.setAttribute(
            'style',
            `height:${this.cellSize - 4}px;
            width:${this.cellSize}px;
            background: ${colors.BLOCK};`
        );
    }

    fade(property, duration) {
        const interval = 20;
        const steps = duration / interval;
        const step_u = 1.0 / steps;
        const lerp = (a, b, u) => (1 - u) * a + u * b;
        setInterval(() => {
            this.elements.forEach((el, index) => {
                if (el.u >= 1.0) {
                    this.elements.splice(index, 1);
                }
                let r = parseInt(lerp(el.start[0], el.end[0], el.u));
                let g = parseInt(lerp(el.start[1], el.end[1], el.u));
                let b = parseInt(lerp(el.start[2], el.end[2], el.u));
                let colorname = `rgb(${r}, ${g}, ${b})`;
                el.td.style.setProperty(property, colorname);
                el.u += step_u;
            });
        }, interval);
    }

    reset() {
        this.start = null;
        this.goal = null;
        this.speedSlider.value = 125;
        this.speed = 125;
        this.sizeSlider.value = 30;
        this.cellSize = 30;
        this.wslider.value = 50;
        this.W = 1;
        this.toggle.checked = false;
        this.updateTable();
    }
}

export default Board;
