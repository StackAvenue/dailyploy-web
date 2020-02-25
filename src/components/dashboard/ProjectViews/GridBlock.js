import React from "react";
import { firstTwoLetter, textTitlize } from "../../../utils/function";

const GridBlock = props => {
  return (
    <div className="grid-div" key={props.index}>
      <div className="col-md-12 id">
        {`${"P-00"}${props.index + 1}`}{" "}
        <div className="proj-grid-edit">
          <input
            className="styled-checkbox"
            id={`styled-checkbox-${props.index}`}
            type="checkbox"
            name="isChecked"
            onChange={e => props.handleCheck(e, props.project)}
          />
          <label htmlFor={`styled-checkbox-${props.index}`}></label>
          <button
            className="btn"
            onClick={() => props.handleEditShow(props.project)}
          >
            <i className="fas fa-pencil-alt"></i>
          </button>
        </div>
      </div>
      <div className="col-md-12 name text-titlize">{props.project.name}</div>
      <div className="col-md-12 no-padding">
        <div className="col-md-2 d-inline-block no-padding">
          <div
            className="owner-block"
            title={textTitlize(props.project.owner.name)}
          >
            {firstTwoLetter(props.project.owner.name)}
          </div>
        </div>
        <div className="col-md-8 d-inline-block no-padding">
          <span>
            {props.project.members.slice(0, 4).map((user, index) => {
              return (
                <div
                  key={index}
                  className="user-block"
                  title={textTitlize(user.name)}
                >
                  <span>{firstTwoLetter(user.name)}</span>
                </div>
              );
            })}
          </span>
          <span>
            {props.countIncrese(props.project.members.map(user => user.name))}
          </span>
        </div>
        <div className="col-md-2 d-inline-block no-padding">
          <div
            className="grid-color"
            style={{
              backgroundColor: `${props.project.color_code}`,
              marginBottom: "-7px"
            }}
          ></div>
        </div>
      </div>
      <div className="col-md-12 no-padding">
        <div className="col-md-8 d-inline-block date">
          {props.project.start_date} -{" "}
          {props.project.end_date ? props.project.end_date : "undefined"}
        </div>
        <div className="col-md-4 d-inline-block duration">
          {props.monthDiff(
            props.getDate(props.project.start_date),
            props.getDate(props.project.end_date)
          )}
        </div>
      </div>
    </div>
  );
};

export default GridBlock;
