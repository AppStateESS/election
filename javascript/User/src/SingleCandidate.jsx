import React from 'react';
import ReactDOM from 'react-dom';

var SingleCandidate = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            firstName : '',
            lastName : '',
            picture : '',
            title : '',
            candidateLength : 1
        };
    },

    render: function() {
        switch (this.props.candidateLength) {
            case 1:
            var colSize = 'col-sm-6';
            break;
            case 2:
            var colSize = 'col-sm-3';
        }
        return (
            <div className={colSize}>
                <div>
                    {this.props.picture.length > 0 ? (
                        <div className="photo-matte">
                            <span className="helper"></span>
                            <img src={this.props.picture} className="img-responsive candidate" />
                        </div>
                        ) : (
                            <div className="no-picture text-muted"><i className="fa fa-user fa-5x"></i><br />No picture</div>
                    )}
                </div>
                <p><strong>{this.props.firstName} {this.props.lastName}</strong><br />
                    {this.props.title}</p>
            </div>
        );
    }

});

export default SingleCandidate;
