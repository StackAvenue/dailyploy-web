import React, { useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "../../assets/css/TaskProjectList.scss";
import "../../assets/css/AddProjectTaskModel.scss";

const AddProjectTaskModel = (props) => {
  const calendarFromRef = useRef(null);
  const calendarToRef = useRef(null);

  const openFromCalender = () => {
    calendarFromRef.current.setOpen(true);
  };
  const openToCalender = () => {
    calendarToRef.current.setOpen(true);
  };

  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  }

  return (
    <div className="addProjectDiv">
      <Modal show={props.show} onHide={props.closeTaskModal} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{props.isEdit ? "Edit" : "Create"} Roadmap</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className=" inputtext">
              <label for="">Title&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <input
                type="text"
                name="taskName"
                value={props.state.Name}
                onChange={(e) => props.handleInputChange(e)}
                placeholder="Enter title"
                className=""
              />
            </div>
            <div className="AddDatePicker">
              <div className="divInline-from">
                <div className="datefromto">From&nbsp; </div>
                <div className="dateDiv">
                  <DatePicker
                    className=""
                    ref={calendarFromRef}
                    selected={props.state.dateFrom}
                    // minDate={props.state.dateFrom}
                    onChange={props.handleDateFrom}
                    maxDate={props.state.dateTo}
                    placeholderText="Select Date"
                    onChangeRaw={handleDateChangeRaw}
                  />
                  <i
                    onClick={openFromCalender}
                    className="fa fa-calendar calendar-icon"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
              <div className="divInline-to">
                <div className="datefromto">&nbsp;To&nbsp;</div>
                {/* &nbsp;&nbsp; */}
                <div className="dateDiv">
                  <DatePicker
                    className=""
                    ref={calendarToRef}
                    minDate={props.state.dateFrom}
                    selected={props.state.dateTo}
                    onChange={props.handleDateTo}
                    placeholderText="Select Date"
                    onChangeRaw={handleDateChangeRaw}
                  />
                  <i
                    onClick={openToCalender}
                    className="fa fa-calendar calendar-icon"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            disabled={!props.state.Name}
            onClick={(e) => {
              e.preventDefault();
              props.handleSaveTaskData();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddProjectTaskModel;
