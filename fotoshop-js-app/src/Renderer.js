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

const SIZE = 2;
const GRID_WIDTH = 200;
const GRID_HEIGHT = 200;

class PotentialState {
    constructor(value, probability) {
        this.value = value;
        this.probability = probability;
    }
}

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

        await new Promise((r) => setTimeout(r, 1));
    }
    drawCells(cells, ctx);
}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.state = null;
        this.possible = [
            new PotentialState("blue", 0.1),
            new PotentialState("yellow", 0.4),
            new PotentialState("green", 0.5),
        ];
    }
}

function drawCells(cells, ctx) {
    cells.forEach((cell) => {
        if (cell.state) {
            ctx.fillStyle = cell.state.value;
            ctx.fillRect(10 + cell.x * SIZE, 10 + cell.y * SIZE, SIZE, SIZE);
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

function getEntropy(potentials) {
    let max = 0;

    potentials.forEach((potential) => {
        if (potential.probability > max) {
            max = potential.probability;
        }
    });

    return max;
}

async function collapse(cells) {
    console.log("collapsing");
    let lowEntropies = [];
    let lowestEntropy = 9999;

    cells.forEach((cell) => {
        let entropy = cell.possible.length;

        // Skip cells that have already been selected
        if (entropy === 0) {
            return;
        }

        if (entropy === 1) {
            cell.state = cell.possible[0];
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

    let stateIndex = Math.floor(Math.random() * selection.possible.length);

    selection.state = selectRandomState(selection.possible);

    lowEntropies[i].possible = [];
}

function containsStateWithValue(arr, val) {
    let result = false;

    arr.forEach((state, i) => {
        if (state && state.value === val) {
            result = true;
        }
    });

    return result;
}

function selectRandomState(potentials) {
    let values = [];
    let a = 0;

    potentials.forEach((state, i) => {
        values.push({ state: state, area: a });
        a += state.probability;
    });

    let rand = Math.random();

    let selection;

    values.forEach((value, i) => {
        if (rand > value.area) {
            selection = value.state;
        }
    });

    return selection;
}

function selectHighestState(potentials) {
    let states = [];
    let highest = 0;

    potentials.forEach((state) => {
        if (state.probability > highest) {
            states = [state];
            highest = state.probability;
        } else if (state.probability === highest) {
            states.push(state);
        }
    });

    console.log(states.length);

    let rand = Math.floor(Math.random() * states.length);

    return states[rand];
}

function propogateChange(cells) {
    cells.forEach((cell, i) => {
        if (cell.state !== null) {
            return;
        }

        let neighbors = getCellNeighborStates(cells, i);

        if (containsStateWithValue(neighbors, "blue")) {
            cell.possible = [
                new PotentialState("blue", 0.9),
                new PotentialState("yellow", 0.1),
            ];
        } else if (containsStateWithValue(neighbors, "green")) {
            cell.possible = [
                new PotentialState("green", 0.7),
                new PotentialState("yellow", 0.3),
            ];
        }
        if (containsStateWithValue(neighbors, "yellow")) {
            cell.possible = [
                new PotentialState("blue", 0.2),
                new PotentialState("yellow", 0.75),
                new PotentialState("green", 0.05),
            ];
        }
    });
}

function getCellNeighborStates(cells, i) {
    let states = [];

    // Above
    if (i - GRID_WIDTH >= 0) {
        states.push(cells[i - GRID_WIDTH].state);
    }

    // Below
    if (i + GRID_WIDTH < cells.length) {
        states.push(cells[i + GRID_WIDTH].state);
    }

    // Left
    if (
        i - 1 > 0 &&
        Math.floor((i - 1) / GRID_WIDTH) === Math.floor(i / GRID_WIDTH)
    ) {
        states.push(cells[i - 1].state);
    }

    // Right
    if (
        i + 1 < cells.length &&
        Math.floor((i + 1) / GRID_WIDTH) === Math.floor(i / GRID_WIDTH)
    ) {
        states.push(cells[i + 1].state);
    }

    return states;
}
