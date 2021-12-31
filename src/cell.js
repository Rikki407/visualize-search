class Cell {
    constructor(row, col, parent = null) {
        this.row = row;
        this.col = col;
        this.repr = `row:${row} - col:${col}`;
        this.parent = parent;
        this.depth = parent ? parent.depth + 1 : 0;
    }

    isCycle() {
        let current = this;
        while (current.parent !== null) {
            if (this.isEqual(current.parent)) return true;
            current = current.parent;
        }
        return false;
    }
    isEqual(cell) {
        return cell.row === this.row && cell.col === this.col;
    }
}

export default Cell;
