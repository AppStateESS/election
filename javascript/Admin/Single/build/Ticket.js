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
                return React.createElement(TicketForm, _extends({ key: value.id, ticketId: value.id }, value, this.props, { close: this.closeForm, load: this.load }));
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

        return error;
    },

    checkUrl: function () {
        if (this.state.siteAddress && this.state.siteAddress.length > 0) {
            $.getJSON('election/Admin/Ticket', {
                command: 'checkUrl',
                checkUrl: this.state.siteAddress
            }).done(function (data) {
                if (!data.success || data.success === false) {
                    this.setState({
                        siteAddressError: true
                    });
                    $(this.refs.siteAddress).css('borderColor', 'red');
                    return false;
                } else {
                    this.setState({
                        siteAddressError: false
                    });
                    $(this.refs.siteAddress).css('borderColor', 'inherit');
                    return true;
                }
            }.bind(this));
        } else {
            this.setState({
                siteAddressError: false
            });
            $(this.refs.siteAddress).css('borderColor', 'inherit');
            return true;
        }
    },

    save: function () {
        var error = this.checkForErrors();
        if (error === false && this.state.siteAddressError === false) {
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
        var siteAddress = e.target.value;
        if (siteAddress.length === 0) {
            this.setState({
                siteAddressError: false
            });
        }
        this.setState({
            siteAddress: siteAddress
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
                        placeholder: 'Candidate last names (e.g. Jones / Smith)', onChange: this.changeTitle,
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
                        placeholder: 'http://siteaddress.com', onFocus: this.resetBorder, onBlur: this.checkUrl, onChange: this.changeSiteAddress,
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
                        placeholder: 'Ticket\'s election statement', onChange: this.changePlatform,
                        value: this.state.platform })
                )
            ),
            React.createElement('hr', null),
            React.createElement(
                'button',
                { className: 'btn btn-primary pad-right', onClick: this.save, disabled: this.state.siteAddressError },
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
            platform: '',
            siteAddress: '',
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
                    { className: 'btn btn-sm btn-primary', 'data-tid': this.props.id, onClick: this.props.handleEdit, title: 'Edit ticket' },
                    React.createElement('i', { className: 'fa fa-edit' })
                ),
                React.createElement(
                    'button',
                    { className: 'btn btn-sm btn-danger', onClick: this.props.handleDelete, title: 'Delete ticket' },
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
    React.createElement(Candidates, { ballotId: props.ballotId, ticketId: props.id }),
    React.createElement('hr', null),
    props.platform.length ? React.createElement(
        'div',
        null,
        React.createElement(
            'h4',
            { className: 'clearfix' },
            'Platform:'
        ),
        React.createElement(
            'p',
            null,
            props.platform.split("\n").map(function (item, i) {
                return React.createElement(
                    'span',
                    { key: i },
                    item,
                    React.createElement('br', null)
                );
            })
        )
    ) : '',
    props.siteAddress.length ? React.createElement(
        'div',
        null,
        React.createElement(
            'h4',
            null,
            'Web site'
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
    ) : ''
);