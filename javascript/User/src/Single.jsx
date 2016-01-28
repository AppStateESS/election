var Single = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            election : {},
            updateVote : null,
            vote : {},
            ballots : []
        };
    },

    render: function() {
        var ballots = this.props.ballots.map(function(value){
            return <SingleBallot key={value.id} {...value} />;
        }.bind(this));
        return (
            <div>
                {ballots}
            </div>
        );
    }

});

var SingleBallot = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            title : null,
            tickets : []
        };
    },

    render: function() {
        var tickets = this.props.tickets.map(function(value){
            return <SingleBallotTicket key={value.id} {...value}/>
        }.bind(this));

        return (
            <div>
                {this.props.title}
                {tickets}
            </div>
        );
    }

});

var SingleBallotTicket = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            title : null,
            platform : null,
            siteAddress : null,
            candidates : []
        };
    },

    render: function() {
        var candidates = this.props.candidates.map(function(value){
            return <Candidate key={value.id} {...value} />;
        }.bind(this));

        return (
            <div>
                {this.props.title}
                {this.props.platform}
                {this.props.siteAddress}
                {candidates}
            </div>
        );
    }

});
