var Referendum = React.createClass({
    getDefaultProps: function() {
        return {
            election : {},
            updateVote : null,
            vote : [],
            referendum : {}
        };
    },

    render: function() {
        var title = <h2>{this.props.referendum.title}</h2>;
        var body = BreakIt(this.props.referendum.description);
        var footer = (
            <div className="row">
                <div className="col-sm-4">
                    <button className="btn btn-block btn-lg btn-success"
                        onClick={this.props.updateVote.bind(null, true)}>
                        <i className="fa fa-check"></i> Yes
                    </button>
                </div>
                <div className="col-sm-4">
                    <button className="btn btn-block btn-lg btn-danger"
                        onClick={this.props.updateVote.bind(null, false)}>
                        <i className="fa fa-times"></i> No
                    </button>
                </div>
                <div className="col-sm-4">
                    <button className="btn btn-block btn-lg btn-warning"
                        onClick={this.props.updateVote.bind(null, null)}>
                        Abstain
                    </button>
                </div>
            </div>
        );

        return (
            <Panel heading={title} body={body} footer={footer}/>
        );
    }

});
