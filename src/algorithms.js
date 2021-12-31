import { PriorityQueue } from './utility';

function Algorithms(start, goal, rows, cols, explore) {
    this.start = start;
    this.goal = goal;
    this.rows = rows;
    this.cols = cols;
    this.explore = explore;

    this.drawPath = (cell) => {
        let current = cell;
        while (current.parent !== null) {
            this.explore(current);
            current = current.parent;
        }
        return true;
    };

    this.breadthFirstSearch = async () => {
        const frontier = [this.start];
        const reached = new Map([[this.start.repr, true]]);
        while (frontier.length !== 0) {
            const curr = frontier.shift();
            for (const neighbor of curr.getNeighbors(this.rows, this.cols)) {
                if (neighbor.isEqual(this.goal)) return this.drawPath(neighbor);
                if (!reached.has(neighbor.repr)) {
                    await this.explore(neighbor, 'bfs');
                    reached.set(neighbor.repr, true);
                    frontier.push(neighbor);
                }
            }
        }
        return false;
    };

    this.depthFirstSearch = async (limit = Infinity) => {
        const frontier = [this.start];
        while (frontier.length !== 0) {
            const curr = frontier.pop();
            if (curr.isEqual(this.goal)) return this.drawPath(curr);
            if (curr.depth <= limit && !curr.isCycle()) {
                if (!curr.isEqual(this.start))
                    await this.explore(
                        curr,
                        limit === Infinity ? 'dfs' : 'idfs'
                    );
                for (const neighbor of curr.getNeighbors(this.rows, this.cols))
                    frontier.push(neighbor);
            }
        }
        return false;
    };

    this.iterativeDeepeningSearch = async () => {
        let limit = 0;
        let result = false;
        while (!result) {
            limit++;
            result = await this.depthFirstSearch(limit);
        }
    };
    this.f = (cell) => {
        const g = cell.depth;
        /* Eucledian Distance */
        // const h = Math.pow(
        //     Math.pow(cell.row - this.goal.row, 2) +
        //         Math.pow(cell.col - this.goal.col, 2),
        //     0.5
        // );
        /* Manhatten Distance */
        const h =
            Math.abs(cell.row - this.goal.row) +
            Math.abs(cell.col - this.goal.col);
        return g + h;
    };
    this.aStarSearch = async () => {
        const frontier = new PriorityQueue((a, b) => this.f(a) < this.f(b));
        frontier.push(this.start);
        const reached = new Map([[this.start.repr, this.start]]);
        while (!frontier.isEmpty()) {
            const curr = frontier.pop();
            if (curr.isEqual(this.goal)) return this.drawPath(curr);
            if (!curr.isEqual(this.start)) await this.explore(curr, 'a*');
            for (const neighbor of curr.getNeighbors(this.rows, this.cols)) {
                const r = neighbor.repr;
                if (!reached.has(r) || neighbor.depth < reached[r]?.depth) {
                    reached.set(neighbor.repr, neighbor);
                    frontier.push(neighbor);
                }
            }
        }
        return false;
    };
}
export default Algorithms;
