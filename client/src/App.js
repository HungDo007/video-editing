import NavTabs from "./components/nav-tabs/nav-tabs";

import "./App.css";
import RoutePath from "./components/route-path/route-path";

function App() {
  return (
    <div className="App">
      <NavTabs>
        <RoutePath />
      </NavTabs>
    </div>
  );
}

export default App;
