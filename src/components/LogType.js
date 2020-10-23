import React from "react";

const LogType = props => {
    const { timetrack_enabled } = props;
    return <React.Fragment>
        <p>Select log time type</p>
        <label class="radio-inline">
            <input type="radio" name="timetrack_enabled" checked={!timetrack_enabled} onChange={() => props.changeLogType(false)} />Time Logging
    </label>
        <label class="radio-inline">
            <input type="radio" name="timetrack_enabled" checked={timetrack_enabled} onChange={() => props.changeLogType(true)} />Time Tracking
    </label>
    </React.Fragment>
}
export default LogType