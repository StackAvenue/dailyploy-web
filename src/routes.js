import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./containers/Login";
import SignUp from "./containers/Signup";
import Dashboard from "./containers/Dashboard";
import Landing from "./containers/Landing";
import NotFound from "./components/NoMatch";
import cookie from "react-cookies";

class Routes extends Component {
  constructor(props) {
    super(props);
    this.Routes = [
      {
        path: "/",
        exact: true,
        component: Landing,
        title: "landing"
      },
      {
        path: "/login",
        exact: true,
        component: Login,
        title: "login"
      },
      {
        path: "/dashboard/:workspaceId",
        exact: false,
        component: Dashboard,
        title: "dashboard"
      },
      {
        path: "/signup",
        exact: true,
        component: SignUp,
        title: "signup"
      },
      {
        component: NotFound,
        title: "pageNotFound"
      }
    ];
  }

  isAllowed = (props, routeComponent, title) => {
    if (this.isCurrentUser()) {
      return <Dashboard {...props} />;
    } else {
      if (title === "login") {
        return <Login {...props} />;
      } else if (title === "signup") {
        return <SignUp {...props} />;
      } else if (title === "landing") {
        return <Landing {...props} />;
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
          {/* <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={Login} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/dashboard/:id" component={Dashboard} />
            </Switch>
          </BrowserRouter> */}
        </main>
      </div>
    );
  }
}

export default Routes;
