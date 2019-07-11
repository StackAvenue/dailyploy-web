import React, { Component } from "react";
import "../assets/css/dashboard.css";

class Header extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <nav class="navbar navbar-expand-lg navbar-light header-bgcolor">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <a class="navbar-brand" href="#">DailyPloy</a>

                <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
                    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    </ul>
                    <button class="btn btn-outline-success my-2 my-sm-0" onClick={this.props.logout}>Logout</button>
                </div>
            </nav>
        )
    }
}

export default Header;