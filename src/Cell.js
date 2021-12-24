class Cell {
    constructor(row, col, parent = null) {
        this.row = row;
        this.col = col;
        this.repr = `row:${row} - col:${col}`;
        this.parent = parent;
    }

    getNeighbors(maxRows, maxCols) {
        const neigbors = [];
        console.log('this: ', this);
        if (this.row > 0 && this.col < maxCols - 1)
            neigbors.push(new Cell(this.row - 1, this.col + 1, this));
        if (this.col < maxCols - 1)
            neigbors.push(new Cell(this.row, this.col + 1, this));
        if (this.row < maxRows - 1 && this.col < maxCols - 1)
            neigbors.push(new Cell(this.row + 1, this.col + 1, this));
        if (this.row < maxRows - 1)
            neigbors.push(new Cell(this.row + 1, this.col, this));
        if (this.row < maxRows - 1 && this.col > 0)
            neigbors.push(new Cell(this.row + 1, this.col - 1, this));
        if (this.col > 0) neigbors.push(new Cell(this.row, this.col - 1, this));
        if (this.row > 0 && this.col > 0)
            neigbors.push(new Cell(this.row - 1, this.col - 1, this));
        if (this.row > 0) neigbors.push(new Cell(this.row - 1, this.col, this));
        return neigbors;
    }

    isCycle() {
        return false;
    }
    isEqual(cell) {
        return cell.row === this.row && cell.col === this.col;
    }
}

export default Cell;
