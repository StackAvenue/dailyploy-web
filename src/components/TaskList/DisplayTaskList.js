import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Modal,Button,NavDropdown } from "react-bootstrap";
import Task from "./Task";
class DisplayTaskList extends Component {
    constructor(props) {
      super(props);
      this.state = {
          PlusIcon:true,
          TaskShow:false
    };       
}
displayList=()=>{
    if(this.state.PlusIcon){
    this.setState({PlusIcon:false})
    }else
    this.setState({PlusIcon:true})
}
displayAddTask=()=>{
    this.setState({TaskShow:true})}
    closeAddTask=()=>{
        this.setState({TaskShow:false})}
        saveAddTask=()=>{
            
        }    
       




render() {
        
    return (
     
        <div key={this.props.id} className="DisplayprojectListTopCard">
        <div className="projectListInCard">
        <div className="cardAndButton" >  
        <div className="buttonCard" >
        <button className="buttonCardIcon" style={{border:`solid 1px gray`}} onClick={this.displayList}>
        {this.state.PlusIcon?<i class="fa fa-plus"/>:<i class="fa fa-minus"/>}</button>
        </div> 
        <div className="textCard" >
        {this.props.ProjectTask.name}&nbsp;(&nbsp;{this.props.ProjectTask.start_date}&nbsp;To&nbsp;{this.props.ProjectTask.end_date}&nbsp;)
        </div>
        {!this.state.PlusIcon?<div className="filterAndGroup">
        <div className="filterby">
        <div className="navDiv">
            
                <NavDropdown title="Filter By" id="basic-nav-dropdown" className="btn btn-color">
              <NavDropdown.Item >Status</NavDropdown.Item>
              <NavDropdown.Item ><input type="checkbox" id="" name="" value=""/>&nbsp;&nbsp;Completed</NavDropdown.Item>
              <NavDropdown.Item ><input type="checkbox" id="" name="" value=""/>&nbsp;&nbsp;Not Started</NavDropdown.Item>
              <NavDropdown.Item ><input type="checkbox" id="" name="" value="" />&nbsp;&nbsp;In Progress</NavDropdown.Item>
              <NavDropdown.Item >Member</NavDropdown.Item>
              {this.props.projects.map((project, inde) => {return(
               <div key={inde}> {project.members.map((member,id)=> ( <NavDropdown.Item><input type="checkbox" id={id} name="" value=""/>&nbsp;&nbsp;{member.name}</NavDropdown.Item>))}</div>
              )})}
              </NavDropdown>
        </div>
        </div>
        <div className="groupby">
        <div className="navDiv">
                <NavDropdown title="Group By" id="basic-nav-dropdown" className="btn btn-color">
              <NavDropdown.Item >Status</NavDropdown.Item>
              <NavDropdown.Item >Mamber</NavDropdown.Item>
              </NavDropdown>
        </div>
        </div>
        {/* <div className="processDiv">
        <div className="process">
            <p>Total-10</p>
            <p>Completed-7</p>
            <p>In Process-10</p>
            <p>Not Started</p>
        </div>
        </div> */}
        </div>
        :null}
        </div>

        
    </div>
    {!this.state.PlusIcon?<>
        {this.state.TaskShow?<>
    <div className="showCardDetails">
      {/* <div className="TaskAndCard"> */}
        <Task
        projects={this.props.projects}/>
{/* </div> */}
<div className="rightMark">
    <button variant="light" className="btn btn-colo" onClick={this.closeAddTask}><i class="fa fa-check"/></button>
    </div>
    </div>
    </>
        :null}
        
    <div className="container2OpenModal1">
    <button variant="light" className=" btn btn-colo" onClick={this.displayAddTask}><i class="fa fa-plus"/> Add Task </button>
    {this.state.TaskShow?<>

        

        </>
        :null}
    </div>
    </>
        :null}

    </div>
    
    
);
}

}
export default withRouter(DisplayTaskList);