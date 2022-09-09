import { UserProvider } from "./index";
import CanvasContainer from "./CanvasContainer";
import DetailsView from "./DetailsView";

function App() {
    return (
        <UserProvider>
            <div className="App">
                <div id="header"></div>
                <div id="sidebar"></div>
                <div id="display">
                    <CanvasContainer />
                </div>
                <DetailsView />
                <div id="footer"></div>
            </div>
        </UserProvider>
    );
}

export default App;
