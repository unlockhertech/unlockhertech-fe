import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { NavbarLink } from "./components/Navbar";
import { WorkInProgress } from "./components/WorkInProgress";

const App = () => {
  return (
    <div className="App">
      <NavbarLink />
      <WorkInProgress />
    </div>
  );
};

export default App;
