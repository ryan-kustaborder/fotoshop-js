import React from "react";
import { UserContext } from "./index";
import render from "./Renderer";

const CanvasContainer = () => {
    const [state, dispatch] = React.useContext(UserContext);

    const canvasRef = React.useRef(null);

    state.canvas = canvasRef;

    React.useEffect(() => {
        let cur = state.canvas.current;
        state.context = cur.getContext("2d");
        state.canvas.current.width = cur.offsetWidth;
        state.canvas.current.height = cur.offsetHeight;

        //render(state);
    }, []);

    return (
        <div id="CanvasContainer">
            <canvas ref={state.canvas} />
        </div>
    );
};

export default CanvasContainer;
