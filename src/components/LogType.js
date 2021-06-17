import React from "react";
import PropTypes from 'prop-types';

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
LogType.propTypes = {
    timetrack_enabled: PropTypes.bool.isRequired,
    changeLogType: PropTypes.func.isRequired
}
export default LogType