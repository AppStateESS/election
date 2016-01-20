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
            React.createElement(BallotList, { listing: this.state.ballotList, reload: this.load })
        );
    }

});

var BallotList = React.createClass({
    displayName: 'BallotList',

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
                React.createElement('i', { className: 'fa fa-calendar-check-o fa-5x' }),
                React.createElement('br', null),
                'Create ballot'
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

    getInitialState: function () {
        return {
            showTicketForm: false
        };
    },

    getDefaultProps: function () {
        return {
            endDateFormatted: '',
            startDateFormatted: '',
            title: '',
            id: 0,
            handleEdit: null
        };
    },

    setShowTicketForm: function (ticket) {
        this.setState({
            showTicketForm: ticket
        });
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
                    { className: 'btn btn-success', 'data-vid': this.props.id,
                        onClick: this.setShowTicketForm.bind(null, true), title: 'Add ticket' },
                    React.createElement('i', { className: 'fa fa-ticket' }),
                    ' Add ticket'
                ),
                React.createElement(
                    'button',
                    { className: 'btn btn-primary', 'data-vid': this.props.id,
                        onClick: this.props.handleEdit, title: 'Edit ballot' },
                    React.createElement('i', { className: 'fa fa-edit' }),
                    ' Edit'
                ),
                React.createElement(
                    'button',
                    { className: 'btn btn-danger', onClick: this.handleDelete },
                    React.createElement('i', { className: 'fa fa-trash-o', title: 'Remove ballot' }),
                    ' Delete'
                )
            ),
            React.createElement(
                'h2',
                null,
                this.props.title
            ),
            React.createElement(
                'h4',
                null,
                'Vote: ',
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
            )
        );
        var body = React.createElement(
            'div',
            null,
            React.createElement(Tickets, { ballotId: this.props.id, showTicketForm: this.state.showTicketForm, removeForm: this.setShowTicketForm.bind(null, false) })
        );
        return React.createElement(Panel, { heading: heading, body: body });
    }

});

var SingleBallotForm = React.createClass({
    displayName: 'SingleBallotForm',

    getInitialState: function () {
        return {
            ballotId: 0,
            title: ''
        };
    },

    getDefaultProps: function () {
        return {
            id: 0,
            title: '',
            hideForm: null
        };
    },

    componentWillMount: function () {
        if (this.props.id) {
            this.copyPropsToState();
        }
    },

    copyPropsToState: function () {
        this.setState({
            ballotId: this.props.id,
            title: this.props.title
        });
    },

    updateTitle: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    checkForErrors: function () {
        var error = false;
        if (this.state.title.length === 0) {
            $(this.refs.ballotTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
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
                title: this.state.title
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
            'Body goes here'
        );

        return React.createElement(Panel, { heading: heading, body: body });
    }
});