var Candidate = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            firstName : null,
            lastName : null,
            picture : defaultPicture
        };
    },

    render: function() {
        console.log(this.props);
        return (
            <div>
                {this.props.firstName}
                {this.props.lastName}
                <img src={this.props.picture} className="img-responsive"/>
            </div>
        );
    }

});
