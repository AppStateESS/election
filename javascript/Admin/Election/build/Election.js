'use strict';

var electionTypes = {};
var categoryTypes = {};

var getElectionTypes = function () {
    $.getJSON('election/Admin/Election', {
        command: 'getElectionTypes'
    }).done(function (data) {
        electionTypes = data;
        sortCategoryTypes();
    }.bind(this));
};

$(document).ready(function () {
    getElectionTypes();
});

var sortCategoryTypes = function () {
    electionTypes.electionTypes.forEach(function (value) {
        value.subcategory.forEach(function (subval) {
            categoryTypes[subval.type] = subval.name;
        });
    });
};

var Election = React.createClass({
    displayName: 'Election',

    mixins: [DateMixin],

    getInitialState: function () {
        return {
            editTitle: false,
            showDateForm: false,
            title: '',
            startDate: '',
            endDate: '',
            unixStart: 0,
            unixEnd: 0,
            past: false
        };
    },

    componentDidMount: function () {
        this.load();
        this.initStartDate();
        this.initEndDate();
    },

    componentDidUpdate: function (prevProps, prevState) {
        if (this.state.showDateForm) {
            this.initStartDate();
            this.initEndDate();
        }
    },

    load: function () {
        // electionId loaded higher in script
        $.getJSON('election/Admin/Election', {
            command: 'getElection',
            electionId: electionId
        }).done(function (data) {
            this.setState({
                id: electionId,
                title: data.title,
                startDate: data.startDateFormatted,
                endDate: data.endDateFormatted,
                unixStart: data.startDate,
                unixEnd: data.endDate,
                editTitle: false,
                showDateForm: false
            });
        }.bind(this));
    },

    editTitle: function () {
        this.setState({
            editTitle: true
        });
    },

    cancelUpdate: function () {
        this.setState({
            editTitle: false,
            title: this.state.title
        });
    },

    updateTitle: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    saveTitle: function () {
        if (this.state.title.length > 0) {
            $.post('election/Admin/Election', {
                command: 'saveTitle',
                title: this.state.title,
                electionId: electionId
            }, null, 'json').done(function (data) {
                this.load();
            }.bind(this));
        }
    },

    showDateForm: function () {
        this.setState({
            showDateForm: true
        });
    },

    hideDateForm: function () {
        this.setState({
            showDateForm: false
        });
    },

    saveDates: function () {
        var error = this.hasDateErrors();
        if (error === false) {
            var conflict = this.checkForConflict();
            conflict.done(function (data) {
                if (data.conflict === false) {
                    $.post('election/Admin/Election', {
                        command: 'saveDates',
                        electionId: this.state.id,
                        startDate: this.state.unixStart,
                        endDate: this.state.unixEnd
                    }, null, 'json').done(function (data) {
                        this.load();
                    }.bind(this)).always(function () {
                        this.hideDateForm();
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
        var electionTitle = React.createElement(
            'h3',
            { className: 'election-title', title: 'Click to change title', onClick: this.editTitle },
            this.state.title
        );
        var save = null;

        if (this.state.editTitle) {
            electionTitle = React.createElement(
                'div',
                { className: 'input-group' },
                React.createElement('input', { type: 'text', className: 'form-control election-title', placeholder: 'Election title', value: this.state.title, onChange: this.updateTitle }),
                React.createElement(
                    'span',
                    { className: 'input-group-btn' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-success', title: 'Update title', disabled: this.state.title.length === 0 ? true : false, onClick: this.saveTitle },
                        React.createElement('i', { className: 'fa fa-save' })
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn btn-danger', title: 'Cancel update', onClick: this.cancelUpdate },
                        React.createElement('i', { className: 'fa fa-times' })
                    )
                )
            );
        }

        if (!this.state.past) {
            if (this.state.showDateForm) {
                var date = React.createElement(
                    'div',
                    { className: 'row date-change pad-top' },
                    React.createElement(
                        'div',
                        { className: 'col-sm-5' },
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
                        { className: 'col-sm-5' },
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
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-sm-2' },
                        React.createElement(
                            'button',
                            { className: 'btn btn-success btn-sm', onClick: this.saveDates },
                            React.createElement('i', { className: 'fa fa-edit' })
                        ),
                        ' ',
                        React.createElement(
                            'button',
                            { className: 'btn btn-danger btn-sm', onClick: this.hideDateForm },
                            React.createElement('i', { className: 'fa fa-times' })
                        )
                    )
                );
            } else {
                var date = React.createElement(
                    'h4',
                    { onClick: this.showDateForm, title: 'Click to change dates' },
                    React.createElement(
                        'span',
                        { className: 'date-edit' },
                        this.state.startDate
                    ),
                    ' - ',
                    React.createElement(
                        'span',
                        { className: 'date-edit' },
                        this.state.endDate
                    )
                );
            }
        } else {
            var date = React.createElement(
                'h4',
                { className: 'date-view' },
                this.state.startDate,
                ' - ',
                this.state.endDate
            );
        }

        var details = React.createElement(
            'div',
            { className: 'text-center pad-top' },
            React.createElement('i', { className: 'fa fa-spinner fa-spin fa-5x' })
        );
        if (this.state.id) {
            details = React.createElement(
                'div',
                { className: 'pad-top' },
                React.createElement(SingleBallot, { electionId: this.state.id }),
                React.createElement(MultipleBallot, { electionId: this.state.id }),
                React.createElement(Referendum, { electionId: this.state.id })
            );
        }

        return React.createElement(
            'div',
            null,
            electionTitle,
            date,
            React.createElement(
                'div',
                null,
                details
            )
        );
    }
});

ReactDOM.render(React.createElement(Election, null), document.getElementById('election-dashboard'));