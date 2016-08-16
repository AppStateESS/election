import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

var Panel = React.createClass({
    getDefaultProps: function() {
        return {
            type : 'default',
            heading : '',
            body : '',
            footer : '',
            footerClick : null,
            headerClick : null
        };
    },

    render: function() {
        var heading = null;
        if (this.props.heading) {
            heading = <div className="panel-heading" onClick={this.props.headerClick}>{this.props.heading}</div>;
        }

        var body = null;
        if (this.props.body) {
            body = (
                <div className="panel-body">
                    {this.props.body}
                </div>
            )
        }

        var footer = null;
        if (this.props.footer) {
            footer = <div className="panel-footer" onClick={this.props.footerClick}>{this.props.footer}</div>;
        }

        var panelType = 'panel panel-' + this.props.type;
        return (
            <div className={panelType}>
                {heading}
                <ReactCSSTransitionGroup transitionName="expand"  transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                {body}
                </ReactCSSTransitionGroup>
                {footer}
            </div>
        );
    }
});

export default Panel;
