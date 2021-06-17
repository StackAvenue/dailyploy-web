import React from "react";
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

const ChecklistAddTask = (props) => {
    return (
        <div className="header">
          <input
                type={Text}
                value={props.inputTaskData}
                placeholder="Enter Goal"
                onChange={(e) => props.handleInputChange(e)}
                name="taskName"
                className="checklist-input"
            />
            &nbsp;&nbsp;&nbsp;
            <Button variant="success" onClick={props.handleSave}>Add</Button>&nbsp;&nbsp;&nbsp;
            <Button variant="light" onClick={props.closeAddTask}>X</Button> 
        </div>
    )
};
ChecklistAddTask.propTypes = {
    closeAddTask: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    inputTaskData: PropTypes.string.isRequired,
}

export default ChecklistAddTask;
