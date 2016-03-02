'use strict';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Panel = React.createClass({
    displayName: 'Panel',

    getDefaultProps: function () {
        return {
            type: 'default',
            heading: '',
            body: '',
            footer: '',
            footerClick: null,
            headerClick: null
        };
    },

    render: function () {
        var heading = null;
        if (this.props.heading) {
            heading = React.createElement(
                'div',
                { className: 'panel-heading', onClick: this.props.headerClick },
                this.props.heading
            );
        }

        var body = null;
        if (this.props.body) {
            body = React.createElement(
                'div',
                { className: 'panel-body' },
                this.props.body
            );
        }

        var footer = null;
        if (this.props.footer) {
            footer = React.createElement(
                'div',
                { className: 'panel-footer', onClick: this.props.footerClick },
                this.props.footer
            );
        }

        var panelType = 'panel panel-' + this.props.type;
        return React.createElement(
            'div',
            { className: panelType },
            heading,
            React.createElement(
                ReactCSSTransitionGroup,
                { transitionName: 'expand', transitionEnterTimeout: 500, transitionLeaveTimeout: 500 },
                body
            ),
            footer
        );
    }
});

var BreakIt = function (text) {
    if (typeof text === 'undefined') {
        throw 'BreakIt text parameter is undefined';
    }
    var broken = text.split("\n").map(function (item, i) {
        return React.createElement(
            'span',
            { key: i },
            item,
            React.createElement('br', null)
        );
    });
    return broken;
};

var AbstainButton = function (props) {
    return React.createElement(
        'div',
        { className: 'btn btn-warning btn-lg', onClick: props.handleClick },
        'Abstain from ',
        props.title,
        ' ',
        React.createElement('i', { className: 'fa fa-arrow-right' })
    );
};