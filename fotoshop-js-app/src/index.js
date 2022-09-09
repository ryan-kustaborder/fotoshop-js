import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";

import { reducer, initialState } from "./reducer";

export const UserContext = React.createContext({
    state: initialState,
    dispatch: () => null,
});

export const UserProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    return (
        <UserContext.Provider value={[state, dispatch]}>
            {children}
        </UserContext.Provider>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
