import colors from './colors';
class Board {
    constructor(parent, cellSize) {
        this.parent = parent;
        this.cellSize = cellSize;
        this.grid = new Map();
        window.addEventListener('resize', () => this.updateTable());
    }
    makeTable() {
        this.rows = Math.ceil(window.innerHeight / this.cellSize) - 1;
        this.cols = Math.floor(window.innerWidth / this.cellSize);
        const table = document.createElement('table');
        table.setAttribute('cellspacing', 1);
        for (let i = 0; i < this.rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < this.cols; j++) {
                const td = document.createElement('td');
                this.styleNormal(td);
                td.addEventListener('click', () => this.onClick(i, j));
                this.grid.set(`${i}-${j}`, {
                    explored: false,
                    td,
                });
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        this.table = table;
        this.parent.appendChild(this.table);
    }
    updateTable(cellSize = this.cellSize) {
        this.cellSize = cellSize;
        if (this.parent.contains(this.table)) {
            this.parent.removeChild(this.table);
            this.makeTable();
        }
    }
    explore({ row, col }) {
        this.grid.set(`${row}-${col}`, {
            explored: true,
            ...this.grid.get(`${row}-${col}`),
        });
    }
    onClick(row, col, act = null) {
        const action =
            act ?? document.querySelector('.switch-input:checked').value;
        const prev = this.grid.get(action);
        if (prev) this.styleNormal(this.grid.get(`${prev.row}-${prev.col}`).td);
        this.grid.set(action, { row, col });
        const { td } = this.grid.get(`${row}-${col}`);
        action === 'start' ? this.styleStart(td) : this.styleEnd(td);
    }
    setStart(row, col) {
        const prevStart = this.grid.get('start');
        if (prevStart)
            this.styleNormal(
                this.grid.get(`${prevStart.row}-${prevStart.col}`).td
            );

        this.grid.set('start', { row, col });
        this.styleStart(this.grid.get(`${row}-${col}`).td);
    }
    setEnd(row, col) {
        const prevEnd = this.grid.get('end');
        if (prevEnd)
            this.styleNormal(this.grid.get(`${prevEnd.row}-${prevEnd.col}`).td);

        this.grid.set('end', { row, col });
        this.styleEnd(this.grid.get(`${row}-${col}`).td);
    }
    styleNormal(td) {
        td.setAttribute(
            'style',
            `height:${this.cellSize - 2}px;
            width:${this.cellSize - 2}px;
            cursor: pointer;
            border-radius: 18%;
            background-color:${colors.NORMAL};`
        );
    }
    styleStart(td) {
        td.setAttribute(
            'style',
            `background-color: ${colors.START};
            border-radius:38%;`
        );
    }
    styleEnd(td) {
        td.setAttribute(
            'style',
            `background-color: ${colors.END};
            border-radius:38%;`
        );
    }
    getNeighbors({ row, col }) {
        const neigbors = [];
        if (row !== 0 && col !== this.cols)
            neigbors.push({ row: row - 1, col: col + 1 });
        if (col !== this.cols) neigbors.push({ row: row, col: col + 1 });
        if (row !== this.rows && col !== this.cols)
            neigbors.push({ row: row + 1, col: col + 1 });
        if (row !== this.rows) neigbors.push({ row: row + 1, col: col });
        if (row !== this.rows && col !== 0)
            neigbors.push({ row: row + 1, col: col - 1 });
        if (col !== 0) neigbors.push({ row: row, col: col - 1 });
        if (row !== 0 && col !== 0)
            neigbors.push({ row: row - 1, col: col - 1 });
        if (row !== 0) neigbors.push({ row: row - 1, col: col });
        return neigbors;
    }
}

export default Board;
