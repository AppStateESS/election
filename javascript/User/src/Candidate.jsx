var Candidate = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            firstName : '',
            lastName : '',
            picture : '',
            title : ''
        };
    },

    render: function() {
        return (
            <div>
                <div className="photo-matte">
                    <span className="helper"></span>
                    {this.props.picture.length > 0 ? (
                        <img src={this.props.picture} className="candidate-pic" />
                    ) : (
                        <div className="no-picture text-muted"><i className="fa fa-user fa-5x"></i><br />No picture</div>
                    )}
                </div>
                <p><strong>{this.props.firstName} {this.props.lastName}</strong><br />
            {this.props.title}</p>
            </div>
        );
    }

});
