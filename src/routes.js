import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./containers/Login";
import SignUp from "./containers/Signup";
import Landing from "./containers/Landing";
import cookie from "react-cookies";
import Workspace from "./Workspace";

class Routes extends Component {
  constructor(props) {
    super(props);
    this.Routes = [
      {
        path: "/",
        exact: true,
        component: Landing,
        title: "landing",
      },
      {
        path: "/login",
        exact: true,
        component: Login,
        title: "login",
      },
      {
        path: "/signup/:tokenId?",
        exact: false,
        component: SignUp,
        title: "signup",
      },
      {
        path: "/workspace/:workspaceId",
        exact: false,
        component: Workspace,
        title: "workspace",
      },
    ];
  }

  isAllowed = (props, RouteComponent, title) => {
    if (this.isCurrentUser()) {
      return (
        <Workspace
          props={props}
          RouteComponent={RouteComponent}
          title={title}
        />
      );
    } else {
      if (title === "signup") {
        return <SignUp {...props} />;
      } else if (title === "landing") {
        return <Landing {...props} />;
      } else {
        return <Login {...props} />;
      }
    }
  };

  isCurrentUser = () => {
    return !!cookie.load("accessToken");
  };

  render() {
    return (
      <div>
        <main>
          <Switch>
            {this.Routes.map((route, i) => (
              <Route
                key={i}
                exact={route.exact}
                path={route.path}
                render={props =>
                  this.isAllowed(props, route.component, route.title)
                }
              />
            ))}
            <Route />
          </Switch>
        </main>
      </div>
    );
  }
}

export default Routes;
