import logo from "./logo.svg";
import "./App.css";
import VideoInput from "./components/video-input";
import ActionsManagement from "./components/new-action-labeling/actions-management/actions-management";

import ActionsLabeling from "./components/new-action-labeling/actions-labeling/actions-labeling";
import ModalManagement from "./components/modal-management/modal-managemet";

import VideoManagement from "./components/video-analytics/videos-management/videos-management";


function App() {
  return (
    <div className="App">
      <ModalManagement />
    </div>
  );
}

export default App;
