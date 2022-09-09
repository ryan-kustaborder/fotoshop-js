import { UserProvider } from "./index";
import ContextTest from "./ContextTest";
import CanvasContainer from "./CanvasContainer";

function App() {
    return (
        <UserProvider>
            <div className="App">
                <div id="header"></div>
                <div id="sidebar"></div>
                <div id="display">
                    <CanvasContainer />
                </div>
                <div id="details"></div>
                <div id="footer"></div>
            </div>
        </UserProvider>
    );
}

export default App;
