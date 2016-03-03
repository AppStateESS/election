'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ElectionList = React.createClass({
    displayName: 'ElectionList',

    getInitialState: function () {
        return {
            elections: [],
            showForm: false
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
            showForm: true
        });
    },

    hideForm: function () {
        this.setState({
            showForm: false
        });
    },

    render: function () {
        var rows = this.state.elections.map(function (value, key) {
            return React.createElement(ElectionRow, _extends({ key: key }, value, { hideForm: this.hideForm }));
        }.bind(this));
        var form = React.createElement(
            'button',
            { className: 'btn btn-success', onClick: this.showForm },
            React.createElement(
                'i',
                { className: 'fa fa-plus' },
                ' Add Election'
            )
        );
        if (this.state.showForm) {
            form = React.createElement(ElectionForm, { hideForm: this.hideForm, load: this.load });
        }
        return React.createElement(
            'div',
            null,
            form,
            React.createElement(
                'table',
                { className: 'table table-striped pad-top' },
                React.createElement(
                    'tbody',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'th',
                            null,
                            'Title'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Date range'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Total votes'
                        ),
                        React.createElement(
                            'th',
                            null,
                            ' '
                        )
                    ),
                    rows
                )
            )
        );
    }
});

var ElectionRow = React.createClass({
    displayName: 'ElectionRow',


    getDefaultProps: function () {
        return {
            id: 0,
            title: '',
            startDateFormatted: '',
            endDateFormatted: '',
            totalVotes: 0,
            past: false,
            edit: false
        };
    },

    render: function () {
        if (this.props.past) {
            var href = 'election/Admin/Report/?electionId=' + this.props.id;
            var buttons = React.createElement(
                'a',
                { href: href, className: 'btn btn-info' },
                React.createElement('i', { className: 'fa fa-envelope' }),
                ' Report'
            );
        } else {
            var href = 'election/Admin/?command=edit&electionId=' + this.props.id;
            var buttons = React.createElement(
                'a',
                { href: href, className: 'btn btn-primary' },
                React.createElement('i', { className: 'fa fa-edit' }),
                ' Edit'
            );
        }
        return React.createElement(
            'tr',
            null,
            React.createElement(
                'td',
                null,
                this.props.title
            ),
            React.createElement(
                'td',
                null,
                this.props.startDateFormatted,
                ' - ',
                this.props.endDateFormatted
            ),
            React.createElement(
                'td',
                null,
                this.props.totalVotes
            ),
            React.createElement(
                'td',
                null,
                buttons
            )
        );
    }

});

var ElectionForm = React.createClass({
    displayName: 'ElectionForm',

    mixins: [DateMixin],

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

    componentDidMount: function () {
        this.initStartDate();
        this.initEndDate();
    },

    componentWillMount: function () {
        if (this.props.electionId) {
            this.copyPropsToState();
        }
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

    updateTitle: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    checkForErrors: function () {
        var error = false;
        if (this.state.title.length === 0) {
            $(this.refs.electionTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }

        if (this.hasDateErrors()) {
            error = true;
        }

        return error;
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

ReactDOM.render(React.createElement(ElectionList, null), document.getElementById('election-listing'));