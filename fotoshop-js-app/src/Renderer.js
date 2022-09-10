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
const DELAY = 1;

const BIASES = {
    default: { g: 2, y: 0, b: 2 },
    g: { g: 4, y: 1, b: -2 },
    y: { g: 4, y: 2, b: 4 },
    b: { g: -2, y: 1, b: 4 },
};

async function waveCollapse(ctx) {
    let cells = [];

    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            cells.push(new Cell(x, y));
        }
    }

    let done = false;

    while (!done) {
        let highBiasCells = [];
        let highestBias = 0;

        cells.forEach((cell) => {
            if (cell.state) {
                return;
            }

            let bias = cell.getTotalBias();

            if (bias > highestBias) {
                highBiasCells = [cell];
                highestBias = bias;
            } else if (bias === highestBias) {
                highBiasCells.push(cell);
            }
        });

        let rand = Math.floor(Math.random() * highBiasCells.length);
        let selectedCell = highBiasCells[rand];

        selectedCell.collapse();

        done = isComplete(cells);

        drawCells(cells, ctx);

        // Update the biases
        updateBiases(cells, selectedCell);

        await new Promise((r) => setTimeout(r, DELAY));
    }
}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.state = null;

        this.biases = { g: 1, y: 1, b: 1 };
    }

    collapse() {
        let sum = 0;
        let stacked = [];

        if (this.biases.g > 0) {
            stacked.push({ state: "green", max: sum });
            sum += this.biases.g;
        }

        if (this.biases.y > 0) {
            stacked.push({ state: "yellow", max: sum });
            sum += this.biases.y;
        }

        if (this.biases.b > 0) {
            stacked.push({ state: "blue", max: sum });
            sum += this.biases.b;
        }

        let rand = Math.random() * sum;

        stacked.forEach((bias) => {
            if (rand > bias.max) {
                this.state = bias.state;
            }
        });
    }

    getTotalBias() {
        return (
            Math.abs(this.biases.g) +
            Math.abs(this.biases.y) +
            Math.abs(this.biases.b)
        );
    }
}

function drawCells(cells, ctx) {
    cells.forEach((cell) => {
        if (cell.state) {
            ctx.fillStyle = cell.state;
            ctx.fillRect(cell.x * SIZE, cell.y * SIZE, SIZE, SIZE);
        }
    });
}

function isComplete(cells) {
    let result = true;

    cells.forEach((cell) => {
        if (cell.state === null) {
            result = false;
        }
    });

    return result;
}

function getNeighboringCells(cells, i) {
    let neighbors = [];

    // Up
    if (i - GRID_WIDTH >= 0) {
        neighbors.push(cells[i - GRID_WIDTH]);
    }

    // Down
    if (i + GRID_WIDTH < cells.length) {
        neighbors.push(cells[i + GRID_WIDTH]);
    }

    // Left
    if (
        i - 1 > 0 &&
        Math.floor((i - 1) / GRID_WIDTH) === Math.floor(i / GRID_WIDTH)
    ) {
        neighbors.push(cells[i - 1]);
    }

    // Right
    if (
        i + 1 < cells.length &&
        Math.floor((i + 1) / GRID_WIDTH) === Math.floor(i / GRID_WIDTH)
    ) {
        neighbors.push(cells[i + 1]);
    }

    // Up Left
    if (
        i - 1 - GRID_WIDTH > 0 &&
        Math.floor((i - 1 - GRID_WIDTH) / GRID_WIDTH) ===
            Math.floor(i / GRID_WIDTH) - 1
    ) {
        neighbors.push(cells[i - 1 - GRID_WIDTH]);
    }

    // Up Right
    if (
        i + 1 - GRID_WIDTH > 0 &&
        Math.floor((i + 1 - GRID_WIDTH) / GRID_WIDTH) ===
            Math.floor(i / GRID_WIDTH) - 1
    ) {
        neighbors.push(cells[i + 1 - GRID_WIDTH]);
    }

    // Down Left
    if (
        i - 1 + GRID_WIDTH < cells.length &&
        Math.floor((i - 1 + GRID_WIDTH) / GRID_WIDTH) ===
            Math.floor(i / GRID_WIDTH) + 1
    ) {
        neighbors.push(cells[i - 1 + GRID_WIDTH]);
    }

    // Down Right
    if (
        i + 1 + GRID_WIDTH < cells.length &&
        Math.floor((i + 1 + GRID_WIDTH) / GRID_WIDTH) ===
            Math.floor(i / GRID_WIDTH) + 1
    ) {
        neighbors.push(cells[i + 1 + GRID_WIDTH]);
    }

    return neighbors;
}

function updateBiases(cells, originCell) {
    let index = originCell.x + GRID_WIDTH * originCell.y;

    // Only need to update neighboring cells
    let neighbors = getNeighboringCells(cells, index);

    cells.forEach((cell, i) => {
        if (!neighbors.includes(cell)) {
            return;
        }
        let neighborStates = getCellNeighborStates(cells, i);

        let newBiases = {
            g: BIASES.default.g,
            y: BIASES.default.y,
            b: BIASES.default.b,
        };

        neighborStates.forEach((state) => {
            if (state === "green") {
                newBiases.g += BIASES.g.g;
                newBiases.y += BIASES.g.y;
                newBiases.b += BIASES.g.b;
            }

            if (state === "yellow") {
                newBiases.g += BIASES.y.g;
                newBiases.y += BIASES.y.y;
                newBiases.b += BIASES.y.b;
            }

            if (state === "blue") {
                newBiases.g += BIASES.b.g;
                newBiases.y += BIASES.b.y;
                newBiases.b += BIASES.b.b;
            }
        });

        cell.biases = newBiases;
    });
}

function getCellNeighborStates(cells, i) {
    let states = [];

    let neighbors = getNeighboringCells(cells, i);

    neighbors.forEach((cell) => {
        if (cell.state) {
            states.push(cell.state);
        }
    });

    return states;
}
