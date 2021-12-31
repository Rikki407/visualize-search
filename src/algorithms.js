// import Cell from './cell';
import { PriorityQueue } from './utility';

function Algorithms(start, goal, rows, cols, explore) {
    this.start = start;
    this.goal = goal;
    this.rows = rows;
    this.cols = cols;
    this.explore = explore;

    this.drawPath = (cell) => {
        let current = cell;
        console.log('Depth', cell.depth);
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
    this.g = (cell) => cell.depth;
    // this.h = (cell) =>
    //     Math.abs(cell.row - this.goal.row) + Math.abs(cell.col - this.goal.col);
    this.h = (cell) => {
        const dx = Math.abs(cell.row - this.goal.row);
        const dy = Math.abs(cell.col - this.goal.col);
        return dx + dy - Math.min(dx, dy);
    };
    this.f = (cell) => this.g(cell) + this.h(cell);

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
    this.idaStarSearch = async () => {
        const search = async (path, bound) => {
            const node = path[path.length - 1];
            const f = this.f(node);
            if (f > bound) return f;
            if (node.isEqual(this.goal)) return this.drawPath(node);
            if (!node.isEqual(this.start)) await this.explore(node, 'ida*');
            let min = Infinity;
            for (const neighbor of node.getNeighbors(this.rows, this.cols)) {
                if (!neighbor.isCycle()) {
                    path.push(neighbor);
                    const t = await search(path, bound);
                    if (t === true) return true;
                    if (t < min) min = t;
                    path.pop();
                }
            }
            return min;
        };
        let bound = this.h(this.start);
        const path = [this.start];
        while (true) {
            const t = await search(path, bound);
            if (t === true) return true;
            if (t === Infinity) return false;
            bound = t;
        }
    };
}
export default Algorithms;
