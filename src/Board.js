import colors from './colors';
class Board {
    constructor(parent, cellSize) {
        this.parent = parent;
        this.cellSize = cellSize;
        this.grid = new Map();
        this.breadthFirstSearch = this.breadthFirstSearch.bind(this);
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

    onClick(
        row,
        col,
        action = document.querySelector('.switch-input:checked').value
    ) {
        const prev = this.grid.get(action);
        if (prev) this.styleNormal(this.grid.get(`${prev.row}-${prev.col}`).td);
        this.grid.set(action, { row, col });
        const { td } = this.grid.get(`${row}-${col}`);
        action === 'start' ? this.styleStart(td) : this.styleEnd(td);
    }
    explore({ row, col }) {
        const cell = this.grid.get(`${row}-${col}`);
        this.styleExplore(cell.td);
        this.grid.set(`${row}-${col}`, {
            explored: true,
            ...cell,
        });
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
    styleExplore(td) {
        td.setAttribute(
            'style',
            `background-color: ${colors.EXPLORED};
        border-radius:38%;`
        );
    }

    getNeighbors({ row, col }) {
        const neigbors = [];
        if (row > 0 && col < this.cols - 1)
            neigbors.push({ row: row - 1, col: col + 1 });
        if (col < this.cols - 1) neigbors.push({ row: row, col: col + 1 });
        if (row < this.rows - 1 && col < this.cols - 1)
            neigbors.push({ row: row + 1, col: col + 1 });
        if (row < this.rows - 1) neigbors.push({ row: row + 1, col: col });
        if (row < this.rows - 1 && col > 0)
            neigbors.push({ row: row + 1, col: col - 1 });
        if (col > 0) neigbors.push({ row: row, col: col - 1 });
        if (row > 0 && col > 0) neigbors.push({ row: row - 1, col: col - 1 });
        if (row > 0) neigbors.push({ row: row - 1, col: col });
        return neigbors;
    }
    breadthFirstSearch() {
        const start = this.grid.get('start');
        const goal = this.grid.get('end');
        const queue = [start];
        const reached = new Map([[JSON.stringify(start), true]]);
        while (queue.length !== 0) {
            const curr = queue.shift();
            for (const neighbor of this.getNeighbors(curr)) {
                this.explore(neighbor);
                if (JSON.stringify(neighbor) === JSON.stringify(goal))
                    return true;
                if (!reached.has(JSON.stringify(neighbor))) {
                    reached.set(JSON.stringify(neighbor), true);
                    queue.push(neighbor);
                }
            }
        }
        return false;
    }
}

export default Board;
