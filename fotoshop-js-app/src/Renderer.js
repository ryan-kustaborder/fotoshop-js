export default function render(state) {
    // Clear canvas before rendering
    state.context.clearRect(
        0,
        0,
        state.canvas.current.width,
        state.canvas.current.height
    );

    state.context.fillRect(100, 100, 50, 50);
}
