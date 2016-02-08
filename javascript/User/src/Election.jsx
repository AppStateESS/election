'use strict';

var Election = React.createClass({
    getInitialState: function() {
        return {
            election : null,
            currentSingle : 0,
            currentMultiple : 0,
            currentReferendum : 0,
            single : [],
            multiple : [],
            referendum : [],
            ballotCount : 0,
            referendumCount : 0,
            stage : 'single',
            singleVote : [],
            multipleVote : [],
            referendumVote : [],
            student : {},
            unqualified : [],
            backToReview : false
        };
    },

    componentDidMount: function() {
        this.load();
    },

    load: function() {
        $.getJSON('election/User/Election', {
        	command : 'list'
        }).done(function(data){
            var stage = this.state.stage;
            if (!data.election) {
                this.setStage('empty');
            } else if (data.hasVoted) {
                this.setState({
                    stage : 'finished',
                    election : data.election
                });
            } else {
                var singleLength = data.single.length;
                var multipleLength = data.multiple.length;
                var referendumLength = data.referendum.length;
                if (singleLength === 0) {
                    stage = 'multiple';
                }
                if (multipleLength === 0) {
                    stage = 'referendum';
                }
                if (referendumLength === 0) {
                    stage = 'empty';
                }
                var ballotCount = singleLength + multipleLength;
                this.setState({
                    stage : stage,
                    hasVoted : data.hasVoted,
                    election : data.election,
                    single : data.single,
                    multiple : data.multiple,
                    referendum : data.referendum,
                    ballotCount : ballotCount,
                    referendumCount : referendumLength
                });
            }

        }.bind(this));
    },

    setStage : function(stage) {
        this.setState({
            stage : stage
        });
    },

    getSingleKey : function(id) {
        var found = 0;
        $.each(this.state.single, function(index, value){
            console.log('compare ' + id + ' to ' + value.id);
            if (id === value.id) {
                found = index;
            }
        });
        console.log('found is ' + found);
        return found;
    },

    getMultipleKey : function(id) {
        $.each(this.state.multiple, function(index, value){
            if (id === value.id) {
                return index;
            }
        });
    },

    getReferendumKey : function(id) {
        $.each(this.state.referendum, function(index, value){
            if (id === value.id) {
                return index;
            }
        });
    },

    setCurrentSingle : function(id) {
        console.log('seting single to ' + id);
        this.setState({
            currentSingle : id
        });
    },

    setCurrentMultiple : function(id) {
        this.setState({
            currentMultiple : id
        });
    },

    setCurrentReferendum : function(id) {
        this.setState({
            currentReferendum : id
        });
    },

    resetStage : function(stage, id) {
        switch(stage) {
            case 'single':
            this.setCurrentSingle(this.getSingleKey(id));
            break;

            case 'multiple':
            this.setCurrentMultiple(this.getMultipleKey(id));
            break;

            case 'referendum':
            this.setCurrentReferendum(this.getReferendumKey(id));
            break;
        }
        this.setState({
            backToReview : true,
            stage : stage
        });
    },

    updateSingleVote : function(ticket) {
        var stage = this.state.stage;
        var current = this.state.currentSingle;
        var nextSingle = current + 1;
        var singleVote = this.state.singleVote;
        var currentVote = singleVote[current];
        currentVote = {
            single : this.state.single[this.state.currentSingle],
            ticket : ticket
        };
        singleVote[current] = currentVote;

        if (this.state.backToReview) {
            stage = 'review';
        } else if (typeof this.state.single[nextSingle] === 'undefined') {
            stage = 'multiple';
        }
        this.setState({
            stage : stage,
            singleVote : singleVote,
            currentSingle : nextSingle
        });
    },

    updateMultipleVote: function(chairs) {
        var stage = this.state.stage;
        var current = this.state.currentMultiple;
        var nextMultiple = current + 1;
        var multipleVote = this.state.multipleVote;
        var currentVote = multipleVote[current];

        currentVote = {
            multiple : this.state.multiple[current],
            chairs : chairs
        };

        multipleVote[current] = currentVote;
        if (typeof this.state.multiple[nextMultiple] === 'undefined') {
            stage = 'referendum';
        }

        this.setState({
            stage : stage,
            multipleVote : multipleVote,
            currentMultiple : nextMultiple
        });
    },

    updateReferendumVote : function(vote) {
        var stage = this.state.stage;
        var current = this.state.currentReferendum;
        var nextReferendum = current + 1;
        var referendumVote = this.state.referendumVote;
        var currentVote = referendumVote[current];

        currentVote = {
            referendum : this.state.referendum[current],
            choice : vote
        };

        referendumVote[current] = currentVote;

        if (typeof this.state.multiple[nextReferendum] === 'undefined') {
            stage = 'review';
        }

        this.setState({
            stage : stage,
            referendumVote : referendumVote,
            currentReferendum : nextReferendum
        });
    },

    finalVote : function() {

    },

    render: function() {
        var content = null;
        var review = null;

        if (this.state.backToReview) {
            review = <button className="btn btn-lg btn-block btn-info" onClick={this.setStage.bind(null, 'review')}>Click when finished reviewing choices</button>
        }

        switch (this.state.stage) {
            case 'empty':
            content = <Empty />;
            break;

            case 'finished':
            content = <Finished election={this.state.election}/>;
            break;

            case 'single':
            content = <Single election={this.state.election}
                ballot={this.state.single[this.state.currentSingle]}
                updateVote={this.updateSingleVote} vote={this.state.singleVote}/>;
            break;

            case 'multiple':
            content = <Multiple election={this.state.election}
                ballot={this.state.multiple[this.state.currentMultiple]}
                updateVote={this.updateMultipleVote} vote={this.state.multipleVote}
                unqualified={this.state.unqualified}/>
            break;

            case 'referendum':
            content = <Referendum election={this.state.election}
                referendum={this.state.referendum[this.state.currentReferendum]}
                updateVote={this.updateReferendumVote} vote={this.state.referendumVote}/>
            break;

            case 'review':
            review = null;
            content = <Review election={this.state.election}
                single={this.state.single}
                multiple={this.state.multiple}
                referendum={this.state.referendum}
                singleVote={this.state.singleVote}
                multipleVote={this.state.multipleVote}
                referendumVote={this.state.referendumVote}
                finalVote={this.finalVote}
                resetStage={this.resetStage}/>
            break;
        }

        var countdown = null;

        if (this.state.singleVote.length === 0 &&
        this.state.multipleVote.length === 0 &&
        this.state.referendumVote.length === 0) {
            countdown = (<Countdown ballotCount={this.state.ballotCount}
                referendumCount={this.state.referendumCount}/>);
        } else {
            countdown = <div>Alternate countdown</div>;
        }

        return (
            <div>
                {countdown}
                {review}
                {content}
            </div>
        );
    }

});

var Empty = () => (
    <div>
        <h3>No elections are available. Please check back later.</h3>
    </div>
);

var Finished = React.createClass({
    getDefaultProps: function() {
        return {
            election : {}
        };
    },

    render: function() {
        return (
            <div>
                <h2>{this.props.election.title}</h2>
                <p>Thank you for voting! Watch SGA for results.</p>
            </div>
        );
    }

});

var Countdown = React.createClass({
    getInitialState: function() {
        return {
            seen : false
        };
    },

    getDefaultProps: function() {
        return {
            ballotCount : 0,
            referendumCount : 0,
            vote : null
        };
    },

    plural: function(item, single, plural) {
        if (typeof single === 'undefined' || single.length === 0) {
            single = '';
        }
        if (typeof plural === 'undefined' || plural.length === 0) {
            plural = 's';
        }
        return (item != 1 ? plural : single);
    },

    render: function() {
        var ballots = null;
        var referendum = null;
        var totalItems = 0;
        var isAre = 'are';
        var and = '';

        if (this.props.ballotCount > 0) {
            totalItems += this.props.ballotCount;
            ballots = this.props.ballotCount + ' ballot' + this.plural(this.props.ballotCount);
        }

        if (this.props.referendumCount > 0) {
            totalItems += this.props.referendumCount;
            referendum = this.props.referendumCount + ' referend' + this.plural(this.props.referendumCount, 'um', 'a')
        }

        if (totalItems < 2) {
            isAre = 'is';
        }

        if (this.props.ballotCount > 0 && this.props.referendumCount > 0) {
            and = 'and';
        }

        return (
            <div className="alert alert-info">
                There {isAre} currently {ballots} {and} {referendum} for you to vote on. We'll review all your selections later, before your votes are submitted.
            </div>
        );
    }

});

ReactDOM.render(<Election/>, document.getElementById('election'));
