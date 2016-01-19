'use strict';

var SingleBallot = React.createClass({
    mixins : ['Panel'],

    getInitialState: function() {
        return {
            ballotList : [],
        };
    },

    componentDidMount: function() {
        this.load();
    },

    load : function() {
        $.getJSON('election/Admin/Single', {
        	command : 'list'
        }).done(function(data){
            this.setState({
                ballotList : data
            });
        }.bind(this));
    },

    render: function() {
        return (
            <div className='election-list'>
                <BallotList listing={this.state.ballotList} reload={this.load}/>
            </div>
        );
    }

});

var BallotList = React.createClass({
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

    render: function() {
        var form = null;

        if (this.state.ballotEditId === -1) {
            form = <SingleBallotForm hideForm={this.editBallot.bind(null,0)} reload={this.props.reload}/>
        }

        var ballotList = this.props.listing.map(function(value){
            if (value.id === this.state.ballotEditId) {
                return <SingleBallotForm key={value.id} {...value} hideForm={this.editBallot.bind(null, 0)} reload={this.props.reload}/>;
            } else {
                return <BallotListRow key={value.id} {...value} handleEdit={this.editBallot.bind(null, value.id)} reload={this.props.reload}/>
            }
        }.bind(this));

        if (ballotList.length === 0) {
            ballotList = (
                <div>
                <h3>No ballots found.</h3>
                </div>
            );
        }

        return (
            <div>
                <button className="btn btn-success" onClick={this.editBallot.bind(null, -1)}><i className="fa fa-calendar-check-o fa-5x"></i><br />Create ballot</button>
                <hr />
                {form}
                {ballotList}
            </div>
        );
    }

});

var BallotListRow = React.createClass({
    mixins : ['Panel'],

    getInitialState: function() {
        return {
            showTicketForm : false
        };
    },

    getDefaultProps: function() {
        return {
            endDateFormatted : '',
            startDateFormatted : '',
            title : '',
            id : 0,
            handleEdit : null
        };
    },

    setShowTicketForm : function(ticket) {
        this.setState({
            showTicketForm : ticket
        });
    },

    handleDelete : function(event) {
        if (confirm('Are you sure you want to delete this ballot?')) {
            $.post('election/Admin/Single', {
                command : 'delete',
                ballotId : this.props.id,
            }, null, 'json')
            	.done(function(data){
                    this.props.reload();
            	}.bind(this));
        }
    },

    render: function() {
        var heading = (
            <div>
                <div className="change-buttons">
                    <button className="btn btn-success" data-vid={this.props.id}
                        onClick={this.setShowTicketForm.bind(null, true)} title="Add ticket"><i className="fa fa-ticket"></i> Add ticket</button>
                    <button className="btn btn-primary" data-vid={this.props.id}
                        onClick={this.props.handleEdit} title="Edit ballot"><i className="fa fa-edit"></i> Edit</button>
                    <button className="btn btn-danger" onClick={this.handleDelete}>
                        <i className="fa fa-trash-o" title="Remove ballot"></i> Delete</button>
                </div>
                <h2>{this.props.title}</h2>
                <h4>Vote: <span className="text-info date-stamp">{this.props.startDateFormatted}</span> to <span className="text-info date-stamp">{this.props.endDateFormatted}</span></h4>
            </div>);
        var body = (
            <div>
                <Tickets ballotId={this.props.id} showTicketForm={this.state.showTicketForm} removeForm={this.setShowTicketForm.bind(null, false)}/>
            </div>);
        return (
            <Panel heading={heading} body={body} />
        );
    }

});

var SingleBallotForm = React.createClass({

    getInitialState: function() {
        return {
            ballotId : 0,
            title : '',
            startDate : '',
            endDate : '',
            unixStart : 0,
            unixEnd : 0
        }
    },

    getDefaultProps: function() {
        return {
            id : 0,
            title: '',
            startDate : '',
            endDate : '',
            hideForm : null
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
            unixEnd : this.props.endDate
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
            $(this.refs.ballotTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }

        if (this.state.startDate.length === 0) {
            $(this.refs.startDate).css('borderColor', 'red').attr('placeholder', 'Please enter a start date');
            error = true;
        } else if (this.state.unixStart > this.state.unixEnd) {
            $(this.refs.endDate).css('borderColor', 'red').attr('placeholder', 'End date must be greater').val('');
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

    save : function() {
        var error = this.checkForErrors();
        if (error === false) {
            $.post('election/Admin/Single', {
            	command : 'save',
                ballotId : this.state.ballotId,
                title : this.state.title,
                startDate : this.state.unixStart,
                endDate: this.state.unixEnd
            }, null, 'json')
            	.done(function(data){
                    this.props.reload();
            	}.bind(this))
                .always(function(){
                    this.props.hideForm();
                }.bind(this));

        }
    },

    resetBorder : function(node) {
        $(node.target).removeAttr('style');
    },

    render: function() {
        var heading = (
            <input ref="ballotTitle" type="text" className="form-control" defaultValue={this.props.title}
                id="ballot-title" onFocus={this.resetBorder} onChange={this.updateTitle} placeholder='Ballot title' />
        );

        var body = (
            <div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="start-date" className="control-label pad-right">Start voting:</label>
                            <div className="input-group">
                                <input ref="startDate" type="text" className="form-control datepicker" id="start-date" onFocus={this.resetBorder} onChange={this.changeStartDate}/>
                                <div className="input-group-addon">
                                    <i className="fa fa-calendar" onClick={this.showStartCalendar}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="end-date" className="control-label pad-right">End voting:</label>
                            <div className="input-group">
                                <input ref="endDate" type="text" className="form-control datepicker" id="end-date" onFocus={this.resetBorder} onChange={this.changeEndDate}/>
                                <div className="input-group-addon">
                                    <i className="fa fa-calendar" onClick={this.showEndCalendar}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <button className="btn btn-primary pad-right" onClick={this.save}><i className="fa fa-save"></i> Save ballot</button>
                <button className="btn btn-danger" onClick={this.props.hideForm}><i className="fa fa-times"></i> Cancel</button>
            </div>
        );

        return (
            <Panel heading={heading} body={body} />
        );
    }
});


ReactDOM.render(<SingleBallot/>, document.getElementById('single-ballot'));
