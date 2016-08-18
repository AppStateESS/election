import React from 'react';
import ReactDOM from 'react-dom';


var Modal = React.createClass({
    getInitialState: function() {
        return {header: null, body: null, footer: null};
    },

    getDefaultProps: function() {
        return {header: null, body: null, footer: null, modalId: 'reactModal', onClose: null};
    },

    componentDidMount: function() {
        if (this.props.onClose) {
            $('#' + this.props.modalId).on('hidden.bs.modal', function (e) {
                this.props.onClose();
            }.bind(this));
        }
    },

    render: function() {
        return (
            <div id={this.props.modalId} className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">{this.props.header}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.body}
                        </div>
                        <div className="modal-footer">
                            {this.props.footer}
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default Modal;
