var Single = React.createClass({
    getDefaultProps: function() {
        return {
            election : {},
            updateVote : null,
            vote : [],
            ballot : {}
        };
    },

    render: function() {
        return <SingleBallot singleId={this.props.ballot.id} {...this.props.ballot}
            updateVote={this.props.updateVote} vote={this.props.vote}/>;
    }

});

var SingleBallot = React.createClass({
    getDefaultProps: function() {
        return {
            updateVote : null,
            title : null,
            tickets : [],
            vote : null,
            singleId : 0
        };
    },

    render: function() {
        var tickets = this.props.tickets.map(function(value){
            return (<SingleBallotTicket key={value.id} {...value}
                updateVote={this.props.updateVote.bind(null, value)}/>);
        }.bind(this));
        return (
            <div className="single-ticket-vote">
                <h1>{this.props.title}</h1>
                <p className="warning">Vote for <strong>ONE</strong> ticket. We&#39;ll review your decision at the end.</p>
                {tickets}
                <hr />
                <div className="text-right">
                    <AbstainButton title={this.props.title} handleClick={this.props.updateVote.bind(null, null)} />
                </div>
            </div>
        );
    }
});

var SingleBallotTicket = React.createClass({
    mixins : ['panel'],

    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            title : null,
            platform : null,
            siteAddress : null,
            candidates : [],
            updateVote : null,
            vote : []
        };
    },

    render: function() {
        var candidateCount = this.props.candidates.length;
        if (candidateCount > 0) {
            var candidates = this.props.candidates.map(function(value){
                return <SingleCandidate key={value.id} {...value} candidateLength={candidateCount} />;
            }.bind(this));
        } else {
            var candidates = null;
        }

        var heading = <h2>{this.props.title}</h2>;

        var platform = BreakIt(this.props.platform);

        var website = null;

        if (this.props.siteAddress.length) {
            website = <div className="website"><a href={this.props.siteAddress} target="_blank">{this.props.siteAddress} <i className="fa fa-external-link"></i></a></div>;
        }

        var body = (
            <div className="ticket">
                <div className="row">
                    <div className="col-sm-6">
                        {platform}
                        <hr />
                        {website}
                    </div>
                        {candidates}
                </div>
                <button className="btn btn-primary btn-block btn-lg" onClick={this.props.updateVote}>
                    <i className="fa fa-check-square-o"></i> Vote for {this.props.title}
                </button>
            </div>
        );

        return (
            <Panel heading={heading} body={body}/>
        );
    }

});

var SingleCandidate = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            firstName : '',
            lastName : '',
            picture : '',
            title : '',
            candidateLength : 1
        };
    },

    render: function() {
        switch (this.props.candidateLength) {
            case 1:
            var colSize = 'col-sm-6';
            break;
            case 2:
            var colSize = 'col-sm-3';
        }
        return (
            <div className={colSize}>
                <div>
                    {this.props.picture.length > 0 ? (
                        <div className="photo-matte">
                            <span className="helper"></span>
                            <img src={this.props.picture} className="img-responsive candidate" />
                        </div>
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
