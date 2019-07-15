import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./containers/Login";
import SignUp from "./containers/Signup";
import User from "./containers/User";

class Routes extends Component {
  render() {
    return (
      <div>
        <main>
          <Switch>
            <Route exact path="/" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route path="/user" component={User} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default Routes;
