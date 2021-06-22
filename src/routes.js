import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./containers/Login";
import SignUp from "./containers/Signup";
import Landing from "./containers/Landing";
import cookie from "react-cookies";
import Workspace from "./Workspace";
import { WORKSPACE_ID, WEBSITE_URL } from "./utils/Constants";
import { getWorkspaceId } from "./utils/function";
import { isMobile } from "react-device-detect";
import PropTypes from 'prop-types';

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
      {
        path: "",
        exact: false,
        component: "",
        title: "",
      },
    ];
  }

  isAllowed = (props, RouteComponent, title) => {
    if (this.isCurrentUser()) {
      if (
        title !== "login" &&
        title !== "signup" &&
        title !== "landing" &&
        title === "workspace"
      ) {
        return (
          <Workspace
            props={props}
            RouteComponent={RouteComponent}
            title={title}
          />
        );
      }
      return (
        <Redirect
          to={{
            pathname: `/workspace/${getWorkspaceId()}/dashboard`,
            state: { isTimetrack: true },
          }}
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
    if (isMobile) {
      window.location.replace(`${WEBSITE_URL}/#Apps`);
    } else {
      return (
        <div>
          <main>
            <Switch>
              {}
              {this.Routes.map((route, i) => (
                <Route
                  key={i}
                  exact={route.exact}
                  path={route.path}
                  render={(props) =>
                    
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
}

Routes.propTypes = {
  path: PropTypes.string,
  exact : PropTypes.bool,
  title: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  signup: PropTypes.func,
  responseGoogle: PropTypes.func,
  errorGoogle: PropTypes.func,
  handlePasswordShow: PropTypes.func,
  changeLogType: PropTypes.func,
  disabled: PropTypes.func,
  hash: PropTypes.string,
  key: PropTypes.string,
  pathname: PropTypes.string,
  search: PropTypes.string,
  isExact: PropTypes.bool,
  WorkspaceId: PropTypes.string,
}

export default Routes;
