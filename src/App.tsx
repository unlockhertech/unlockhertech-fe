import "bootstrap/dist/css/bootstrap.min.css";
import { LandingPage } from "./components/LandingPage";
import "./App.css";
import { Footer } from "./components/Footer";
import { NavbarLink } from "./components/Navbar";
import { Introduction } from "./components/Introduction";
import { Cards } from "./components/Cards";

const App = () => {
  return (
    <div className="App">
      <NavbarLink />
      <LandingPage />
      <Introduction />
      <Cards />
      <Footer />
    </div>
  );
};

export default App;
