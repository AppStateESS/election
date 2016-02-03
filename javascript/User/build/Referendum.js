var Referendum = React.createClass({
    displayName: "Referendum",

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {
            election: {},
            updateVote: null,
            vote: [],
            referendum: {}
        };
    },

    render: function () {
        var title = React.createElement(
            "h2",
            null,
            this.props.referendum.title
        );
        var body = BreakIt(this.props.referendum.description);
        var footer = React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-sm-4" },
                React.createElement(
                    "button",
                    { className: "btn btn-block btn-lg btn-success",
                        onClick: this.props.updateVote.bind(null, true) },
                    React.createElement("i", { className: "fa fa-check" }),
                    " Yes"
                )
            ),
            React.createElement(
                "div",
                { className: "col-sm-4" },
                React.createElement(
                    "button",
                    { className: "btn btn-block btn-lg btn-danger",
                        onClick: this.props.updateVote.bind(null, false) },
                    React.createElement("i", { className: "fa fa-times" }),
                    " No"
                )
            ),
            React.createElement(
                "div",
                { className: "col-sm-4" },
                React.createElement(
                    "button",
                    { className: "btn btn-block btn-lg btn-warning",
                        onClick: this.props.updateVote.bind(null, null) },
                    "Abstain"
                )
            )
        );

        return React.createElement(Panel, { heading: title, body: body, footer: footer });
    }

});