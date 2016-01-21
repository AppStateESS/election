var Referendum = React.createClass({
    displayName: "Referendum",

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {};
    },

    render: function () {
        var heading = React.createElement(
            "div",
            null,
            React.createElement(
                "h4",
                null,
                "Multiple chair - 0 ballots"
            )
        );
        return React.createElement(Panel, { type: "primary", heading: heading });
    }

});