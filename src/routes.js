import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./containers/Login";
import SignUp from "./containers/Signup";
import Dashboard from "./containers/Dashboard";
import Landing from "./containers/Landing";
import NotFound from "./components/NoMatch";
import Settings from "./components/dashboard/Settings";
import cookie from "react-cookies";
import ProjectsSettings from "./components/dashboard/ProjectsSettings";
import Analysis from "./components/dashboard/Analysis";
import ShowProjects from "./components/dashboard/ShowProjects";
import ShowMembers from "./components/dashboard/ShowMembers";

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
        path: "/signup",
        exact: true,
        component: SignUp,
        title: "signup",
      },
      {
        path: "/settings",
        exact: true,
        component: Settings,
        title: "settings",
      },
      {
        path: "/settings/:workspaceId",
        exact: true,
        component: ProjectsSettings,
        title: "projectsSettings",
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
        component: NotFound,
        title: "pageNotFound",
      },
    ];
  }

  isAllowed = (props, routeComponent, title) => {
    if (this.isCurrentUser()) {
      if (title === "dashboard") {
        return <Dashboard {...props} />;
      } else if (title === "settings") {
        return <Settings {...props} />;
      } else if (title === "projectsSettings") {
        return <ProjectsSettings {...props} />;
      } else if (title === "analysis") {
        return <Analysis {...props} />;
      } else if (title === "showProjects") {
        return <ShowProjects {...props} />;
      } else if (title === "showMembers") {
        return <ShowMembers {...props} />;
      }
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
