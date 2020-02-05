import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Header from '../components/Landing/Header'
import '../assets/css/landing.scss'
import landing from '../assets/images/landing.jpg'

class Landing extends Component {
  render() {
    return (
      <>
        <div className="container-fluid">
          <div className="main-container">
            <Header />
            <div className="row no-margin landing">
              <div className="col-md-12 no-padding lcontainer">
                <div
                  style={{ display: 'flex' }}
                  className="col-md-12 no-padding container-margin"
                >
                  <div className="col-md-7 no-padding d-inline-block">
                    <img
                      src={landing}
                      alt="landing"
                      className="img-responsive image"
                    />
                  </div>
                  <div
                    style={{ flex: 1, display: 'flex', alignItems: 'center' }}
                  >
                    <div
                      className="col-md-5 d-inline-block sub-container"
                      style={{ minWidth: '100%' }}
                    >
                      <div className="col-md-12 heading">
                        Daily Planning made simple!
                      </div>
                      <div className="col-md-12 text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean euismod bibendum laoreet.{' '}
                      </div>
                      <div className="col-md-12 text-left">
                        <Link
                          to="/signup"
                          className="btn btn-primary col-md-5 button"
                        >
                          Sign up as Individual
                        </Link>
                        <Link
                          to="/signup"
                          className="btn btn-primary ml-3 col-md-5 button"
                        >
                          Sign up as Organisation
                        </Link>
                      </div>
                      <div className="col-md-12 signin">
                        Already have DailyPloy account?
                        <Link to="/login">SignIn</Link>
                      </div>
                    </div>
                  </div>{' '}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(Landing)
