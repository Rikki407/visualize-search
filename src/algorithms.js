import { PriorityQueue } from './utility';

function Algorithms() {
    this.explore = (cell, algo) => {
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
            case 'greedy':
                start = [131, 144, 250];
                end = [186, 24, 27];
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
    };
    this.drawPath = (cell) => {
        let current = cell;
        console.log('Path Cost', cell.depth);
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
            for (const neighbor of this.getNeighbors(curr)) {
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
                for (const neighbor of this.getNeighbors(curr))
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
        return Math.max(dx, dy);
    };
    this.f = (cell) => this.g(cell) + this.W * this.h(cell);

    this.aStarSearch = async () => {
        const frontier = new PriorityQueue((a, b) => this.f(a) < this.f(b));
        frontier.push(this.start);
        const reached = new Map([[this.start.repr, this.start]]);
        while (!frontier.isEmpty()) {
            const curr = frontier.pop();
            console.log('goal', curr.isEqual(this.goal));
            if (curr.isEqual(this.goal)) return this.drawPath(curr);
            if (!curr.isEqual(this.start)) await this.explore(curr, 'a*');
            for (const neighbor of this.getNeighbors(curr)) {
                const r = neighbor.repr;
                if (!reached.has(r) || neighbor.depth < reached[r]?.depth) {
                    reached.set(neighbor.repr, neighbor);
                    frontier.push(neighbor);
                }
            }
        }
        return false;
    };
    this.uniformCostSearch = async () => {
        const frontier = new PriorityQueue((a, b) => this.g(a) < this.g(b));
        frontier.push(this.start);
        const reached = new Map([[this.start.repr, this.start]]);
        while (!frontier.isEmpty()) {
            const curr = frontier.pop();
            if (curr.isEqual(this.goal)) return this.drawPath(curr);
            if (!curr.isEqual(this.start)) await this.explore(curr, 'uniform');
            for (const neighbor of this.getNeighbors(curr)) {
                const r = neighbor.repr;
                if (!reached.has(r) || neighbor.depth < reached[r]?.depth) {
                    reached.set(neighbor.repr, neighbor);
                    frontier.push(neighbor);
                }
            }
        }
        return false;
    };
    this.greedySearch = async () => {
        const frontier = new PriorityQueue((a, b) => this.h(a) < this.h(b));
        frontier.push(this.start);
        const reached = new Map([[this.start.repr, this.start]]);
        while (!frontier.isEmpty()) {
            const curr = frontier.pop();
            if (curr.isEqual(this.goal)) return this.drawPath(curr);
            if (!curr.isEqual(this.start)) await this.explore(curr, 'greedy');
            for (const neighbor of this.getNeighbors(curr)) {
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
            for (const neighbor of this.getNeighbors(node)) {
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
