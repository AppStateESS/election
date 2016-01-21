'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var SingleBallot = React.createClass({
    displayName: 'SingleBallot',

    mixins: ['Panel'],

    getInitialState: function () {
        return {
            singleList: [],
            itemCount: 0,
            panelOpen: false
        };
    },

    getDefaultProps: function () {
        return {
            electionId: 0
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {
        $.getJSON('election/Admin/Single', {
            command: 'list',
            electionId: this.props.electionId
        }).done(function (data) {
            this.setState({
                itemCount: data.length,
                singleList: data
            });
        }.bind(this));
    },

    toggleExpand: function () {
        this.setState({
            panelOpen: !this.state.panelOpen
        });
    },

    render: function () {
        var heading = React.createElement(
            'div',
            null,
            React.createElement(
                'h4',
                null,
                'Single chair - ',
                this.state.itemCount,
                ' ballot',
                this.state.itemCount !== 1 ? 's' : null
            )
        );
        if (this.state.panelOpen) {
            var body = React.createElement(
                'div',
                null,
                React.createElement(SingleList, { electionId: this.props.electionId, reload: this.load, listing: this.state.singleList })
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

        return React.createElement(Panel, { type: 'info', heading: heading, body: body, footer: footer,
            headerClick: this.toggleExpand, footerClick: this.toggleExpand });
    }

});

var SingleList = React.createClass({
    displayName: 'SingleList',

    getInitialState: function () {
        return {
            currentEdit: -1,
            openSingle: 0
        };
    },

    getDefaultProps: function () {
        return {
            listing: [],
            reload: null,
            electionId: 0
        };
    },

    setCurrentEdit: function (singleId) {
        this.setState({
            currentEdit: singleId
        });
    },

    editRow: function (singleId) {
        this.setState({
            currentEdit: singleId
        });
    },

    openSingle: function (singleId) {
        if (singleId === this.state.openSingle) {
            singleId = 0;
        }

        this.setState({
            openSingle: singleId
        });
    },

    render: function () {
        var singleList = React.createElement(
            'div',
            null,
            React.createElement(
                'h3',
                null,
                'No single ballots found.'
            )
        );

        var shared = {
            electionId: this.props.electionId,
            reload: this.props.reload,
            hideForm: this.setCurrentEdit.bind(null, -1),
            openSingle: this.openSingle
        };

        var singleList = this.props.listing.map(function (value) {
            if (value.id === this.state.currentEdit) {
                return React.createElement(SingleBallotForm, _extends({ key: value.id }, value, {
                    singleId: value.id }, shared));
            } else {
                return React.createElement(SingleListRow, _extends({ key: value.id }, value, {
                    isOpen: this.state.openSingle === value.id,
                    singleId: value.id, edit: this.editRow.bind(null, value.id)
                }, shared));
            }
        }.bind(this));

        var form = React.createElement(
            'button',
            { className: 'btn btn-primary', onClick: this.editRow.bind(null, 0) },
            React.createElement('i', { className: 'fa fa-plus' }),
            ' Add new ballot'
        );
        if (this.state.currentEdit === 0) {
            form = React.createElement(SingleBallotForm, shared);
        }

        return React.createElement(
            'div',
            null,
            form,
            React.createElement(
                'div',
                { className: 'pad-top' },
                singleList
            )
        );
    }

});

var SingleListRow = React.createClass({
    displayName: 'SingleListRow',

    mixins: ['Panel'],

    getDefaultProps: function () {
        return {
            electionId: 0,
            reload: null,
            hideForm: null,
            singleId: 0,
            title: '',
            isOpen: true
        };
    },

    getInitialState: function () {
        return {
            formId: -1,
            tickets: [],
            ticketCount: 0
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {
        $.getJSON('election/Admin/Ticket', {
            command: 'list',
            singleId: this.props.singleId
        }).done(function (data) {
            this.setState({
                tickets: data,
                ticketCount: data.length
            });
        }.bind(this));
    },

    toggleExpand: function () {
        this.props.openSingle(this.props.singleId);
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

    edit: function (e) {
        e.stopPropagation();
        this.props.edit();
    },

    render: function () {
        var heading = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-6' },
                React.createElement(
                    'div',
                    { className: 'ballot-title' },
                    this.props.title,
                    ' - ',
                    this.state.ticketCount,
                    ' ticket',
                    this.state.ticketCount !== 1 ? 's' : null
                )
            ),
            React.createElement(
                'div',
                { className: 'col-sm-6' },
                React.createElement(
                    'div',
                    { className: 'pull-right' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-success pad-right', onClick: this.edit, title: 'Edit ballot' },
                        React.createElement('i', { className: 'fa fa-edit' }),
                        ' Edit'
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn btn-danger', onClick: this.handleDelete },
                        React.createElement('i', { className: 'fa fa-trash-o', title: 'Remove ballot' }),
                        ' Delete'
                    )
                )
            )
        );

        if (this.props.isOpen) {
            var body = React.createElement(
                'div',
                null,
                React.createElement(Tickets, { singleId: this.props.singleId, tickets: this.state.tickets, load: this.load })
            );
            var arrow = React.createElement('i', { className: 'fa fa-chevron-up' });
        } else {
            var body = null;
            var arrow = React.createElement('i', { className: 'fa fa-chevron-down' });
        }

        var footer = React.createElement(
            'div',
            { className: 'text-center pointer' },
            arrow
        );

        return React.createElement(Panel, { type: 'success', heading: heading,
            body: body, footer: footer,
            footerClick: this.toggleExpand,
            headerClick: this.toggleExpand });
    }

});

var SingleBallotForm = React.createClass({
    displayName: 'SingleBallotForm',

    getInitialState: function () {
        return {
            title: ''
        };
    },

    getDefaultProps: function () {
        return {
            singleId: 0,
            electionId: 0,
            title: '',
            hideForm: null,
            reload: null
        };
    },

    componentWillMount: function () {
        if (this.props.id) {
            this.copyPropsToState();
        }
    },

    copyPropsToState: function () {
        this.setState({
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
                singleId: this.props.singleId,
                electionId: this.props.electionId,
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
        var heading = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-8' },
                React.createElement('input', { ref: 'singleTitle', type: 'text', className: 'form-control',
                    defaultValue: this.props.title, id: 'single-title',
                    onFocus: this.resetBorder, onChange: this.updateTitle,
                    placeholder: 'Ballot title' })
            ),
            React.createElement(
                'div',
                { className: 'col-sm-4' },
                React.createElement(
                    'div',
                    { className: 'pull-right' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-primary pad-right', onClick: this.save },
                        React.createElement('i', { className: 'fa fa-save' }),
                        ' Save'
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn btn-danger', onClick: this.props.hideForm },
                        React.createElement('i', { className: 'fa fa-times' }),
                        ' Cancel'
                    )
                )
            )
        );

        return React.createElement(Panel, { type: 'success', heading: heading });
    }
});