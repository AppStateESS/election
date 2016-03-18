var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Multiple = React.createClass({
    displayName: "Multiple",

    getDefaultProps: function () {
        return {
            election: {},
            updateVote: null,
            vote: [],
            ballot: {},
            unqualified: [],
            supportLink: null
        };
    },

    render: function () {
        return React.createElement(MultipleBallot, _extends({ multipleId: this.props.ballot.id
        }, this.props.ballot, {
            updateVote: this.props.updateVote,
            vote: this.props.vote,
            unqualified: this.props.unqualified, supportLink: this.props.supportLink }));
    }
});

var MultipleBallot = React.createClass({
    displayName: "MultipleBallot",

    getInitialState: function () {
        return {
            selectedRows: [],
            totalSelected: 0
        };
    },

    getDefaultProps: function () {
        return {
            updateVote: null,
            seatNumber: 2,
            title: null,
            candidates: [],
            vote: null,
            multipleId: 0,
            supportLink: null
        };
    },

    select: function (candidateId) {
        var selectedRows = this.state.selectedRows;
        var found = $.inArray(candidateId, selectedRows);
        var totalSelected = this.state.totalSelected;
        var totalSeats = this.props.seatNumber * 1;

        if (found === -1) {
            if (totalSelected !== totalSeats) {
                totalSelected++;
                selectedRows.push(candidateId);
            }
        } else {
            if (totalSelected > 0) {
                totalSelected--;
            }
            selectedRows.splice(found, 1);
        }

        this.setState({
            selectedRows: selectedRows,
            totalSelected: totalSelected
        });
    },

    saveVotes: function () {
        this.props.updateVote(this.state.selectedRows);
        this.setState({
            selectedRows: [],
            totalSelected: 0
        });
    },

    render: function () {
        var seatNumber = this.props.seatNumber * 1;
        var candidates = this.props.candidates.map(function (value) {
            if ($.inArray(value.id, this.state.selectedRows) !== -1) {
                var selected = true;
            } else {
                var selected = false;
            }
            return React.createElement(MultipleCandidate, _extends({ key: value.id }, value, {
                selected: selected, select: this.select.bind(null, value.id) }));
        }.bind(this));

        if (this.state.totalSelected > 0) {
            var button = React.createElement(
                "button",
                { className: "pull-right btn btn-success", onClick: this.saveVotes },
                "Continue ",
                React.createElement("i", { className: "fa fa-arrow-right" })
            );
        } else {
            var button = React.createElement(
                "button",
                { className: "pull-right btn btn-warning", onClick: this.saveVotes },
                "Abstain from ",
                this.props.title,
                " ",
                React.createElement("i", { className: "fa fa-arrow-right" })
            );
        }

        var unqualified = null;
        if (this.props.unqualified.length > 0) {
            var supportLink = 'mailto:' + this.props.supportLink;
            unqualified = React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-sm-6" },
                    React.createElement(
                        "p",
                        null,
                        "You were not qualified to vote in the following ballots because of your class, college, or organizational affiliation."
                    ),
                    React.createElement(
                        "ul",
                        null,
                        this.props.unqualified.map(function (value, key) {
                            return React.createElement(
                                "li",
                                { key: key },
                                value
                            );
                        })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-6 well" },
                    React.createElement(
                        "div",
                        { className: "alert alert-danger" },
                        React.createElement(
                            "strong",
                            null,
                            "Is there ballot you should be able to vote on?"
                        )
                    ),
                    React.createElement(
                        "ol",
                        null,
                        React.createElement(
                            "li",
                            null,
                            "STOP! Do not complete your vote"
                        ),
                        React.createElement(
                            "li",
                            null,
                            React.createElement(
                                "a",
                                { href: supportLink },
                                React.createElement(
                                    "strong",
                                    null,
                                    "click here"
                                ),
                                " and email your ASU username and the missing ballot name."
                            )
                        )
                    ),
                    React.createElement(
                        "p",
                        null,
                        "We will check your account and get back to you."
                    )
                )
            );
        }

        return React.createElement(
            "div",
            { className: "multiple-ticket-vote" },
            React.createElement(
                "h2",
                null,
                this.props.title
            ),
            React.createElement(
                "div",
                { className: "container remaining-seats alert alert-success" },
                button,
                "You have selected ",
                this.state.totalSelected,
                " of the allowed ",
                this.props.seatNumber,
                " seat",
                this.props.seatNumber === '1' ? null : 's',
                "."
            ),
            React.createElement(
                "ul",
                { className: "list-group" },
                candidates
            ),
            React.createElement("hr", null),
            React.createElement(
                "div",
                null,
                button
            ),
            React.createElement(
                "div",
                { style: { clear: 'both' } },
                unqualified
            )
        );
    }
});

var MultipleCandidate = React.createClass({
    displayName: "MultipleCandidate",

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {
            firstName: '',
            lastName: '',
            picture: '',
            title: '',
            selected: false,
            select: null
        };
    },

    render: function () {
        if (this.props.selected) {
            var _className = 'list-group-item pointer active';
            var icon = React.createElement(
                "button",
                { className: "pull-right btn btn-default btn-lg" },
                React.createElement("i", { className: "fa fa-check" }),
                " Selected"
            );
        } else {
            var _className = 'list-group-item pointer';
            var icon = React.createElement(
                "button",
                { className: "pull-right btn btn-default btn-lg" },
                "Select"
            );
        }

        var picture = React.createElement(
            "div",
            { className: "no-photo" },
            React.createElement(
                "span",
                null,
                "No photo"
            )
        );

        if (this.props.picture.length > 0) {
            picture = React.createElement("img", { className: "img-circle", src: this.props.picture });
        }

        return React.createElement(
            "li",
            { className: _className, onClick: this.props.select },
            icon,
            picture,
            this.props.firstName,
            " ",
            this.props.lastName
        );
    }

});