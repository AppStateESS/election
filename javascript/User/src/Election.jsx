var Election = React.createClass({
    getInitialState: function() {
        return {
            election : {},
            student : {},
            stage : 'single',
            votes : {}
        };
    },

    componentDidMount: function() {
        this.load();
    },

    load: function() {
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
