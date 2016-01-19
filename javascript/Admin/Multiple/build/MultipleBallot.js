'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var MultipleBallot = React.createClass({
    displayName: 'MultipleBallot',

    mixins: ['Panel', Ballot],

    load: function () {
        $.getJSON('election/Admin/Multiple', {
            command: 'list'
        }).done(function (data) {
            this.setState({
                ballotList: data
            });
        }.bind(this));
    }
});

var BallotList = React.createClass({
    displayName: 'BallotList',

    mixins: [BallotListMixin],
    render: function () {
        var form = null;

        if (this.state.ballotEditId === -1) {
            form = React.createElement(MultipleBallotForm, { hideForm: this.editBallot.bind(null, 0), reload: this.props.reload });
        }

        var ballotList = this.props.listing.map(function (value) {
            if (value.id === this.state.ballotEditId) {
                return React.createElement(MultipleBallotForm, _extends({ key: value.id }, value, { hideForm: this.editBallot.bind(null, 0), reload: this.props.reload }));
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
                React.createElement('i', { className: 'fa fa-5x fa-calendar-check-o' }),
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

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {};
    },

    render: function () {
        return React.createElement(
            'div',
            null,
            'hi'
        );
    }

});

var MultipleBallotForm = React.createClass({
    displayName: 'MultipleBallotForm',

    mixins: [BallotForm],

    save: function () {
        var error = this.checkForErrors();
        if (error === false) {
            $.post('election/Admin/Multiple', {
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

    render: function () {
        return this._render;
    }

});

ReactDOM.render(React.createElement(MultipleBallot, null), document.getElementById('multiple-ballot'));