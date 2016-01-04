var Modal = React.createClass({
    getDefaultProps: function() {
        return {
            title : null,
            modalId : null,
            body : null
        };
    },

    render: function() {
        return (
            <div className="modal" id={this.props.modalId} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.body}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var Panel = React.createClass({
    getDefaultProps: function() {
        return {
            type : 'default',
            heading : null,
            body : null,
            footer : null
        };
    },

    render: function() {
        var heading = null;
        if (this.props.heading !== null) {
            heading = <div className="panel-heading">{this.props.heading}</div>;
        }
        var body = null;
        if (this.props.body !== null) {
            body = <div className="panel-body">{this.props.body}</div>;
        }
        var footer = null;
        if (this.props.footer !== null) {
            footer = <div className="panel-footer">{this.props.footer}</div>;
        }

        var panelType = 'panel panel-' + this.props.type;
        return (
            <div className={panelType}>
                {heading}
                {body}
                {footer}
            </div>
        );
    }

});
