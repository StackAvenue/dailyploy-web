import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import ErrorModal from './components/ErrorModal';

class App extends Component {
  render() {
    return (
      <div>
        <ErrorModal />
        <Router>
          <Routes />
        </Router>
      </div>
    );
  }
}

export default App;
