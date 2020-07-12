import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, post, logout, put, del } from "../../utils/API";
import MenuBar from "../dashboard/MenuBar"
import "../../assets/css/TaskProjectList.scss"
const ProjectList = props => {
    
    return (
        <div key={props.id} className="projectListTopCard" style={{border:`solid 5px`+`${props.bgcolor}`}}>
            <div className="projectListInCard">
            <div className="textCard">
    {props.name}
        </div>
        <div className="buttonCard" >
         
                {/* <button className="buttonCardIcon " style={{border:`solid 5px`+`${props.bgcolor}`}}> */}
                {!props.showbutton?<button className="buttonCardIcon ">
          <i class="fa fa-plus"/></button>:
          
          <button className="buttonCardIcon2 ">
          <i class="fa fa-check" ></i></button>}
          
        </div>
        </div>
            
        </div>
    );

}
export default ProjectList;