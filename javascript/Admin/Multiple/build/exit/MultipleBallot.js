'use strict';

var MultipleBallot = React.createClass({
    displayName: 'MultipleBallot',

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {};
    },

    render: function () {
        return React.createElement(
            'div',
            { className: 'election-list' },
            React.createElement(BallotList, { listing: this.state.ballotList, reload: this.load })
        );
    }

});

ReactDOM.render(React.createElement(MultipleBallot, null), document.getElementById('multiple-ballot'));