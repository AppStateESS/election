import React from 'react';

class DateMixin extends React.Component {
    initStartDate() {
        $('#start-date').datetimepicker({
            minDate: tomorrow,
            value: this.state.startDate,
            format: dateFormat,
            onChangeDateTime: function(ct, i) {
                this.updateStartDate(this.refs.startDate.value);
            }.bind(this)
        });
    }
    initEndDate() {
        $('#end-date').datetimepicker({
            minDate: 0,
            format: dateFormat,
            value: this.state.endDate,
            onChangeDateTime: function(ct, i) {
                this.updateEndDate(this.refs.endDate.value);
            }.bind(this)
        });
    }
    changeStartDate(e) {
        this.updateStartDate(e.target.value);
    }
    changeEndDate(e) {
        this.updateEndDate(e.target.value);
    }
    hasDateErrors() {
        var error = false;

        if (this.state.startDate.length === 0) {
            $(this.refs.startDate).css('borderColor', 'red').attr('placeholder', 'Please enter a start date');
            error = true;
        } else if (this.state.unixStart > this.state.unixEnd) {
            $(this.refs.endDate).css('borderColor', 'red').attr('placeholder', 'End date must be greater').val('');
            this.setState({endDate: '', unixEnd: 0});
            error = true;
        }

        if (this.state.endDate.length === 0) {
            $(this.refs.endDate).css('borderColor', 'red').attr('placeholder', 'Please enter a end date');
            error = true;
        }

        return error;
    }
    updateStartDate(start) {
        var dateObj = new Date(start);
        var unix = dateObj.getTime() / 1000;
        this.setState({startDate: start, unixStart: unix});
    }
    updateEndDate(end) {
        var dateObj = new Date(end);
        var unix = dateObj.getTime() / 1000;
        this.setState({endDate: end, unixEnd: unix});
    }
    checkForConflict() {
        return $.getJSON('election/Admin/Election', {
            command: 'checkConflict',
            startDate: this.state.unixStart,
            endDate: this.state.unixEnd,
            electionId: this.props.electionId
        });
    }
    showStartCalendar() {
        $('#start-date').datetimepicker('show');
    }
    showEndCalendar() {
        $('#end-date').datetimepicker('show');
    }
    resetBorder(node) {
        $(node.target).removeAttr('style');
    }
};

export default DateMixin;
