import Algorithms from './algorithms';
import Cell from './cell';
import colors from './colors';

class Board {
    constructor(parent, toggle, speedSlider, sizeSlider, wslider) {
        this.parent = parent;
        this.toggle = toggle;
        this.grid = new Map();
        this.block = new Map();
        this.elements = [];
        this.speed = speedSlider.value;
        this.cellSize = sizeSlider.value;
        this.W = parseInt(wslider.value / 50);
        Algorithms.call(
            this,
            this.start,
            this.goal,
            this.getNeighbors,
            this.W,
            this.explore
        );
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
    setBlock(row, col) {
        this.block.set(`${row}-${col}`, true);
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
        if (this[action]) this.styleNormal(this.getElement(this[action]).td);
        this[action] = new Cell(row, col);
        const { td } = this.getElement(this[action]);
        action === 'start' ? this.styleStart(td) : this.styleGoal(td);
    }

    explore(cell, algo) {
        const { td } = this.getElement(cell);
        let start, end;
        switch (algo) {
            case 'bfs':
                start = [255, 0, 0];
                end = [0, 128, 128];
                break;
            case 'dfs':
                start = [247, 37, 133];
                end = [72, 149, 239];
                break;
            case 'idfs':
                start = [201, 24, 74];
                end = [0, 109, 119];
                break;
            case 'uniform':
                start = [0, 21, 36];
                end = [123, 44, 191];
                break;
            case 'a*':
                start = [6, 214, 160];
                end = [239, 71, 111];
                break;
            case 'ida*':
                start = [181, 23, 158];
                end = [67, 97, 238];
                break;
            default:
                start = [255, 186, 8];
                end = [244, 140, 6];
                break;
        }
        this.elements.push({ u: 0.0, td, start, end });
        this.setElement(cell.row, cell.col, { td });
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
            `cursor: pointer;
            background: ${colors.START};`
        );
    }
    styleGoal(td) {
        td.setAttribute('style', `background: ${colors.GOAL};`);
    }
    styleBlock(td) {
        td.setAttribute('style', `background: ${colors.BLOCK};`);
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
}

export default Board;
