import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from 'react-redux';
import store from './store';
import "./assets/css/styles.css"

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

const rootElement = document.getElementById("root");

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement
  );
