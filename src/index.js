import React from "react";
import ReactDOM from "react-dom";
import axiosInitializer from "./axios_initializer";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-notifications/lib/notifications.css';
axiosInitializer.config();
toast.configure();

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
