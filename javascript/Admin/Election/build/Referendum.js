var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Referendum = React.createClass({
    displayName: 'Referendum',

    getInitialState: function () {
        return {
            referendumList: [],
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
        $.getJSON('election/Admin/Referendum', {
            command: 'list',
            electionId: this.props.electionId
        }).done(function (data) {
            this.setState({
                itemCount: data.length,
                referendumList: data
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
                'Referendum - ',
                this.state.itemCount,
                ' measure',
                this.state.itemCount !== 1 ? 's' : null
            )
        );
        if (this.state.panelOpen) {
            var body = React.createElement(
                'div',
                null,
                React.createElement(ReferendumList, { electionId: this.props.electionId, reload: this.load,
                    listing: this.state.referendumList })
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

var ReferendumList = React.createClass({
    displayName: 'ReferendumList',

    getInitialState: function () {
        return {
            currentEdit: -1,
            openReferendum: 0
        };
    },

    getDefaultProps: function () {
        return {
            listing: [],
            reload: null,
            electionId: 0
        };
    },

    editRow: function (id) {
        this.setState({
            currentEdit: id
        });
    },

    openReferendum: function (referendumId) {
        if (referendumId === this.state.openreferendum) {
            referendumId = 0;
        }

        this.setState({
            openReferendum: referendumId
        });
    },

    render: function () {
        var listing = React.createElement(
            'div',
            null,
            React.createElement(
                'h3',
                null,
                'No referendums found.'
            )
        );

        var shared = {
            electionId: this.props.electionId,
            reload: this.props.reload,
            hideForm: this.editRow.bind(null, -1),
            openReferendum: this.openReferendum
        };

        var referendumList = this.props.listing.map(function (value) {
            if (value.id === this.state.currentEdit) {
                return React.createElement(ReferendumForm, _extends({ key: value.id }, value, {
                    referendumId: value.id }, shared));
            } else {
                return React.createElement(ReferendumListRow, _extends({ key: value.id }, value, {
                    isOpen: this.state.openReferendum === value.id,
                    referendumId: value.id, edit: this.editRow.bind(null, value.id)
                }, shared));
            }
        }.bind(this));

        var form = React.createElement(
            'button',
            { className: 'btn btn-primary', onClick: this.editRow.bind(null, 0) },
            React.createElement('i', { className: 'fa fa-plus' }),
            ' Add new referendum'
        );
        if (this.state.currentEdit === 0) {
            form = React.createElement(ReferendumForm, shared);
        }

        return React.createElement(
            'div',
            null,
            form,
            React.createElement(
                'div',
                { className: 'pad-top' },
                referendumList
            )
        );
    }
});

var ReferendumForm = React.createClass({
    displayName: 'ReferendumForm',

    getInitialState: function () {
        return {
            title: '',
            description: ''
        };
    },

    getDefaultProps: function () {
        return {
            electionId: 0,
            title: '',
            description: '',
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
            title: this.props.title,
            description: this.props.description
        });
    },

    updateTitle: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    updateDescription: function (e) {
        this.setState({
            description: e.target.value
        });
    },

    checkForErrors: function () {
        var error = false;
        if (this.state.title.length === 0) {
            $(this.refs.referendumTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }

        if (this.state.description.length === 0) {
            $(this.refs.referendumTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a description');
            error = true;
        }

        return error;
    },

    save: function () {
        var error = this.checkForErrors();
        if (error === false) {
            $.post('election/Admin/Referendum', {
                command: 'save',
                electionId: this.props.electionId,
                title: this.state.title,
                description: this.state.description
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
            null,
            React.createElement('input', { ref: 'referendumTitle', type: 'text', className: 'form-control',
                defaultValue: this.props.title, id: 'referendum-title',
                onFocus: this.resetBorder, onChange: this.updateTitle,
                placeholder: 'Title of referendum' })
        );

        var body = React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                null,
                React.createElement('textarea', { ref: 'referendumDescription', className: 'form-control',
                    defaultValue: this.props.description, id: 'referendum-description',
                    onFocus: this.resetBorder, onChange: this.updateDescription,
                    placeholder: 'Description of referendum' })
            ),
            React.createElement(
                'div',
                { className: 'pad-top' },
                React.createElement(
                    'button',
                    { className: 'btn btn-primary pull-left pad-right', onClick: this.save },
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
        );

        return React.createElement(Panel, { type: 'success', heading: heading, body: body });
    }

});