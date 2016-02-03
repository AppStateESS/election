var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Review = React.createClass({
    displayName: "Review",

    getDefaultProps: function () {
        return {
            election: {},
            singleVote: [],
            multipleVote: [],
            referendumVote: []
        };
    },

    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(SingleResult, { vote: this.props.singleVote }),
            ";"
        );
    }

});

var SingleResult = React.createClass({
    displayName: "SingleResult",

    getDefaultProps: function () {
        return {
            vote: []
        };
    },

    render: function () {
        var rows = this.props.vote.map(function (value, key) {
            return React.createElement(SingleResultRow, _extends({ key: key }, value));
        });

        return React.createElement(
            "div",
            null,
            rows
        );
    }

});

var SingleResultRow = React.createClass({
    displayName: "SingleResultRow",

    getDefaultProps: function () {
        return {
            vote: {}
        };
    },

    render: function () {
        var heading = React.createElement(
            "div",
            null,
            React.createElement(
                "button",
                { className: "btn btn-default pull-right" },
                React.createElement("i", { className: "fa fa-pencil" }),
                " Edit"
            ),
            React.createElement(
                "h3",
                null,
                this.props.single.title
            )
        );

        var candidates = this.props.ticket.candidates.map(function (value, key) {
            return React.createElement(
                "div",
                { className: "pull-left pad-right", key: key },
                React.createElement(SingleCandidate, value)
            );
        });

        var body = React.createElement(
            "div",
            null,
            React.createElement(
                "h4",
                null,
                this.props.ticket.title
            ),
            React.createElement(
                "div",
                null,
                candidates
            )
        );

        return React.createElement(Panel, { heading: heading, body: body });
    }
});

var MultipleResult = React.createClass({
    displayName: "MultipleResult",

    getDefaultProps: function () {
        return {
            multiple: {},
            candidates: []
        };
    },

    render: function () {
        var candidates = this.props.ticket.candidates.map(function (value, key) {
            return React.createElement(
                "div",
                { className: "pull-left pad-right", key: key },
                React.createElement(MultipleCandidate, value)
            );
        });

        return React.createElement(
            "div",
            null,
            React.createElement(
                "h4",
                null,
                this.props.multiple.title
            ),
            React.createElement(
                "ul",
                { className: "list-group" },
                candidates
            )
        );
    }

});