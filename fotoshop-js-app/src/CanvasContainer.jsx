import React from "react";
import { UserContext } from "./index";
import render from "./Renderer";

const CanvasContainer = () => {
    const [state, dispatch] = React.useContext(UserContext);

    const canvasRef = React.useRef(null);

    state.canvas = canvasRef;

    React.useEffect(() => {
        state.context = state.canvas.current.getContext("2d");
        render(state);
        state.test = "test";
    }, []);

    return (
        <div id="CanvasContainer">
            <canvas ref={state.canvas} />
        </div>
    );
};

export default CanvasContainer;
