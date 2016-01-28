'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Election = React.createClass({
    displayName: 'Election',

    getInitialState: function () {
        return {
            election: null,
            single: [],
            multiple: [],
            referendum: [],
            ballotCount: 0,
            stage: 'single',
            vote: {},
            student: {}
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {
        $.getJSON('election/User/Election', {
            command: 'list'
        }).done(function (data) {
            var stage = this.state.stage;
            if (!data.election) {
                this.setStage('empty');
            } else if (data.hasVoted) {
                this.setState({
                    stage: 'finished',
                    election: data.election
                });
            } else {
                this.setState({
                    stage: stage,
                    hasVoted: data.hasVoted,
                    election: data.election,
                    single: data.single,
                    multiple: data.multiple,
                    referendum: data.referendum
                });
            }
        }.bind(this));
    },

    setStage: function (stage) {
        this.setState({
            stage: stage
        });
    },

    updateVote: function (vote) {
        this.setState({
            vote: vote
        });
    },

    render: function () {
        var content = null;
        var shared = {
            election: this.state.election,
            updateVote: this.updateVote,
            vote: this.state.vote
        };
        switch (this.state.stage) {
            case 'empty':
                content = React.createElement(Empty, null);
                break;

            case 'finished':
                content = React.createElement(Finished, { election: this.state.election });
                break;

            case 'single':
                content = React.createElement(Single, _extends({}, shared, { ballots: this.state.single }));
                break;

            case 'multiple':
                content = React.createElement(Multiple, null);
                break;

            case 'referendum':
                content = React.createElement(Referendum, null);
                break;
        }

        return React.createElement(
            'div',
            null,
            content
        );
    }

});

var Empty = () => React.createElement(
    'div',
    null,
    React.createElement(
        'h3',
        null,
        'No elections are available. Please check back later.'
    )
);

var Finished = React.createClass({
    displayName: 'Finished',

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {
            election: {}
        };
    },

    render: function () {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h2',
                null,
                this.props.election.title
            ),
            React.createElement(
                'p',
                null,
                'Thank you for voting! Watch SGA for results.'
            )
        );
    }

});

ReactDOM.render(React.createElement(Election, null), document.getElementById('election'));