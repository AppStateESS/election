var ElectionForm = React.createClass({
    displayName: 'ElectionForm',

    getInitialState: function () {
        return {
            title: '',
            startDate: '',
            endDate: '',
            unixStart: 0,
            unixEnd: 0
        };
    },

    getDefaultProps: function () {
        return {
            electionId: 0,
            title: '',
            startDate: '',
            endDate: '',
            hideForm: null
        };
    },

    componentWillMount: function () {
        if (this.props.electionId) {
            this.copyPropsToState();
        }
    },

    componentDidMount: function () {
        this.initStartDate();
        this.initEndDate();
    },

    copyPropsToState: function () {
        this.setState({
            title: this.props.title,
            startDate: this.props.startDateFormatted,
            endDate: this.props.endDateFormatted,
            unixStart: this.props.startDate,
            unixEnd: this.props.endDate
        });
    },

    initStartDate: function () {
        $('#start-date').datetimepicker({
            minDate: 0,
            value: this.state.startDate,
            format: dateFormat,
            onChangeDateTime: function (ct, i) {
                this.updateStartDate(this.refs.startDate.value);
            }.bind(this)
        });
    },

    initEndDate: function () {
        $('#end-date').datetimepicker({
            minDate: 0,
            format: dateFormat,
            value: this.state.endDate,
            onChangeDateTime: function (ct, i) {
                this.updateEndDate(this.refs.endDate.value);
            }.bind(this)
        });
    },

    changeStartDate: function (e) {
        this.updateStartDate(e.target.value);
    },

    changeEndDate: function (e) {
        this.updateEndDate(e.target.value);
    },

    updateTitle: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    updateStartDate: function (start) {
        var dateObj = new Date(start);
        var unix = dateObj.getTime() / 1000;
        this.setState({
            startDate: start,
            unixStart: unix
        });
    },

    updateEndDate: function (end) {
        var dateObj = new Date(end);
        var unix = dateObj.getTime() / 1000;
        this.setState({
            endDate: end,
            unixEnd: unix
        });
    },

    showStartCalendar: function () {
        $('#start-date').datetimepicker('show');
    },

    showEndCalendar: function () {
        $('#end-date').datetimepicker('show');
    },

    resetBorder: function (node) {
        $(node.target).removeAttr('style');
    },

    checkForErrors: function () {
        var error = false;
        if (this.state.title.length === 0) {
            $(this.refs.electionTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }

        if (this.state.startDate.length === 0) {
            $(this.refs.startDate).css('borderColor', 'red').attr('placeholder', 'Please enter a start date');
            error = true;
        } else if (this.state.unixStart > this.state.unixEnd) {
            $(this.refs.endDate).css('borderColor', 'red').attr('placeholder', 'End date must be greater').val('');
            this.setState({
                endDate: '',
                unixEnd: 0
            });
            error = true;
        }

        if (this.state.endDate.length === 0) {
            $(this.refs.endDate).css('borderColor', 'red').attr('placeholder', 'Please enter a end date');
            error = true;
        }

        return error;
    },

    checkForConflict: function () {
        return $.getJSON('election/Admin/Election', {
            command: 'checkConflict',
            startDate: this.state.unixStart,
            endDate: this.state.unixEnd,
            electionId: this.props.electionId
        });
    },

    save: function () {
        var error = this.checkForErrors();
        if (error === false) {
            var conflict = this.checkForConflict();
            conflict.done(function (data) {
                if (data.conflict === false) {
                    $.post('election/Admin/Election', {
                        command: 'save',
                        electionId: this.props.electionId,
                        title: this.state.title,
                        startDate: this.state.unixStart,
                        endDate: this.state.unixEnd
                    }, null, 'json').done(function (data) {
                        this.props.load();
                    }.bind(this)).always(function () {
                        this.props.hideForm();
                    }.bind(this));
                } else {
                    $(this.refs.startDate).css('borderColor', 'red').attr('placeholder', 'Date conflict');
                    $(this.refs.endDate).css('borderColor', 'red').attr('placeholder', 'Date conflict');
                    this.setState({
                        startDate: '',
                        unixStart: 0,
                        endDate: '',
                        unixEnd: 0
                    });
                }
            }.bind(this));
        }
    },

    render: function () {
        var title = React.createElement('input', { ref: 'electionTitle', type: 'text', className: 'form-control', defaultValue: this.props.title,
            id: 'election-title', onFocus: this.resetBorder, onChange: this.updateTitle, placeholder: 'Title (e.g. Fall 2016 Election)' });
        var date = React.createElement(
            'div',
            { className: 'row pad-top' },
            React.createElement(
                'div',
                { className: 'col-sm-6' },
                React.createElement(
                    'div',
                    { className: 'input-group' },
                    React.createElement('input', { placeholder: 'Voting start date and time', ref: 'startDate', type: 'text', className: 'form-control datepicker', id: 'start-date',
                        onFocus: this.resetBorder, onChange: this.changeStartDate, value: this.state.startDate }),
                    React.createElement(
                        'div',
                        { className: 'input-group-addon' },
                        React.createElement('i', { className: 'fa fa-calendar', onClick: this.showStartCalendar })
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'col-sm-6' },
                React.createElement(
                    'div',
                    { className: 'input-group' },
                    React.createElement('input', { placeholder: 'Voting deadline', ref: 'endDate', type: 'text', className: 'form-control datepicker', id: 'end-date',
                        onFocus: this.resetBorder, onChange: this.changeEndDate, value: this.state.endDate }),
                    React.createElement(
                        'div',
                        { className: 'input-group-addon' },
                        React.createElement('i', { className: 'fa fa-calendar', onClick: this.showEndCalendar })
                    )
                )
            )
        );
        var buttons = React.createElement(
            'div',
            null,
            React.createElement(
                'button',
                { className: 'btn btn-primary btn-block', onClick: this.save },
                React.createElement('i', { className: 'fa fa-save' }),
                ' Save election'
            ),
            React.createElement(
                'button',
                { className: 'btn btn-danger btn-block', onClick: this.props.hideForm },
                React.createElement('i', { className: 'fa fa-times' }),
                ' Cancel'
            )
        );

        var heading = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-9' },
                title,
                date
            ),
            React.createElement(
                'div',
                { className: 'col-sm-3' },
                buttons
            )
        );

        return React.createElement(Panel, { type: 'info', heading: heading });
    }

});