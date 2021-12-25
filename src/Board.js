import Cell from './Cell';
import colors from './colors';
class Board {
    constructor(parent, toggle, speedSlider, sizeSlider) {
        this.parent = parent;
        this.toggle = toggle;
        this.grid = new Map();
        this.speed = parseInt(speedSlider.value);
        this.cellSize = parseInt(sizeSlider.value);
        this.breadthFirstSearch = this.breadthFirstSearch.bind(this);
        this.depthFirstSearch = this.depthFirstSearch.bind(this);
        this.iterativeDeepeningSearch =
            this.iterativeDeepeningSearch.bind(this);
        window.addEventListener('resize', () => this.updateTable());
        speedSlider.addEventListener(
            'input',
            ({ target }) => (this.speed = parseInt(target.value))
        );
        sizeSlider.addEventListener('input', ({ target }) => {
            this.cellSize = parseInt(target.value);
            this.updateTable();
        });
    }
    getElement(row, col) {
        return this.grid.get(`${row}-${col}`);
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

    updateTable() {
        if (this.parent.contains(this.table)) {
            this.parent.removeChild(this.table);
            this.makeTable();
        }
    }

    onClick(row, col, action = !this.toggle.checked ? 'start' : 'goal') {
        const prev = this.grid.get(action);
        if (prev) this.styleNormal(this.getElement(prev.row, prev.col).td);
        this.grid.set(action, { row, col });
        const { td } = this.getElement(row, col);
        action === 'start' ? this.styleStart(td) : this.styleGoal(td);
    }

    explore(cell) {
        const element = this.getElement(cell.row, cell.col);
        this.styleExplore(element.td);
        this.setElement(cell.row, cell.col, {
            explored: true,
            td: element.td,
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
            cursor: pointer;
            background-color: ${colors.EXPLORED};`
        );
    }

    async breadthFirstSearch() {
        const start = new Cell(
            this.grid.get('start').row,
            this.grid.get('start').col
        );
        const frontier = [start];
        const reached = new Map([[start.repr, true]]);
        while (frontier.length !== 0) {
            const curr = frontier.shift();
            for (const neighbor of curr.getNeighbors(this.rows, this.cols)) {
                if (neighbor.isEqual(this.grid.get('goal'))) return true;
                if (!reached.has(neighbor.repr)) {
                    await this.explore(neighbor);
                    reached.set(neighbor.repr, true);
                    frontier.push(neighbor);
                }
            }
        }
        return false;
    }

    async depthFirstSearch(limit = Infinity) {
        const start = new Cell(
            this.grid.get('start').row,
            this.grid.get('start').col
        );
        const frontier = [start];
        while (frontier.length !== 0) {
            const curr = frontier.pop();
            if (curr.isEqual(this.grid.get('goal'))) return true;
            if (!curr.isEqual(start)) await this.explore(curr);
            if (curr.depth <= limit && !curr.isCycle())
                for (const neighbor of curr.getNeighbors(this.rows, this.cols))
                    frontier.push(neighbor);
        }
        return false;
    }

    async iterativeDeepeningSearch() {
        let limit = 0;
        let result = false;
        while (!result) {
            limit++;
            result = await this.depthFirstSearch(limit);
        }
    }
}

export default Board;
