var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Single = React.createClass({
    displayName: "Single",

    getDefaultProps: function () {
        return {
            election: {},
            updateVote: null,
            vote: [],
            ballot: {}
        };
    },

    render: function () {
        return React.createElement(SingleBallot, _extends({ singleId: this.props.ballot.id }, this.props.ballot, {
            updateVote: this.props.updateVote, vote: this.props.vote }));
    }

});

var SingleBallot = React.createClass({
    displayName: "SingleBallot",

    getDefaultProps: function () {
        return {
            updateVote: null,
            title: null,
            tickets: [],
            vote: null,
            singleId: 0
        };
    },

    render: function () {
        var tickets = this.props.tickets.map(function (value) {
            return React.createElement(SingleBallotTicket, _extends({ key: value.id }, value, {
                updateVote: this.props.updateVote.bind(null, value) }));
        }.bind(this));
        return React.createElement(
            "div",
            { className: "single-ticket-vote" },
            React.createElement(
                "h1",
                null,
                this.props.title
            ),
            React.createElement(
                "p",
                { className: "warning" },
                "Vote for ",
                React.createElement(
                    "strong",
                    null,
                    "ONE"
                ),
                " ticket. We'll review your decision at the end."
            ),
            tickets,
            React.createElement("hr", null),
            React.createElement(
                "div",
                { className: "text-right" },
                React.createElement(AbstainButton, { title: this.props.title, handleClick: this.props.updateVote.bind(null, null) })
            )
        );
    }
});

var SingleBallotTicket = React.createClass({
    displayName: "SingleBallotTicket",

    mixins: ['panel'],

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {
            title: null,
            platform: null,
            siteAddress: null,
            candidates: [],
            updateVote: null,
            vote: []
        };
    },

    render: function () {
        var candidates = this.props.candidates.map(function (value) {
            return React.createElement(SingleCandidate, _extends({ key: value.id }, value));
        }.bind(this));

        var heading = React.createElement(
            "h2",
            null,
            this.props.title
        );

        var platform = BreakIt(this.props.platform);

        var website = null;

        if (this.props.siteAddress.length) {
            website = React.createElement(
                "div",
                { className: "website" },
                React.createElement(
                    "a",
                    { href: this.props.siteAddress, target: "_blank" },
                    this.props.siteAddress,
                    " ",
                    React.createElement("i", { className: "fa fa-external-link" })
                )
            );
        }

        var body = React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-12 col-sm-5 col-md-6" },
                    platform,
                    React.createElement("hr", null),
                    website
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-12 col-sm-7 col-md-6 pad-top" },
                    candidates
                )
            ),
            React.createElement(
                "button",
                { className: "btn btn-primary btn-block btn-lg", onClick: this.props.updateVote },
                React.createElement("i", { className: "fa fa-check-square-o" }),
                " Vote for ",
                this.props.title
            )
        );

        return React.createElement(Panel, { heading: heading, body: body });
    }

});

var SingleCandidate = React.createClass({
    displayName: "SingleCandidate",

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {
            firstName: '',
            lastName: '',
            picture: '',
            title: ''
        };
    },

    render: function () {
        return React.createElement(
            "div",
            { className: "candidate" },
            React.createElement(
                "div",
                { className: "photo-matte" },
                this.props.picture.length > 0 ? React.createElement(
                    "div",
                    null,
                    React.createElement("span", { className: "helper" }),
                    React.createElement("img", { src: this.props.picture, className: "candidate-pic" })
                ) : React.createElement(
                    "div",
                    { className: "no-picture text-muted" },
                    React.createElement("i", { className: "fa fa-user fa-5x" }),
                    React.createElement("br", null),
                    "No picture"
                )
            ),
            React.createElement(
                "p",
                null,
                React.createElement(
                    "strong",
                    null,
                    this.props.firstName,
                    " ",
                    this.props.lastName
                ),
                React.createElement("br", null),
                this.props.title
            )
        );
    }

});