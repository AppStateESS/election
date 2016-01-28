var Candidate = React.createClass({
    displayName: "Candidate",

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {
            firstName: null,
            lastName: null,
            picture: defaultPicture
        };
    },

    render: function () {
        console.log(this.props);
        return React.createElement(
            "div",
            null,
            this.props.firstName,
            this.props.lastName,
            React.createElement("img", { src: this.props.picture, className: "img-responsive" })
        );
    }

});