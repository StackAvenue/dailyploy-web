import React from "react";

const GridBlock = props => {
  return (
    <div className="grid-div" key={props.index}>
      <div className="col-md-12 id">{props.index + 1}</div>
      <div className="col-md-12 name">{props.project.name}</div>
      <div className="col-md-12 no-padding">
        <div className="col-md-2 d-inline-block no-padding">
          <div className="user-block">
            {"Arpit Jain"
              .split(" ")
              .map(x => x[0])
              .join("")}
          </div>
        </div>
        <div className="col-md-8 d-inline-block no-padding">
          <span>
            {props.projectUser.slice(0, 4).map((user, index) => {
              return (
                <div key={index} className="user-block">
                  <span>
                    {user
                      .split(" ")
                      .map(x => x[0])
                      .join("")}
                  </span>
                </div>
              );
            })}
          </span>
          <span>
            <div className="user-block" style={{ backgroundColor: "#33a1ff" }}>
              <span>+{props.countIncrese(props.projectUser)}</span>
            </div>
          </span>
        </div>
        <div className="col-md-2 d-inline-block no-padding">
          <div
            className="grid-color"
            style={{
              "background-color": `${props.project.color_code}`,
              "margin-bottom": "-7px",
            }}
          ></div>
        </div>
      </div>
      <div className="col-md-12 no-padding">
        <div className="col-md-8 d-inline-block date">
          {props.project.start_date} - 2024-08-04
        </div>
        <div className="col-md-4 d-inline-block duration">
          {props.monthDiff(
            props.getDate(props.project.start_date),
            props.getDate("2024-08-04")
          )}
          &nbsp; months
        </div>
      </div>
    </div>
  );
};

export default GridBlock;
