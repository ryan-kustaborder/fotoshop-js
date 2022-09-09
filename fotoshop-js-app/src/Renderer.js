export default function render(state) {
    onTest(state.context);
}

function onTest(ctx) {
    ctx.clearRect(0, 0, 200, 200);

    ctx.fillStyle = "#F0DB4F";
    ctx.strokeStyle = "red";

    // draw a rectangle with fill and stroke
    ctx.fillRect(100 + Math.random() * 100, 50, 10, 100);
}
