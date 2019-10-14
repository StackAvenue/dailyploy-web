import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./containers/Login";
import SignUp from "./containers/Signup";
import Dashboard from "./containers/Dashboard";
import Landing from "./containers/Landing";
import NotFound from "./components/NoMatch";
import Settings from "./components/dashboard/Settings";
import cookie from "react-cookies";
import Analysis from "./components/dashboard/Analysis";
import ShowProjects from "./components/dashboard/ShowProjects";
import ShowMembers from "./components/dashboard/ShowMembers";
import WorkspaceSettings from "./components/dashboard/WorkspaceSettings";
import { WORKSPACE_ID } from "./utils/Constants";

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
        path: "/dashboard/:workspaceId",
        exact: false,
        component: Dashboard,
        title: "dashboard",
      },
      {
        path: "/signup/:tokenId?",
        exact: false,
        component: SignUp,
        title: "signup",
      },
      {
        path: "/settings/:workspaceId",
        exact: true,
        component: Settings,
        title: "settings",
      },
      {
        path: "/analysis/:workspaceId",
        exact: true,
        component: Analysis,
        title: "analysis",
      },
      {
        path: "/projects/:workspaceId",
        exact: true,
        component: ShowProjects,
        title: "showProjects",
      },
      {
        path: "/members/:workspaceId",
        exact: true,
        component: ShowMembers,
        title: "showMembers",
      },
      {
        path: "/workspace/:workspaceId/settings",
        exact: true,
        component: WorkspaceSettings,
        title: "workspaceSettings",
      },
      {
        component: NotFound,
        title: "pageNotFound",
      },
    ];
  }

  isAllowed = (props, RouteComponent, title) => {
    if (this.isCurrentUser()) {
      if (title !== "login" && title !== "signup" && title !== "landing") {
        return <RouteComponent {...props} />;
      }
      return <Redirect to={`/dashboard/${WORKSPACE_ID}`} />;
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
        </main>
      </div>
    );
  }
}

export default Routes;
