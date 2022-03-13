import logo from "./logo.svg";
import "./App.css";
import VideoInput from "./components/video-input";
import ActionsManagement from "./components/new-action-labeling/actions-management/actions-management";

function App() {
  return (
    <div className="App">
      <ActionsManagement />
    </div>
  );
}

export default App;
