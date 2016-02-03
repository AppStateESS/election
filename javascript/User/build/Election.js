'use strict';

var Election = React.createClass({
    displayName: 'Election',

    getInitialState: function () {
        return {
            election: null,
            currentSingle: 0,
            currentMultiple: 0,
            currentReferendum: 0,
            single: [],
            multiple: [],
            referendum: [],
            ballotCount: 0,
            referendumCount: 0,
            stage: 'single',
            singleVote: [],
            multipleVote: [],
            referendumVote: [],
            student: {},
            unqualified: []
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
                var singleLength = data.single.length;
                var multipleLength = data.multiple.length;
                var referendumLength = data.referendum.length;
                if (singleLength === 0) {
                    stage = 'multiple';
                }
                if (multipleLength === 0) {
                    stage = 'referendum';
                }
                if (referendumLength === 0) {
                    stage = 'empty';
                }
                var ballotCount = singleLength + multipleLength;
                this.setState({
                    stage: stage,
                    hasVoted: data.hasVoted,
                    election: data.election,
                    single: data.single,
                    multiple: data.multiple,
                    referendum: data.referendum,
                    ballotCount: ballotCount,
                    referendumCount: referendumLength
                });
            }
        }.bind(this));
    },

    setStage: function (stage) {
        this.setState({
            stage: stage
        });
    },

    updateSingleVote: function (ticket) {
        var stage = this.state.stage;
        var current = this.state.currentSingle;
        var nextSingle = current + 1;
        var singleVote = this.state.singleVote;
        var currentVote = singleVote[current];
        currentVote = {
            single: this.state.single[this.state.currentSingle],
            ticket: ticket
        };
        singleVote[current] = currentVote;

        if (typeof this.state.single[nextSingle] === 'undefined') {
            stage = 'multiple';
        }
        this.setState({
            stage: stage,
            singleVote: singleVote,
            currentSingle: nextSingle
        });
    },

    updateMultipleVote: function (chairs) {
        var stage = this.state.stage;
        var current = this.state.currentMultiple;
        var nextMultiple = current + 1;
        var multipleVote = this.state.multipleVote;
        var currentVote = multipleVote[current];

        currentVote = {
            multipleId: this.state.multiple[current].id,
            chairs: chairs
        };

        multipleVote[current] = currentVote;
        if (typeof this.state.multiple[nextMultiple] === 'undefined') {
            stage = 'referendum';
        }

        this.setState({
            stage: stage,
            multipleVote: multipleVote,
            currentMultiple: nextMultiple
        });
    },

    updateReferendumVote: function (vote) {
        var stage = this.state.stage;
        var current = this.state.currentReferendum;
        var nextReferendum = current + 1;
        var referendumVote = this.state.referendumVote;
        var currentVote = referendumVote[current];

        currentVote = {
            referendumId: this.state.referendum[current].id,
            choice: vote
        };

        referendumVote[current] = currentVote;

        if (typeof this.state.multiple[nextReferendum] === 'undefined') {
            stage = 'review';
        }

        this.setState({
            stage: stage,
            referendumVote: referendumVote,
            currentReferendum: nextReferendum
        });
    },

    render: function () {
        var content = null;
        switch (this.state.stage) {
            case 'empty':
                content = React.createElement(Empty, null);
                break;

            case 'finished':
                content = React.createElement(Finished, { election: this.state.election });
                break;

            case 'single':
                content = React.createElement(Single, { election: this.state.election,
                    ballot: this.state.single[this.state.currentSingle],
                    updateVote: this.updateSingleVote, vote: this.state.singleVote });
                break;

            case 'multiple':
                content = React.createElement(Multiple, { election: this.state.election,
                    ballot: this.state.multiple[this.state.currentMultiple],
                    updateVote: this.updateMultipleVote, vote: this.state.multipleVote,
                    unqualified: this.state.unqualified });
                break;

            case 'referendum':
                content = React.createElement(Referendum, { election: this.state.election,
                    referendum: this.state.referendum[this.state.currentReferendum],
                    updateVote: this.updateReferendumVote, vote: this.state.referendumVote });
                break;

            case 'review':
                content = React.createElement(Review, { election: this.state.election,
                    single: this.state.single,
                    multiple: this.state.multiple,
                    referendum: this.state.referendum,
                    singleVote: this.state.singleVote,
                    multipleVote: this.state.multipleVote,
                    referendumVote: this.state.referendumVote });
                break;
        }

        var countdown = null;

        if (this.state.singleVote.length === 0 && this.state.multipleVote.length === 0 && this.state.referendumVote.length === 0) {
            countdown = React.createElement(Countdown, { ballotCount: this.state.ballotCount,
                referendumCount: this.state.referendumCount });
        } else {
            countdown = React.createElement(
                'div',
                null,
                'Alternate countdown'
            );
        }

        return React.createElement(
            'div',
            null,
            countdown,
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

var Countdown = React.createClass({
    displayName: 'Countdown',

    getInitialState: function () {
        return {
            seen: false
        };
    },

    getDefaultProps: function () {
        return {
            ballotCount: 0,
            referendumCount: 0,
            vote: null
        };
    },

    plural: function (item, single, plural) {
        if (typeof single === 'undefined' || single.length === 0) {
            single = '';
        }
        if (typeof plural === 'undefined' || plural.length === 0) {
            plural = 's';
        }
        return item != 1 ? plural : single;
    },

    render: function () {
        var ballots = null;
        var referendum = null;
        var totalItems = 0;
        var isAre = 'are';
        var and = '';

        if (this.props.ballotCount > 0) {
            totalItems += this.props.ballotCount;
            ballots = this.props.ballotCount + ' ballot' + this.plural(this.props.ballotCount);
        }

        if (this.props.referendumCount > 0) {
            totalItems += this.props.referendumCount;
            referendum = this.props.referendumCount + ' referend' + this.plural(this.props.referendumCount, 'um', 'a');
        }

        if (totalItems < 2) {
            isAre = 'is';
        }

        if (this.props.ballotCount > 0 && this.props.referendumCount > 0) {
            and = 'and';
        }

        return React.createElement(
            'div',
            { className: 'alert alert-info' },
            'There ',
            isAre,
            ' currently ',
            ballots,
            ' ',
            and,
            ' ',
            referendum,
            ' for you to vote on. We\'ll review all your selections later, before your votes are submitted.'
        );
    }

});

ReactDOM.render(React.createElement(Election, null), document.getElementById('election'));