export default function render(state) {
    // Clear canvas before rendering
    state.context.clearRect(
        0,
        0,
        state.canvas.current.width,
        state.canvas.current.height
    );

    waveCollapse(state.context);
}

const SIZE = 10;
const GRID_WIDTH = 50;
const GRID_HEIGHT = 50;

async function waveCollapse(ctx) {
    let cells = [];

    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            cells.push(new Cell(x, y));
        }
    }

    let done = false;
    while (!done) {
        collapse(cells);
        propogateChange(cells);

        done = isComplete(cells);

        cells.forEach((cell) => {
            ctx.fillStyle = cell.color;
            ctx.fillRect(10 + cell.x * SIZE, 10 + cell.y * SIZE, SIZE, SIZE);
        });

        await new Promise((r) => setTimeout(r, 1));
    }
}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "black";
        this.possible = ["blue", "yellow", "green"];
    }
}

function isComplete(cells) {
    let result = true;

    cells.forEach((cell) => {
        if (cell.color === "black") {
            result = false;
        }
    });

    return result;
}

async function collapse(cells) {
    let lowEntropies = [];
    let lowestEntropy = 9999;

    cells.forEach((cell) => {
        let entropy = cell.possible.length;

        // Skip cells that have already been selected
        if (entropy === 0) {
            return;
        }

        if (entropy < lowestEntropy) {
            lowEntropies = [cell];
            lowestEntropy = entropy;
        } else if (entropy === lowestEntropy) {
            lowEntropies.push(cell);
        }
    });

    let i = Math.floor(Math.random() * lowEntropies.length);

    let selection = lowEntropies[i];

    let state = Math.floor(Math.random() * selection.possible.length);

    lowEntropies[i].color = selection.possible[state];
    lowEntropies[i].possible = [];
}

function propogateChange(cells) {
    cells.forEach((cell, i) => {
        if (cell.color !== "black") {
            return;
        }

        let neighbors = getCellNeighborStates(cells, i);

        if (neighbors.includes("blue")) {
            cell.possible = cell.possible.filter((e) => e !== "green");
        }

        if (neighbors.includes("green")) {
            cell.possible = cell.possible.filter((e) => e !== "blue");
        }
    });
}

function getCellNeighborStates(cells, i) {
    let states = [];

    // Above
    if (i - GRID_WIDTH >= 0) {
        states.push(cells[i - GRID_WIDTH].color);
    }

    // Below
    if (i + GRID_WIDTH < cells.length) {
        states.push(cells[i + GRID_WIDTH].color);
    }

    // Left
    if (
        i - 1 > 0 &&
        Math.floor((i - 1) / GRID_WIDTH) === Math.floor(i / GRID_WIDTH)
    ) {
        states.push(cells[i - 1].color);
    }

    // Right
    if (
        i + 1 < cells.length &&
        Math.floor((i + 1) / GRID_WIDTH) === Math.floor(i / GRID_WIDTH)
    ) {
        states.push(cells[i + 1].color);
    }

    return states;
}
