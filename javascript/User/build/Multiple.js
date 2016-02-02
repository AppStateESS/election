var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Multiple = React.createClass({
    displayName: "Multiple",

    getDefaultProps: function () {
        return {
            election: {},
            updateVote: null,
            vote: [],
            ballot: {}
        };
    },

    render: function () {
        return React.createElement(MultipleBallot, _extends({ multipleId: this.props.ballot.id
        }, this.props.ballot, {
            updateVote: this.props.updateVote, vote: this.props.vote }));
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
            multipleId: 0
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

        var button = null;
        if (this.state.totalSelected == seatNumber) {
            button = React.createElement(
                "button",
                { className: "pull-right btn btn-success", onClick: this.saveVotes },
                "Continue ",
                React.createElement("i", { className: "fa fa-arrow-right" })
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
                { className: "remaining-seats alert alert-success" },
                button,
                "You have selected ",
                this.state.totalSelected,
                " of the allowed ",
                this.props.seatNumber,
                " seats."
            ),
            React.createElement(
                "ul",
                { className: "list-group" },
                candidates
            ),
            React.createElement("hr", null),
            React.createElement(
                "div",
                { className: "text-right" },
                React.createElement(SkipButton, { title: this.props.title, handleClick: this.saveVotes })
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
            var icon = React.createElement("i", { className: "pull-right fa fa-check fa-2x" });
        } else {
            var _className = 'list-group-item pointer';
            var icon = null;
        }

        var picture = React.createElement("img", { className: "img-circle", src: "mod/election/img/no-picture.gif" });

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

var SkipButton = props => React.createElement(
    "div",
    { className: "btn btn-success btn-lg", onClick: props.handleClick },
    "Continue ",
    React.createElement("i", { className: "fa fa-arrow-right" })
);