'use strict';

var Modal = React.createClass({
    displayName: "Modal",

    getDefaultProps: function () {
        return {
            title: null,
            modalId: null,
            body: null
        };
    },

    render: function () {
        return React.createElement(
            "div",
            { className: "modal", id: this.props.modalId, tabIndex: "-1", role: "dialog" },
            React.createElement(
                "div",
                { className: "modal-dialog", role: "document" },
                React.createElement(
                    "div",
                    { className: "modal-content" },
                    React.createElement(
                        "div",
                        { className: "modal-header" },
                        React.createElement(
                            "button",
                            { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                            React.createElement(
                                "span",
                                { "aria-hidden": "true" },
                                "×"
                            )
                        ),
                        React.createElement(
                            "h4",
                            { className: "modal-title" },
                            this.props.title
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "modal-body" },
                        this.props.body
                    )
                )
            )
        );
    }
});

var Panel = React.createClass({
    displayName: "Panel",

    getDefaultProps: function () {
        return {
            type: 'default',
            heading: null,
            body: null,
            footer: null
        };
    },

    render: function () {
        var heading = null;
        if (this.props.heading !== null) {
            heading = React.createElement(
                "div",
                { className: "panel-heading" },
                this.props.heading
            );
        }
        var body = null;
        if (this.props.body !== null) {
            body = React.createElement(
                "div",
                { className: "panel-body" },
                this.props.body
            );
        }
        var footer = null;
        if (this.props.footer !== null) {
            footer = React.createElement(
                "div",
                { className: "panel-footer" },
                this.props.footer
            );
        }

        var panelType = 'panel panel-' + this.props.type;
        return React.createElement(
            "div",
            { className: panelType },
            heading,
            body,
            footer
        );
    }

});