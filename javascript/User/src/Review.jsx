var Review = React.createClass({
    getDefaultProps: function() {
        return {
            election : {},
            singleVote : [],
            multipleVote : [],
            referendumVote : [],
            resetStage : null
        };
    },

    render: function() {
        return (
            <div>
                <h2>Review</h2>
                <div className="review-warning">
                    <p>You're almost done</p>
                    <p>Since you may only vote once, let's review your selections.</p>
                </div>
                <div className="text-center">
                    <button className="btn btn-lg btn-block btn-success" onClick={this.props.finalVote}>Place my Vote</button>
                </div>
                <div>&nbsp;</div>
                <div className="vote-results">
                    <SingleResult vote={this.props.singleVote} resetStage={this.props.resetStage}/>
                    <MultipleResult vote={this.props.multipleVote} resetStage={this.props.resetStage}/>
                    <ReferendumResult vote={this.props.referendumVote} resetStage={this.props.resetStage}/>
                </div>
                <div className="text-center">
                    <button className="btn btn-lg btn-block btn-success" onClick={this.props.finalVote}>Place my Vote</button>
                </div>
            </div>
        );
    }

});

var SingleResult = React.createClass({
    getDefaultProps: function() {
        return {
            vote : [],
            resetStage : null
        };
    },

    render: function() {
        var rows = this.props.vote.map(function(value, key){
            return <SingleResultRow key={key} {...value} resetStage={this.props.resetStage.bind(null, 'single', value.single.id)}/>;
        }.bind(this));

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
            resetStage : null,
            single : {},
            ticket : {}
        };
    },

    render: function() {
        var heading = (
            <div className="row">
                <div className="col-xs-10">
                    <h3>{this.props.single.title}</h3>
                </div>
                <div className="col-xs-2">
                    <button className="btn btn-block btn-default"
                        onClick={this.props.resetStage.bind(null, 'single', this.props.single.id)}>
                        <i className="fa fa-pencil"></i> Edit
                    </button>
                </div>
            </div>
        );

        if (this.props.ticket) {
            var icon = <i className="fa fa-check-circle text-success fa-5x pull-right"></i>;
            var title = <h4>{this.props.ticket.title}</h4>;
            var candidates = this.props.ticket.candidates.map(function(value, key) {
                return (
                    <div className="pull-left pad-right" key={key}>
                        <SingleCandidate {...value}/>
                    </div>
                );
            });
        } else {
            var icon = null;
            var title = <h4>No ticket chosen</h4>;
            var candidates = <p>Abstained</p>;
        }

        var body = (
            <div>
                {icon}
                {title}
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
            vote : [],
            resetStage : null
        };
    },

    render: function() {
        var multiples = this.props.vote.map(function(vote, key) {
            return <MultipleResultRow {...vote} key={key} resetStage={this.props.resetStage}/>;
        }.bind(this));

        var heading = (
            <h3>Senate Seats</h3>
        );

        var body = (
            <div>
                {multiples}
            </div>
        );

        return (<Panel heading={heading} body={body} />);
    }
});

var MultipleResultRow = React.createClass({
    getDefaultProps: function() {
        return {
            chairs : [],
            multiple : {},
            resetStage : null
        };
    },

    render: function() {
        var heading = (
            <div className="row">
                <div className="col-xs-10">
                    <h4>{this.props.multiple.title}</h4>
                </div>
                <div className="col-xs-2">
                    <button className="btn btn-default btn-block"
                        onClick={this.props.resetStage.bind(null, 'multiple', this.props.multiple.id)}>
                        <i className="fa fa-pencil"></i> Edit
                    </button>
                </div>
            </div>
        );
        if (this.props.chairs.length === 0) {
            var candidates = <div><h4>No candidates chosen.</h4><p>Abstained.</p></div>;
        } else {
            var candidateListing = this.props.multiple.candidates.map(function(candidate, key){
                if ($.inArray(candidate.id, this.props.chairs) !== -1) {
                    return <MultipleCandidateRow {...candidate} key={key}/>;
                }
            }.bind(this));
            var candidates = (
                <ul className="list-group">
                    {candidateListing}
                </ul>
            );
        }

        var body = (
            <div className="multiple-ticket-vote">
                {candidates}
            </div>
        );
        return <Panel heading={heading} body={body}/>;
    }

});

var MultipleCandidateRow = React.createClass({
    getDefaultProps: function() {
        return {
            firstName : '',
            lastName : '',
            picture : ''
        };
    },

    render: function() {
        var icon = <i className="pull-right text-success fa fa-check-circle fa-2x"></i>;

        var picture = <img className="img-circle" src='mod/election/img/no-picture.gif'/>

        if (this.props.picture.length > 0) {
            picture = <img className="img-circle" src={this.props.picture}/>;
        }

        return (
            <li className="list-group-item" onClick={this.props.select}>
                {icon}
                {picture}
                {this.props.firstName} {this.props.lastName}
            </li>
        );
    }

});

var ReferendumResult = React.createClass({
    getDefaultProps: function() {
        return {
            vote : [],
            resetStage : null
        };
    },

    getInitialState: function() {
        return {
        };
    },

    render: function() {
        var rows = this.props.vote.map(function(value, key){
            return <ReferendumResultRow key={key} {...value} resetStage={this.props.resetStage}/>;
        }.bind(this));

        var heading = (<h3>Referenda</h3>);

        var body = (
            <div>
                {rows}
            </div>
        );

        return <Panel heading={heading} body={body} />;
    }
});

var ReferendumResultRow = React.createClass({
    getDefaultProps: function() {
        return {
        };
    },

    render: function() {
        var voted = '';
        switch (this.props.answer) {
            case true:
            voted = <span className="text-success"><i className="fa fa-check-circle"></i> Yes</span>;
            break;

            case false:
            voted = <span className="text-danger"><i className="fa fa-times-circle"></i> No</span>;
            break;

            case null:
            voted = <span className="text-primary"><i className="fa fa-question-circle"></i> Abstained</span>;
            break;
        }

        return (
            <div className="row referendum-result">
                <div className="col-sm-6">{this.props.referendum.title}</div>
                <div className="col-sm-3">{voted}</div>
                <div className="col-sm-3">
                    <button className="btn btn-block btn-default"
                        onClick={this.props.resetStage.bind(null, 'referendum', this.props.referendum.id)}>
                        <i className="fa fa-pencil"></i> Edit
                    </button>
                </div>
            </div>
        );
    }

});
