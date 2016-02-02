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
        console.log(this.props.referendum);
        return React.createElement(
            "div",
            null,
            "Referendum"
        );
    }

});