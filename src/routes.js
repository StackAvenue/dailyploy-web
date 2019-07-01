import React, {Component} from 'react'
import { Route, Switch } from 'react-router-dom'
import Login from  './container/Login'

class Routes extends Component{
    render(){
      return(
      <div>
        <main>
          <Switch>
            <Route exact path="/" component={Login} />
          </Switch>
        </main>
      </div>
  
  
      )
    }
  }
  
  export default Routes;