'use strict';

var Election = React.createClass({
    getInitialState: function() {
        return {
            election : null,
            single : [],
            multiple : [],
            referendum : [],
            ballotCount : 0,
            stage : 'single',
            vote : {},
            student : {}
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
                this.setState({
                    stage : stage,
                    hasVoted : data.hasVoted,
                    election : data.election,
                    single : data.single,
                    multiple : data.multiple,
                    referendum : data.referendum
                });
            }

        }.bind(this));
    },

    setStage : function(stage) {
        this.setState({
            stage : stage
        });
    },

    updateVote : function(vote) {
        this.setState({
            vote : vote
        });
    },

    render: function() {
        var content = null;
        var shared = {
            election : this.state.election,
            updateVote : this.updateVote,
            vote : this.state.vote
        };
        switch (this.state.stage) {
            case 'empty':
            content = <Empty />;
            break;

            case 'finished':
            content = <Finished election={this.state.election}/>;
            break;

            case 'single':
            content = <Single {...shared} ballots={this.state.single}/>;
            break;

            case 'multiple':
            content = <Multiple />
            break;

            case 'referendum':
            content = <Referendum />
            break;
        }

        return (
            <div>
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
    getInitialState: function() {
        return {
        };
    },

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

ReactDOM.render(<Election/>, document.getElementById('election'));
