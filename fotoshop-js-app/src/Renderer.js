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

async function waveCollapse(ctx) {
    let cells = [];

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
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
            ctx.fillRect(100 + cell.x * 50, 50 + cell.y * 50, 50, 50);
        });

        await new Promise((r) => setTimeout(r, 100));

        //await new Promise((r) => setTimeout(r, 100));
    }
}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "black";
        this.possible = ["red", "blue", "green"];
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

        if (i + 1 < cells.length) {
            if (cells[i + 1].color === "red") {
                cell.possible = cell.possible.filter((e) => e !== "blue");
            }
        }
    });
}
