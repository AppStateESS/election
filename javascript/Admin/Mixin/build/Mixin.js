'use strict';

var Modal = React.createClass({
    displayName: "Modal",

    getDefaultProps: function () {
        return {
            title: null,
            modalId: null,
            body: null
        };
    },

    render: function () {
        return React.createElement(
            "div",
            { className: "modal", id: this.props.modalId, tabIndex: "-1", role: "dialog" },
            React.createElement(
                "div",
                { className: "modal-dialog", role: "document" },
                React.createElement(
                    "div",
                    { className: "modal-content" },
                    React.createElement(
                        "div",
                        { className: "modal-header" },
                        React.createElement(
                            "button",
                            { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                            React.createElement(
                                "span",
                                { "aria-hidden": "true" },
                                "×"
                            )
                        ),
                        React.createElement(
                            "h4",
                            { className: "modal-title" },
                            this.props.title
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "modal-body" },
                        this.props.body
                    )
                )
            )
        );
    }
});

var Panel = React.createClass({
    displayName: "Panel",

    getDefaultProps: function () {
        return {
            type: 'default',
            heading: '',
            body: '',
            footer: ''
        };
    },

    render: function () {
        var heading = null;
        if (this.props.heading) {
            heading = React.createElement(
                "div",
                { className: "panel-heading" },
                this.props.heading
            );
        }

        var body = null;
        if (this.props.body) {
            body = React.createElement(
                "div",
                { className: "panel-body" },
                this.props.body
            );
        }

        var footer = null;
        if (this.props.footer) {
            footer = React.createElement(
                "div",
                { className: "panel-footer" },
                this.props.footer
            );
        }

        var panelType = 'panel panel-' + this.props.type;
        return React.createElement(
            "div",
            { className: panelType },
            heading,
            React.createElement(
                ReactCSSTransitionGroup,
                { transitionName: "expand", transitionEnterTimeout: 500, transitionLeaveTimeout: 500 },
                body
            ),
            footer
        );
    }
});

var Ballot = {
    getInitialState: function () {
        return {
            ballotList: []
        };
    },

    componentDidMount: function () {
        this.load();
    },

    render: function () {
        return React.createElement(
            "div",
            { className: "election-list" },
            React.createElement(BallotList, { listing: this.state.ballotList, reload: this.load })
        );
    }
};

var BallotListMixin = {
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
    }
};

var BallotForm = {
    getInitialState: function () {
        return {
            ballotId: 0,
            title: '',
            startDate: '',
            endDate: '',
            unixStart: 0,
            unixEnd: 0,
            seats: 1
        };
    },

    getDefaultProps: function () {
        return {
            id: 0,
            title: '',
            startDate: '',
            endDate: '',
            hideForm: null,
            seats: 1
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
            unixEnd: this.props.endDate,
            seats: this.props.seats
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
            $('#ballot-title').css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }

        if (this.state.startDate.length === 0) {
            $('#start-date').css('borderColor', 'red').attr('placeholder', 'Please enter a start date');
            error = true;
        } else if (this.state.unixStart > this.state.unixEnd) {
            $('#end-date').css('borderColor', 'red').attr('placeholder', 'End date must be greater').val('');
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

    resetBorder: function (node) {
        $(node.target).removeAttr('style');
    },

    _render: function () {
        var heading = React.createElement(BallotFormHeading, { resetBorder: this.resetBorder, handleChange: this.updateTitle });

        var seatNumber = '';

        if (this.props.seatNumber > 1) {
            var options = '';
            for (var i; i <= 25; i++) {
                options += '<option>' + i + '</option>';
            }
            seatNumber = React.createElement(
                "div",
                null,
                React.createElement(
                    "select",
                    { onChange: this.props.updateSeats },
                    options
                )
            );
        }

        var body = React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-sm-6" },
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "start-date", className: "control-label pad-right" },
                            "Start voting:"
                        ),
                        React.createElement(
                            "div",
                            { className: "input-group" },
                            React.createElement("input", { type: "text", className: "form-control datepicker", id: "start-date", onFocus: this.props.resetBorder, onChange: this.props.changeStartDate }),
                            React.createElement(
                                "div",
                                { className: "input-group-addon" },
                                React.createElement("i", { className: "fa fa-calendar", onClick: this.props.startClick })
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-6" },
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "end-date", className: "control-label pad-right" },
                            "End voting:"
                        ),
                        React.createElement(
                            "div",
                            { className: "input-group" },
                            React.createElement("input", { type: "text", className: "form-control datepicker", id: "end-date", onFocus: this.props.resetBorder, onChange: this.props.changeEndDate }),
                            React.createElement(
                                "div",
                                { className: "input-group-addon" },
                                React.createElement("i", { className: "fa fa-calendar", onClick: this.props.endClick })
                            )
                        )
                    )
                )
            ),
            seatNumber,
            React.createElement("hr", null),
            React.createElement(
                "button",
                { className: "btn btn-primary pad-right", onClick: this.props.saveClick },
                React.createElement("i", { className: "fa fa-save" }),
                " Save ballot"
            ),
            React.createElement(
                "button",
                { className: "btn btn-danger", onClick: this.props.hideClick },
                React.createElement("i", { className: "fa fa-times" }),
                " Cancel"
            )
        );

        return React.createElement(Panel, { heading: heading, body: body });
    }
};

var BallotFormHeading = React.createClass({
    displayName: "BallotFormHeading",

    getDefaultProps: function () {
        return {};
    },

    render: function () {
        return React.createElement("input", { type: "text", className: "form-control", defaultValue: this.props.title,
            id: "ballot-title", onFocus: this.props.resetBorder, onChange: this.props.handleChange, placeholder: "Ballot title" });
    }

});