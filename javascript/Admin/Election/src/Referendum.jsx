var Referendum = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
        };
    },

    render: function() {
        var heading = (
            <div>
                <h4>Multiple chair - 0 ballots</h4>
            </div>
        );
        return <Panel type="primary" heading={heading}/>;
    }

});
