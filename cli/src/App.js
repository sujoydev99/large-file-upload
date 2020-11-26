import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from "./components/Main";
function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Main} />
      </div>
    </Router>
  );
}

export default App;
