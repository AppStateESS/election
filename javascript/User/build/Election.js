var Election = React.createClass({
    displayName: 'Election',

    getInitialState: function () {
        return {
            election: {},
            student: {},
            stage: 'single',
            votes: {}
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {},

    render: function () {
        var content = null;

        switch (this.state.stage) {
            case 'single':
                content = React.createElement(Single, null);
                break;

            case 'multiple':
                content = React.createElement(Multiple, null);
                break;

            case 'referendum':
                content = React.createElement(Referendum, null);
                break;
        }

        return React.createElement(
            'div',
            null,
            content
        );
    }

});

ReactDOM.render(React.createElement(Election, null), document.getElementById('election'));