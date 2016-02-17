var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Review = React.createClass({
    displayName: "Review",

    getDefaultProps: function () {
        return {
            election: {},
            singleVote: [],
            multipleVote: [],
            referendumVote: [],
            resetStage: null
        };
    },

    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h2",
                null,
                "Review"
            ),
            React.createElement(
                "div",
                { className: "review-warning" },
                React.createElement(
                    "p",
                    null,
                    "You're almost done"
                ),
                React.createElement(
                    "p",
                    null,
                    "Since you may only vote once, let's review your selections."
                )
            ),
            React.createElement(
                "div",
                { className: "text-center" },
                React.createElement(
                    "button",
                    { className: "btn btn-lg btn-block btn-success", onClick: this.props.finalVote },
                    "Place my Vote"
                )
            ),
            React.createElement(
                "div",
                null,
                " "
            ),
            React.createElement(
                "div",
                { className: "vote-results" },
                React.createElement(SingleResult, { vote: this.props.singleVote, resetStage: this.props.resetStage }),
                React.createElement(MultipleResult, { vote: this.props.multipleVote, resetStage: this.props.resetStage }),
                React.createElement(ReferendumResult, { vote: this.props.referendumVote, resetStage: this.props.resetStage })
            ),
            React.createElement(
                "div",
                { className: "text-center" },
                React.createElement(
                    "button",
                    { className: "btn btn-lg btn-block btn-success", onClick: this.props.finalVote },
                    "Place my Vote"
                )
            )
        );
    }

});

var SingleResult = React.createClass({
    displayName: "SingleResult",

    getDefaultProps: function () {
        return {
            vote: [],
            resetStage: null
        };
    },

    render: function () {
        var rows = this.props.vote.map(function (value, key) {
            return React.createElement(SingleResultRow, _extends({ key: key }, value, { resetStage: this.props.resetStage.bind(null, 'single', value.single.id) }));
        }.bind(this));

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
            vote: {},
            resetStage: null,
            single: {},
            ticket: {}
        };
    },

    render: function () {
        var heading = React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-xs-10" },
                React.createElement(
                    "h3",
                    null,
                    this.props.single.title
                )
            ),
            React.createElement(
                "div",
                { className: "col-xs-2" },
                React.createElement(
                    "button",
                    { className: "btn btn-block btn-default",
                        onClick: this.props.resetStage.bind(null, 'single', this.props.single.id) },
                    React.createElement("i", { className: "fa fa-pencil" }),
                    " Edit"
                )
            )
        );

        if (this.props.ticket) {
            var icon = React.createElement("i", { className: "fa fa-check-circle text-success fa-5x pull-right" });
            var title = React.createElement(
                "h4",
                null,
                this.props.ticket.title
            );
            var candidates = this.props.ticket.candidates.map(function (value, key) {
                return React.createElement(
                    "div",
                    { className: "pull-left pad-right", key: key },
                    React.createElement(SingleCandidate, value)
                );
            });
        } else {
            var icon = null;
            var title = React.createElement(
                "h4",
                null,
                "No ticket chosen"
            );
            var candidates = React.createElement(
                "p",
                null,
                "Abstained"
            );
        }

        var body = React.createElement(
            "div",
            null,
            icon,
            title,
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
            vote: [],
            resetStage: null
        };
    },

    render: function () {
        var multiples = this.props.vote.map(function (vote, key) {
            return React.createElement(MultipleResultRow, _extends({}, vote, { key: key, resetStage: this.props.resetStage }));
        }.bind(this));

        var heading = React.createElement(
            "h3",
            null,
            "Senate Seats"
        );

        var body = React.createElement(
            "div",
            null,
            multiples
        );

        return React.createElement(Panel, { heading: heading, body: body });
    }
});

var MultipleResultRow = React.createClass({
    displayName: "MultipleResultRow",

    getDefaultProps: function () {
        return {
            chairs: [],
            multiple: {},
            resetStage: null
        };
    },

    render: function () {
        var heading = React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-xs-10" },
                React.createElement(
                    "h4",
                    null,
                    this.props.multiple.title
                )
            ),
            React.createElement(
                "div",
                { className: "col-xs-2" },
                React.createElement(
                    "button",
                    { className: "btn btn-default btn-block",
                        onClick: this.props.resetStage.bind(null, 'multiple', this.props.multiple.id) },
                    React.createElement("i", { className: "fa fa-pencil" }),
                    " Edit"
                )
            )
        );
        if (this.props.chairs.length === 0) {
            var candidates = React.createElement(
                "div",
                null,
                React.createElement(
                    "h4",
                    null,
                    "No candidates chosen."
                ),
                React.createElement(
                    "p",
                    null,
                    "Abstained."
                )
            );
        } else {
            var candidateListing = this.props.multiple.candidates.map(function (candidate, key) {
                if ($.inArray(candidate.id, this.props.chairs) !== -1) {
                    return React.createElement(MultipleCandidateRow, _extends({}, candidate, { key: key }));
                }
            }.bind(this));
            var candidates = React.createElement(
                "ul",
                { className: "list-group" },
                candidateListing
            );
        }

        var body = React.createElement(
            "div",
            { className: "multiple-ticket-vote" },
            candidates
        );
        return React.createElement(Panel, { heading: heading, body: body });
    }

});

var MultipleCandidateRow = React.createClass({
    displayName: "MultipleCandidateRow",

    getDefaultProps: function () {
        return {
            firstName: '',
            lastName: '',
            picture: ''
        };
    },

    render: function () {
        var icon = React.createElement("i", { className: "pull-right text-success fa fa-check-circle fa-2x" });

        var picture = React.createElement("img", { className: "img-circle", src: "mod/election/img/no-picture.gif" });

        if (this.props.picture.length > 0) {
            picture = React.createElement("img", { className: "img-circle", src: this.props.picture });
        }

        return React.createElement(
            "li",
            { className: "list-group-item", onClick: this.props.select },
            icon,
            picture,
            this.props.firstName,
            " ",
            this.props.lastName
        );
    }

});

var ReferendumResult = React.createClass({
    displayName: "ReferendumResult",

    getDefaultProps: function () {
        return {
            vote: [],
            resetStage: null
        };
    },

    getInitialState: function () {
        return {};
    },

    render: function () {
        var rows = this.props.vote.map(function (value, key) {
            return React.createElement(ReferendumResultRow, _extends({ key: key }, value, { resetStage: this.props.resetStage }));
        }.bind(this));

        var heading = React.createElement(
            "h3",
            null,
            "Referenda"
        );

        var body = React.createElement(
            "div",
            null,
            rows
        );

        return React.createElement(Panel, { heading: heading, body: body });
    }
});

var ReferendumResultRow = React.createClass({
    displayName: "ReferendumResultRow",

    getDefaultProps: function () {
        return {};
    },

    render: function () {
        var voted = '';
        switch (this.props.answer) {
            case 'yes':
                voted = React.createElement(
                    "span",
                    { className: "text-success" },
                    React.createElement("i", { className: "fa fa-check-circle" }),
                    " Yes"
                );
                break;

            case 'no':
                voted = React.createElement(
                    "span",
                    { className: "text-danger" },
                    React.createElement("i", { className: "fa fa-times-circle" }),
                    " No"
                );
                break;

            case 'abstain':
                voted = React.createElement(
                    "span",
                    { className: "text-primary" },
                    React.createElement("i", { className: "fa fa-question-circle" }),
                    " Abstain"
                );
                break;
        }

        return React.createElement(
            "div",
            { className: "row referendum-result" },
            React.createElement(
                "div",
                { className: "col-sm-6" },
                this.props.referendum.title
            ),
            React.createElement(
                "div",
                { className: "col-sm-3" },
                voted
            ),
            React.createElement(
                "div",
                { className: "col-sm-3" },
                React.createElement(
                    "button",
                    { className: "btn btn-block btn-default",
                        onClick: this.props.resetStage.bind(null, 'referendum', this.props.referendum.id) },
                    React.createElement("i", { className: "fa fa-pencil" }),
                    " Edit"
                )
            )
        );
    }

});