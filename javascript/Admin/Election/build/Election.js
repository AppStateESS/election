'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Election = React.createClass({
    displayName: 'Election',

    getInitialState: function () {
        return {
            formId: -1,
            elections: []
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {
        $.getJSON('election/Admin/Election', {
            command: 'list'
        }).done(function (data) {
            this.setState({
                elections: data
            });
        }.bind(this));
    },

    showForm: function () {
        this.setState({
            formId: 0
        });
    },

    hideForm: function () {
        this.setState({
            formId: -1
        });
    },

    render: function () {
        var form = null;
        var sharedFunc = { hideForm: this.hideForm, load: this.load };
        if (this.state.formId === 0) {
            form = React.createElement(ElectionForm, _extends({ electionId: 0 }, sharedFunc));
        }

        return React.createElement(
            'div',
            null,
            React.createElement(CreateElectionButton, { handleClick: this.showForm }),
            form,
            React.createElement(ElectionList, { elections: this.state.elections, hideForm: this.hideForm, load: this.load })
        );
    }

});

var CreateElectionButton = props => React.createElement(
    'button',
    { className: 'btn btn-lg btn-primary', onClick: props.handleClick },
    React.createElement('i', { className: 'fa fa-gavel' }),
    ' Create new election'
);

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
                    React.createElement('input', { placeholder: 'Voting start date and time', ref: 'startDate', type: 'text', className: 'form-control datepicker', id: 'start-date', onFocus: this.resetBorder, onChange: this.changeStartDate }),
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
                    React.createElement('input', { placeholder: 'Voting deadline', ref: 'endDate', type: 'text', className: 'form-control datepicker', id: 'end-date', onFocus: this.resetBorder, onChange: this.changeEndDate }),
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

var ElectionList = React.createClass({
    displayName: 'ElectionList',

    getInitialState: function () {
        return {
            currentEdit: 0
        };
    },

    getDefaultProps: function () {
        return {
            elections: [],
            hideForm: null
        };
    },

    editRow: function (electionId) {
        this.props.hideForm();
        this.setState({
            currentEdit: electionId
        });
    },

    render: function () {
        var electionListing = React.createElement(
            'h3',
            null,
            'No elections found'
        );

        if (this.props.elections.length > 0) {
            electionListing = this.props.elections.map(function (value) {
                if (value.id === this.state.currentEdit) {
                    return React.createElement(ElectionForm, _extends({ key: value.id }, value, { electionId: value.id, hideForm: this.editRow.bind(null, 0), load: this.props.load }));
                } else {
                    return React.createElement(ElectionRow, _extends({ key: value.id }, value, { edit: this.editRow.bind(this, value.id) }));
                }
            }.bind(this));
        }

        return React.createElement(
            'div',
            { className: 'pad-top' },
            electionListing
        );
    }

});

var ElectionRow = React.createClass({
    displayName: 'ElectionRow',

    getInitialState: function () {
        return {
            panelOpen: false
        };
    },

    getDefaultProps: function () {
        return {};
    },

    toggleExpand: function () {
        this.setState({
            panelOpen: !this.state.panelOpen
        });
    },

    render: function () {
        var title = React.createElement(
            'h3',
            null,
            this.props.title
        );
        var date = React.createElement(
            'h4',
            null,
            this.props.startDateFormatted,
            ' - ',
            this.props.endDateFormatted
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
                React.createElement(
                    'div',
                    { className: 'text-right' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-block btn-success', onClick: this.props.edit },
                        React.createElement('i', { className: 'fa fa-edit' }),
                        ' Edit election'
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn btn-block btn-danger' },
                        React.createElement('i', { className: 'fa fa-trash-o' }),
                        ' Delete election'
                    )
                )
            )
        );

        if (this.state.panelOpen) {
            var body = React.createElement(
                'div',
                null,
                React.createElement(VoteChoice, null),
                React.createElement(SingleBallot, null),
                React.createElement(MultipleBallot, null),
                React.createElement(Referendum, null)
            );
            var arrow = React.createElement('i', { className: 'fa fa-chevron-up' });
        } else {
            var body = null;
            var arrow = React.createElement('i', { className: 'fa fa-chevron-down' });
        }

        var footer = React.createElement(
            'div',
            { className: 'text-center pointer', onClick: this.toggleExpand },
            arrow
        );

        return React.createElement(Panel, { type: 'info', heading: heading, body: body, footer: footer });
    }
});

var VoteChoice = React.createClass({
    displayName: 'VoteChoice',

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {};
    },

    render: function () {
        return React.createElement(
            'div',
            { className: 'well' },
            'Create new... ',
            React.createElement(
                'button',
                { className: 'btn btn-primary pad-right' },
                React.createElement('i', { className: 'fa fa-user' }),
                ' Single ballot'
            ),
            React.createElement(
                'button',
                { className: 'btn btn-primary pad-right' },
                React.createElement('i', { className: 'fa fa-users' }),
                ' Multiple chair ballot'
            ),
            React.createElement(
                'button',
                { className: 'btn btn-primary' },
                React.createElement('i', { className: 'fa fa-gavel' }),
                ' Referendum'
            )
        );
    }

});

ReactDOM.render(React.createElement(Election, null), document.getElementById('election-dashboard'));