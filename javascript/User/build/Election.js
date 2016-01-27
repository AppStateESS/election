var Election = React.createClass({
    displayName: 'Election',

    getInitialState: function () {
        return {
            election: {},
            single: [],
            multiple: [],
            referendum: [],
            stage: 'single',
            votes: {},
            student: {}
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {
        $.getJSON('election/User/Election', {
            command: 'list'
        }).done(function (data) {
            this.setState({
                election: data.election,
                single: data.single,
                multiple: data.multiple,
                referendum: data.referendum
            });
        }.bind(this));
    },

    setStage: function (stage) {
        this.setState({
            stage: stage
        });
    },

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