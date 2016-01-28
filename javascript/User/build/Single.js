var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Single = React.createClass({
    displayName: "Single",

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {
            election: {},
            updateVote: null,
            vote: {},
            ballots: []
        };
    },

    render: function () {
        var ballots = this.props.ballots.map(function (value) {
            return React.createElement(SingleBallot, _extends({ key: value.id }, value));
        }.bind(this));
        return React.createElement(
            "div",
            null,
            ballots
        );
    }

});

var SingleBallot = React.createClass({
    displayName: "SingleBallot",

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {
            title: null,
            tickets: []
        };
    },

    render: function () {
        var tickets = this.props.tickets.map(function (value) {
            return React.createElement(SingleBallotTicket, _extends({ key: value.id }, value));
        }.bind(this));

        return React.createElement(
            "div",
            null,
            this.props.title,
            tickets
        );
    }

});

var SingleBallotTicket = React.createClass({
    displayName: "SingleBallotTicket",

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {
            title: null,
            platform: null,
            siteAddress: null,
            candidates: []
        };
    },

    render: function () {
        var candidates = this.props.candidates.map(function (value) {
            return React.createElement(Candidate, _extends({ key: value.id }, value));
        }.bind(this));

        return React.createElement(
            "div",
            null,
            this.props.title,
            this.props.platform,
            this.props.siteAddress,
            candidates
        );
    }

});