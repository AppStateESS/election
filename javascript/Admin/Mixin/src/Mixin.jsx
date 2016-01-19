'use strict';

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

var Ballot = {
    getInitialState: function() {
        return {
            ballotList : [],
        };
    },

    componentDidMount: function() {
        this.load();
    },

    render: function() {
        return (
            <div className='election-list'>
                <BallotList listing={this.state.ballotList} reload={this.load}/>
            </div>
        );
    }
};

var BallotListMixin = {
    getInitialState : function() {
        return {
            ballotEditId : 0
        };
    },

    getDefaultProps: function() {
        return {
            listing : [],
            reload : null
        };
    },

    editBallot : function(ballotId) {
        this.setState({
            ballotEditId : ballotId
        });
    },
};

var BallotForm = {
    getInitialState: function() {
        return {
            ballotId: 0,
            title: '',
            startDate: '',
            endDate: '',
            unixStart: 0,
            unixEnd: 0,
            seats: 1
        }
    },

    getDefaultProps: function() {
        return {
            id: 0,
            title: '',
            startDate: '',
            endDate: '',
            hideForm: null,
            seats: 1
        };
    },

    componentWillMount: function() {
        if (this.props.id) {
            this.copyPropsToState();
        }
    },

    componentDidMount: function() {
        this.initStartDate();
        this.initEndDate();
    },

    copyPropsToState: function() {
        this.setState({
            ballotId : this.props.id,
            title : this.props.title,
            startDate : this.props.startDateFormatted,
            endDate : this.props.endDateFormatted,
            unixStart : this.props.startDate,
            unixEnd : this.props.endDate,
            seats : this.props.seats
        });
    },

    initStartDate : function() {
        $('#start-date').datetimepicker({
            minDate: 0,
            value : this.state.startDate,
            format : dateFormat,
            onChangeDateTime : function(ct, i) {
                this.updateStartDate(this.refs.startDate.value);
            }.bind(this)
        });
    },

    initEndDate : function() {
        $('#end-date').datetimepicker({
            minDate:0,
            format : dateFormat,
            value : this.state.endDate,
            onChangeDateTime : function(ct, i) {
                this.updateEndDate(this.refs.endDate.value);
            }.bind(this)
        });
    },

    showStartCalendar : function() {
        $('#start-date').datetimepicker('show');
    },

    showEndCalendar : function() {
        $('#end-date').datetimepicker('show');
    },

    updateTitle : function(e) {
        this.setState({
            title : e.target.value
        });
    },

    changeStartDate: function(e) {
        this.updateStartDate(e.target.value);
    },

    changeEndDate: function(e) {
        this.updateEndDate(e.target.value);
    },

    updateStartDate : function(start) {
        var dateObj = new Date(start);
        var unix = dateObj.getTime() / 1000;
        this.setState({
            startDate : start,
            unixStart : unix
        });
    },

    updateEndDate : function(end) {
        var dateObj = new Date(end);
        var unix = dateObj.getTime() / 1000;
        this.setState({
            endDate : end,
            unixEnd : unix
        });
    },

    checkForErrors : function() {
        var error = false;
        if (this.state.title.length === 0) {
            $('#ballot-title').css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }

        if (this.state.startDate.length === 0) {
            $('#start-date').css('borderColor', 'red').attr('placeholder', 'Please enter a start date');
            error = true;
        } else if (this.state.unixStart > this.state.unixEnd) {
            $('#end-date').css('borderColor', 'red').attr('placeholder', 'End date must be greater').val('');
            this.setState({
                endDate : ''
            });
            error = true;
        }

        if (this.state.endDate.length === 0) {
            $(this.refs.endDate).css('borderColor', 'red').attr('placeholder', 'Please enter a end date');
            error = true;
        }

        return error;
    },

    resetBorder : function(node) {
        $(node.target).removeAttr('style');
    },

    _render: function() {
        var heading = <BallotFormHeading resetBorder={this.resetBorder} handleChange={this.updateTitle}/>;

        var seatNumber = '';

        if (this.props.seatNumber > 1) {
            var options = '';
            for (var i; i <= 25; i++) {
                options += '<option>' + i + '</option>';
            }
            seatNumber = (
                <div>
                    <select onChange={this.props.updateSeats}>
                        {options}
                    </select>
                </div>
            );
        }

        var body = (
            <div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="start-date" className="control-label pad-right">Start voting:</label>
                            <div className="input-group">
                                <input type="text" className="form-control datepicker" id="start-date" onFocus={this.props.resetBorder} onChange={this.props.changeStartDate}/>
                                <div className="input-group-addon">
                                    <i className="fa fa-calendar" onClick={this.props.startClick}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="end-date" className="control-label pad-right">End voting:</label>
                            <div className="input-group">
                                <input type="text" className="form-control datepicker" id="end-date" onFocus={this.props.resetBorder} onChange={this.props.changeEndDate}/>
                                <div className="input-group-addon">
                                    <i className="fa fa-calendar" onClick={this.props.endClick}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {seatNumber}
                <hr />
                <button className="btn btn-primary pad-right" onClick={this.props.saveClick}><i className="fa fa-save"></i> Save ballot</button>
                <button className="btn btn-danger" onClick={this.props.hideClick}><i className="fa fa-times"></i> Cancel</button>
            </div>
        );

        return (
            <Panel heading={heading} body={body} />
        );
    }
};

var BallotFormHeading = React.createClass({

    getDefaultProps: function() {
        return {
        };
    },

    render: function() {
        return (
            <input type="text" className="form-control" defaultValue={this.props.title}
                id="ballot-title" onFocus={this.props.resetBorder} onChange={this.props.handleChange} placeholder='Ballot title' />
        );
    }

});
