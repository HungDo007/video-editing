import logo from "./logo.svg";
import "./App.css";
import VideoInput from "./components/video-input";
import ActionsManagement from "./components/new-action-labeling/actions-management/actions-management";
import VideoManagement from "./components/video-analytics/videos-management/videos-management";

function App() {
  return (
    <div className="App">
      {/* <ActionsManagement /> */}
      <VideoManagement />
    </div>
  );
}

export default App;
