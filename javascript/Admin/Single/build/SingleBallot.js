'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var SingleBallot = React.createClass({
    displayName: 'SingleBallot',

    mixins: ['Panel'],

    getInitialState: function () {
        return {
            ballotList: []
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {
        $.getJSON('election/Admin/Single', {
            command: 'list'
        }).done(function (data) {
            this.setState({
                ballotList: data
            });
        }.bind(this));
    },

    render: function () {
        return React.createElement(
            'div',
            { className: 'election-list' },
            React.createElement(BalloutList, { listing: this.state.ballotList, reload: this.load })
        );
    }

});

var BalloutList = React.createClass({
    displayName: 'BalloutList',

    getInitialState: function () {
        return {
            ballotEditId: 0
        };
    },

    getDefaultProps: function () {
        return {
            listing: [],
            reload: null
        };
    },

    editBallot: function (ballotId) {
        this.setState({
            ballotEditId: ballotId
        });
    },

    render: function () {
        var form = null;

        if (this.state.ballotEditId === -1) {
            form = React.createElement(SingleBallotForm, { hideForm: this.editBallot.bind(null, 0), reload: this.props.reload });
        }

        var ballotList = this.props.listing.map(function (value) {
            if (value.id === this.state.ballotEditId) {
                return React.createElement(SingleBallotForm, _extends({ key: value.id }, value, { hideForm: this.editBallot.bind(null, 0), reload: this.props.reload }));
            } else {
                return React.createElement(BallotListRow, _extends({ key: value.id }, value, { handleEdit: this.editBallot.bind(null, value.id), reload: this.props.reload }));
            }
        }.bind(this));

        if (ballotList.length === 0) {
            ballotList = React.createElement(
                'div',
                null,
                React.createElement(
                    'h3',
                    null,
                    'No ballots found.'
                )
            );
        }

        return React.createElement(
            'div',
            null,
            React.createElement(
                'button',
                { className: 'btn btn-success', onClick: this.editBallot.bind(null, -1) },
                React.createElement('i', { className: 'fa fa-plus' }),
                ' Create ballot'
            ),
            React.createElement('hr', null),
            form,
            ballotList
        );
    }

});

var BallotListRow = React.createClass({
    displayName: 'BallotListRow',

    mixins: ['Panel'],

    getDefaultProps: function () {
        return {
            endDateFormatted: '',
            startDateFormatted: '',
            title: '',
            id: 0,
            handleEdit: null
        };
    },

    handleDelete: function (event) {
        if (confirm('Are you sure you want to delete this ballot?')) {
            $.post('election/Admin/Single', {
                command: 'delete',
                ballotId: this.props.id
            }, null, 'json').done(function (data) {
                this.props.reload();
            }.bind(this));
        }
    },

    render: function () {
        var heading = React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'change-buttons' },
                React.createElement(
                    'button',
                    { className: 'btn btn-primary', 'data-vid': this.props.id, onClick: this.props.handleEdit },
                    React.createElement('i', { className: 'fa fa-edit' })
                ),
                React.createElement(
                    'button',
                    { className: 'btn btn-danger', onClick: this.handleDelete },
                    React.createElement('i', { className: 'fa fa-times' })
                )
            ),
            React.createElement(
                'h3',
                null,
                this.props.title
            )
        );
        var body = React.createElement(
            'div',
            null,
            React.createElement(
                'h4',
                null,
                'Voting period: ',
                React.createElement(
                    'span',
                    { className: 'text-info date-stamp' },
                    this.props.startDateFormatted
                ),
                ' to ',
                React.createElement(
                    'span',
                    { className: 'text-info date-stamp' },
                    this.props.endDateFormatted
                )
            ),
            React.createElement('hr', null),
            React.createElement(Tickets, { ballotId: this.props.id })
        );
        return React.createElement(Panel, { heading: heading, body: body });
    }

});

var SingleBallotForm = React.createClass({
    displayName: 'SingleBallotForm',

    getInitialState: function () {
        return {
            ballotId: 0,
            title: '',
            startDate: '',
            endDate: '',
            unixStart: 0,
            unixEnd: 0
        };
    },

    getDefaultProps: function () {
        return {
            id: 0,
            title: '',
            startDate: '',
            endDate: '',
            hideForm: null
        };
    },

    componentWillMount: function () {
        if (this.props.id) {
            this.copyPropsToState();
        }
    },

    componentDidMount: function () {
        this.initStartDate();
        this.initEndDate();
    },

    copyPropsToState: function () {
        this.setState({
            ballotId: this.props.id,
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

    showStartCalendar: function () {
        $('#start-date').datetimepicker('show');
    },

    showEndCalendar: function () {
        $('#end-date').datetimepicker('show');
    },

    updateTitle: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    changeStartDate: function (e) {
        this.updateStartDate(e.target.value);
    },

    changeEndDate: function (e) {
        this.updateEndDate(e.target.value);
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

    checkForErrors: function () {
        var error = false;
        if (this.state.title.length === 0) {
            $(this.refs.ballotTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }

        if (this.state.startDate.length === 0) {
            $(this.refs.startDate).css('borderColor', 'red').attr('placeholder', 'Please enter a start date');
            error = true;
        } else if (this.state.unixStart > this.state.unixEnd) {
            $(this.refs.endDate).css('borderColor', 'red').attr('placeholder', 'End date must be greater').val('');
            this.setState({
                endDate: ''
            });
            error = true;
        }

        if (this.state.endDate.length === 0) {
            $(this.refs.endDate).css('borderColor', 'red').attr('placeholder', 'Please enter a end date');
            error = true;
        }

        return error;
    },

    save: function () {
        var error = this.checkForErrors();
        if (error === false) {
            $.post('election/Admin/Single', {
                command: 'save',
                ballotId: this.state.ballotId,
                title: this.state.title,
                startDate: this.state.unixStart,
                endDate: this.state.unixEnd
            }, null, 'json').done(function (data) {
                this.props.reload();
            }.bind(this)).always(function () {
                this.props.hideForm();
            }.bind(this));
        }
    },

    resetBorder: function (node) {
        $(node.target).removeAttr('style');
    },

    render: function () {
        var heading = React.createElement('input', { ref: 'ballotTitle', type: 'text', className: 'form-control', defaultValue: this.props.title,
            id: 'ballot-title', onFocus: this.resetBorder, onChange: this.updateTitle, placeholder: 'Ballot title' });

        var body = React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-sm-6' },
                    React.createElement(
                        'div',
                        { className: 'form-inline' },
                        React.createElement(
                            'div',
                            { className: 'form-group' },
                            React.createElement(
                                'label',
                                { htmlFor: 'start-date', className: 'control-label pad-right' },
                                'Start voting:'
                            ),
                            React.createElement(
                                'div',
                                { className: 'input-group' },
                                React.createElement('input', { ref: 'startDate', type: 'text', className: 'form-control datepicker', id: 'start-date', onFocus: this.resetBorder, onChange: this.changeStartDate }),
                                React.createElement(
                                    'div',
                                    { className: 'input-group-addon' },
                                    React.createElement('i', { className: 'fa fa-calendar', onClick: this.showStartCalendar })
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-6' },
                    React.createElement(
                        'div',
                        { className: 'form-inline' },
                        React.createElement(
                            'div',
                            { className: 'form-group' },
                            React.createElement(
                                'label',
                                { htmlFor: 'end-date', className: 'control-label pad-right' },
                                'End voting:'
                            ),
                            React.createElement(
                                'div',
                                { className: 'input-group' },
                                React.createElement('input', { ref: 'endDate', type: 'text', className: 'form-control datepicker', id: 'end-date', onFocus: this.resetBorder, onChange: this.changeEndDate }),
                                React.createElement(
                                    'div',
                                    { className: 'input-group-addon' },
                                    React.createElement('i', { className: 'fa fa-calendar', onClick: this.showEndCalendar })
                                )
                            )
                        )
                    )
                )
            ),
            React.createElement('hr', null),
            React.createElement(
                'button',
                { className: 'btn btn-primary pad-right', onClick: this.save },
                React.createElement('i', { className: 'fa fa-save' }),
                ' Save ballot'
            ),
            React.createElement(
                'button',
                { className: 'btn btn-danger', onClick: this.props.hideForm },
                React.createElement('i', { className: 'fa fa-times' }),
                ' Cancel'
            )
        );

        return React.createElement(Panel, { heading: heading, body: body });
    }
});

ReactDOM.render(React.createElement(SingleBallot, null), document.getElementById('single-ballot'));