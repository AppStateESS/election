'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Tickets = React.createClass({
    displayName: 'Tickets',

    getInitialState: function () {
        return {
            tickets: [],
            ticketFormId: 0
        };
    },

    getDefaultProps: function () {
        return {
            ballotId: 0
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {
        $.getJSON('election/Admin/Ticket', {
            command: 'list',
            ballotId: this.props.ballotId
        }).done(function (data) {
            this.setState({
                tickets: data
            });
        }.bind(this));
    },

    addTicket: function () {
        this.setState({
            ticketFormId: -1
        });
    },

    editTicket: function (ticketId) {
        this.setState({
            ticketFormId: ticketId
        });
    },

    delete: function (ticketId) {
        if (confirm('Are you sure you want to delete this ticket?')) {
            $.post('election/Admin/Ticket', {
                command: 'delete',
                ticketId: ticketId
            }, null, 'json').done(function (data) {
                this.load();
            }.bind(this));
        }
    },

    closeForm: function () {
        this.editTicket(0);
    },

    render: function () {
        var form = null;
        if (this.state.ticketFormId === -1) {
            form = React.createElement(TicketForm, _extends({ close: this.closeForm }, this.props, { load: this.load }));
        }

        var ticketList = this.state.tickets.map(function (value) {
            if (value.id === this.state.ticketFormId) {
                return React.createElement(TicketForm, _extends({ key: value.id }, value, this.props, { close: this.closeForm, load: this.load }));
            } else {
                return React.createElement(TicketRow, _extends({ key: value.id }, value, { handleEdit: this.editTicket.bind(null, value.id), handleDelete: this.delete.bind(null, value.id) }));
            }
        }.bind(this));

        if (ticketList.length === 0) {
            ticketList = React.createElement(
                'div',
                null,
                'No tickets currently assigned to this ballot.'
            );
        }

        return React.createElement(
            'div',
            null,
            React.createElement(
                'button',
                { className: 'btn btn-primary', onClick: this.addTicket },
                React.createElement('i', { className: 'fa fa-ticket' }),
                ' Add ticket'
            ),
            React.createElement('hr', null),
            form,
            ticketList
        );
    }
});

var TicketForm = React.createClass({
    displayName: 'TicketForm',

    getInitialState: function () {
        return {
            title: null,
            siteAddress: null,
            platform: null,
            siteAddressError: false
        };
    },

    getDefaultProps: function () {
        return {
            id: 0,
            ballotId: 0,
            ticketId: 0,
            title: null,
            siteAddress: null,
            platform: null,
            close: null,
            load: null
        };
    },

    componentWillMount: function () {
        console.log(this.props);
        if (this.props.id > 0) {
            this.copyPropsToState();
        }
    },

    copyPropsToState: function () {
        this.setState({
            title: this.props.title,
            siteAddress: this.props.siteAddress,
            platform: this.props.platform
        });
    },

    checkForErrors: function () {
        var error = false;

        var title = this.refs.title.value;
        if (title.length === 0) {
            $(this.refs.title).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }

        var site = this.refs.siteAddress.value;
        if (site.length > 0) {
            $.getJSON('election/Admin/Ticket', {
                command: 'checkUrl',
                checkUrl: site
            }).done(function (data) {
                if (!data.success) {
                    this.setState({
                        siteAddressError: true
                    });
                    $(this.refs.siteAddress).css('borderColor', 'red');
                    error = true;
                } else {
                    this.setState({
                        siteAddressError: false
                    });
                }
            }.bind(this));
        }

        return error;
    },

    save: function () {
        var error = this.checkForErrors();

        if (error === false) {
            $.post('election/Admin/Ticket', {
                command: 'save',
                ballotId: this.props.ballotId,
                ticketId: this.props.ticketId,
                title: this.state.title,
                siteAddress: this.state.siteAddress,
                platform: this.state.platform
            }, null, 'json').done(function (data) {
                this.props.load();
            }.bind(this)).always(function () {
                this.props.close();
            }.bind(this)).fail(function () {
                alert('Sorry but an error occurred when trying to save your ticket.');
            });
        }
    },

    changeTitle: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    changeSiteAddress: function (e) {
        this.setState({
            siteAddress: e.target.value
        });
    },

    changePlatform: function (e) {
        this.setState({
            platform: e.target.value
        });
    },

    resetBorder: function (e) {
        $(e.target).css('borderColor', 'inherit');
    },

    render: function () {
        var body = React.createElement(
            'div',
            { className: 'col-xs-12 col-sm-8' },
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-sm-2' },
                    React.createElement(
                        'label',
                        { htmlFor: 'title', className: 'control-label pad-right' },
                        'Title:'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-10' },
                    React.createElement('input', { ref: 'title', type: 'text', className: 'form-control', onFocus: this.resetBorder,
                        placeholder: 'Enter names of candidates on ticket (e.g. Jones / Smith)', onChange: this.changeTitle,
                        value: this.state.title })
                )
            ),
            React.createElement(
                'div',
                { className: 'row pad-top' },
                React.createElement(
                    'div',
                    { className: 'col-sm-2' },
                    React.createElement(
                        'label',
                        { htmlFor: 'siteAddress', className: 'control-label pad-right' },
                        'Site address:'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-10' },
                    React.createElement('input', { ref: 'siteAddress', type: 'text', className: 'form-control',
                        placeholder: 'http://siteaddress.com', onFocus: this.resetBorder, onChange: this.changeSiteAddress,
                        value: this.state.siteAddress }),
                    this.state.siteAddressError ? React.createElement(
                        'div',
                        { className: 'text-danger' },
                        'Site address format not accepted.'
                    ) : null
                )
            ),
            React.createElement(
                'div',
                { className: 'row pad-top' },
                React.createElement(
                    'div',
                    { className: 'col-sm-2' },
                    React.createElement(
                        'label',
                        { htmlFor: 'platform', className: 'control-label pad-right' },
                        'Platform:'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-10' },
                    React.createElement('textarea', { ref: 'platform', className: 'form-control', onFocus: this.resetBorder,
                        placeholder: 'Candidates election statement', onChange: this.changePlatform,
                        value: this.state.platform })
                )
            ),
            React.createElement('hr', null),
            React.createElement(
                'button',
                { className: 'btn btn-primary pad-right', onClick: this.save },
                React.createElement('i', { className: 'fa fa-save' }),
                ' Save ticket'
            ),
            React.createElement(
                'button',
                { className: 'btn btn-danger', onClick: this.props.close },
                React.createElement('i', { className: 'fa fa-times' }),
                ' Cancel'
            )
        );

        return React.createElement(
            'div',
            null,
            React.createElement(Panel, { body: body })
        );
    }
});

var TicketRow = React.createClass({
    displayName: 'TicketRow',

    mixins: ['Panel'],

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {
            id: 0,
            title: null,
            platform: null,
            siteAddress: null,
            handleDelete: null
        };
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
                    { className: 'btn btn-sm btn-primary', 'data-tid': this.props.id, onClick: this.props.handleEdit },
                    React.createElement('i', { className: 'fa fa-edit' })
                ),
                React.createElement(
                    'button',
                    { className: 'btn btn-sm btn-danger', onClick: this.props.handleDelete },
                    React.createElement('i', { className: 'fa fa-times' })
                )
            ),
            React.createElement(
                'h4',
                null,
                this.props.title
            )
        );
        var body = React.createElement(TicketBody, this.props);

        return React.createElement(
            'div',
            null,
            React.createElement(Panel, { heading: heading, body: body })
        );
    }

});

const TicketBody = props => React.createElement(
    'div',
    null,
    React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
            'div',
            { className: 'col-sm-7' },
            React.createElement(
                'label',
                null,
                'Platform:'
            ),
            React.createElement(
                'p',
                null,
                props.platform
            ),
            React.createElement(
                'label',
                null,
                'Ticket web site'
            ),
            React.createElement(
                'p',
                null,
                React.createElement(
                    'a',
                    { href: props.siteAddress, target: '_blank' },
                    props.siteAddress
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'col-sm-5' },
            React.createElement(Candidates, { ballotId: props.ballotId, ticketId: props.id })
        )
    )
);