import React from "react";
import { UserContext } from "./index";
import render from "./Renderer";

const DetailsView = () => {
    const [state, dispatch] = React.useContext(UserContext);

    return (
        <div id="details">
            <button onClick={() => render(state)}>Render</button>
        </div>
    );
};

export default DetailsView;
