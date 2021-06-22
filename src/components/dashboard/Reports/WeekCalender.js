import React from 'react';
// import Helmet from 'react-helmet';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import ErrorBoundary from '../../../ErrorBoundary';

function getWeekDays(weekStart) {
    const days = [weekStart];
    for (let i = 1; i < 7; i += 1) {
        days.push(
            moment(weekStart)
                .add(i, 'days')
                .toDate()
        );
    }
    return days;
}

function getWeekRange(date) {
    return {
        from: moment(date)
            .startOf('week')
            .toDate(),
        to: moment(date)
            .endOf('week')
            .toDate(),
    };
}

export default class WeekCalender extends React.Component {
    state = {
        hoverRange: undefined,
        selectedDays: [],
    };

    handleDayChange = date => {
        this.setState({
            selectedDays: getWeekDays(getWeekRange(date).from),
        });
    };

    handleDayEnter = date => {
        this.setState({
            hoverRange: getWeekRange(date),
        });
    };

    handleDayLeave = () => {
        this.setState({
            hoverRange: undefined,
        });
    };

    handleWeekClick = (weekNumber, days, e) => {
        this.setState({
            selectedDays: days,
        });
    };

    render() {
        const { hoverRange, selectedDays } = this.state;

        const daysAreSelected = selectedDays.length > 0;

        const modifiers = {
            hoverRange,
            selectedRange: daysAreSelected && {
                from: selectedDays[0],
                to: selectedDays[6],
            },
            hoverRangeStart: hoverRange && hoverRange.from,
            hoverRangeEnd: hoverRange && hoverRange.to,
            selectedRangeStart: daysAreSelected && selectedDays[0],
            selectedRangeEnd: daysAreSelected && selectedDays[6],
        };

        return (
            <div className="SelectedWeekExample">
                <ErrorBoundary>
                    <DayPicker
                        selectedDays={selectedDays}
                        showWeekNumbers
                        showOutsideDays
                        modifiers={modifiers}
                        onDayClick={this.handleDayChange}
                        onDayMouseEnter={this.handleDayEnter}
                        onDayMouseLeave={this.handleDayLeave}
                        onWeekClick={this.handleWeekClick}
                    />
                </ErrorBoundary>
                {selectedDays.length === 7 && (
                    <div>
                        {moment(selectedDays[0]).format('LL')} –{' '}
                        {moment(selectedDays[6]).format('LL')}
                    </div>
                )}
            </div>
        );
    }
}