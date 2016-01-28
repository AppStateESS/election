var Election = React.createClass({
    getInitialState: function() {
        return {
            election : {},
            single : [],
            multiple : [],
            referendum : [],
            ballotCount : 0,
            stage : 'single',
            votes : {},
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
            this.setState({
                hasVoted : data.hasVoted,
                election : data.election,
                single : data.single,
                multiple : data.multiple,
                referendum : data.referendum
            });
        }.bind(this));
    },

    setStage : function(stage) {
        this.setState({
            stage : stage
        });
    },

    render: function() {
        var content = null;

        switch (this.state.stage) {
            case 'single':
            content = <Single />;
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

ReactDOM.render(<Election/>, document.getElementById('election'));
