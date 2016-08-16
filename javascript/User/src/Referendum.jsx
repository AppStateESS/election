import React from 'react';
import ReactDOM from 'react-dom';

var Referendum = React.createClass({
    getDefaultProps: function() {
        return {
            election : {},
            updateVote : null,
            vote : [],
            referendum : {}
        };
    },

    render: function() {
        var title = <h2>{this.props.referendum.title}</h2>;
        var body = BreakIt(this.props.referendum.description);
        var footer = (
            <div className="row">
                <div className="col-sm-4">
                    <button className="btn btn-block btn-lg btn-default"
                        onClick={this.props.updateVote.bind(null, 'yes')}>
                        <i className="fa fa-check"></i> Yes
                    </button>
                </div>
                <div className="col-sm-4">
                    <button className="btn btn-block btn-lg btn-default"
                        onClick={this.props.updateVote.bind(null, 'no')}>
                        <i className="fa fa-times"></i> No
                    </button>
                </div>
                <div className="col-sm-4">
                    <button className="btn btn-block btn-lg btn-default"
                        onClick={this.props.updateVote.bind(null, 'abstain')}>
                        Abstain
                    </button>
                </div>
            </div>
        );

        return (
            <Panel heading={title} body={body} footer={footer}/>
        );
    }

});

export default Referendum;
