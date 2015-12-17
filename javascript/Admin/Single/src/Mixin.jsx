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
