// const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const breadthFirstSearch = async (board) => {
    const start = board.grid.get('start');
    const goal = board.grid.get('end');
    const queue = [start];
    const reached = new Map([[JSON.stringify(start), true]]);
    while (queue.length !== 0) {
        const curr = queue.shift();
        for (const neighbor of board.getNeighbors(curr)) {
            board.exploreCell(neighbor);
            if (JSON.stringify(neighbor) === JSON.stringify(goal)) return true;
            if (!reached.has(JSON.stringify(neighbor))) {
                reached.set(JSON.stringify(neighbor), true);
                queue.push(neighbor);
            }
        }
    }
    return false;
};

export default breadthFirstSearch;
