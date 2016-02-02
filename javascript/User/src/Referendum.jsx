var Referendum = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            election : {},
            updateVote : null,
            vote : [],
            referendum : {}
        };
    },

    render: function() {
        console.log(this.props.referendum);
        return (
            <div>
                Referendum
            </div>
        );
    }

});
