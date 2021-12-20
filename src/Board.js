class Board {
    constructor(parent, cellSize) {
        this.parent = parent;
        this.cellSize = cellSize;
        this.grid = new Map();
        this.grid.set('start', { row: -1, col: -1 });
        this.grid.set('end', { row: -1, col: -1 });
        this.table = document.createElement('table');
        window.addEventListener('resize', () => {
            if (parent.contains(this.table)) {
                this.removeTable();
                this.makeTable();
            }
        });
    }
    makeTable() {
        this.rows = Math.round(window.innerHeight / this.cellSize) - 1;
        this.cols = Math.floor(window.innerWidth / this.cellSize);
        const table = document.createElement('table');
        table.setAttribute('cellspacing', 1);
        for (let i = 0; i < this.rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < this.cols; j++) {
                this.grid.set(`${i}-${j}`, this.grid.get(`${i}-${j}`) ?? false);
                const td = document.createElement('td');
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        this.grid.set('start', this.grid.get('start'));
        this.grid.set('end', this.grid.get('end'));
        this.grid = new Map(this.grid);
        this.table = table;
        this.parent.appendChild(this.table);
    }
    removeTable() {
        this.parent.removeChild(this.table);
    }
    explore({ row, col }) {
        this.grid = new Map(this.grid.set(`${row}-${col}`, true));
    }
    setStart({ row, col }) {
        this.grid = new Map(this.grid.set('start', { row, col }));
    }
    setEnd({ row, col }) {
        this.grid = new Map(this.grid.set('end', { row, col }));
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
