var Review = React.createClass({
    getDefaultProps: function() {
        return {
            election : {},
            singleVote : [],
            multipleVote : [],
            referendumVote : []
        };
    },

    render: function() {
        return (
            <div>
                <SingleResult vote={this.props.singleVote}/>;
            </div>
        );
    }

});

var SingleResult = React.createClass({
    getDefaultProps: function() {
        return {
            vote : []
        };
    },

    render: function() {
        var rows = this.props.vote.map(function(value, key){
            return <SingleResultRow key={key} {...value}/>;
        });

        return (
            <div>
                {rows}
            </div>
        );
    }

});

var SingleResultRow = React.createClass({
    getDefaultProps: function() {
        return {
            vote : {},
        };
    },

    render: function() {
        var heading = (
            <div>
                <button className="btn btn-default pull-right">
                    <i className="fa fa-pencil"></i> Edit
                </button>
                <h3>{this.props.single.title}</h3>
            </div>
        );

        var candidates = this.props.ticket.candidates.map(function(value, key) {
            return (
                <div className="pull-left pad-right" key={key}>
                    <SingleCandidate {...value}/>
                </div>
            );
        });

        var body = (
            <div>
                <h4>{this.props.ticket.title}</h4>
                <div>
                    {candidates}
                </div>
            </div>
        );

        return <Panel heading={heading} body={body}/>;
    }
});

var MultipleResult = React.createClass({
    getDefaultProps: function() {
        return {
            multiple : {},
            candidates : []
        };
    },

    render: function() {
        var candidates = this.props.ticket.candidates.map(function(value, key) {
            return (
                <div className="pull-left pad-right" key={key}>
                    <MultipleCandidate {...value}/>
                </div>
            );
        });

        return (
            <div>
                <h4>{this.props.multiple.title}</h4>
                <ul className="list-group">
                    {candidates}
                </ul>
            </div>
        );
    }

});
