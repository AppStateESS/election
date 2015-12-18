var SingleBallot = React.createClass({
    mixins : ['Modal'],

    getInitialState: function() {
        return {
            ballotList : []
        };
    },

    getDefaultProps: function() {
        return {
        };
    },

    componentDidMount: function() {
        this.load();
    },

    showModal : function() {
        $('#single-modal').modal('show');
    },

    hideModal : function() {
        $('#single-modal').modal('hide');
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
        var modalForm = <SingleBallotForm reload={this.load} hideModal={this.hideModal}/>

        return (
            <div>
                <button className="btn btn-success" onClick={this.showModal}><i className="fa fa-plus"></i> Create ballot</button>
                <hr />
                <div className="modal-box"><Modal title="Create Ballot" modalId="single-modal" body={modalForm}/></div>
                <div className='election-list'>
                    <BalloutList listing={this.state.ballotList}/>
                </div>
            </div>
        );
    }

});

var BalloutList = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            listing : []
        };
    },

    render: function() {
        var ballotList = this.props.listing.map(function(value){
            return <BallotListRow key={value.id} {...value}/>
        });

        return (
            <div>
                {ballotList}
            </div>
        );
    }

});

var BallotListRow = React.createClass({
    getDefaultProps: function() {
        return {
            end_date_formatted : '',
            start_date_formatted : '',
            title : '',
            id : 0,
        };
    },

    render: function() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <div className="change-buttons">
                        <button className="btn btn-primary"><i className="fa fa-edit"></i></button>
                        <button className="btn btn-danger"><i className="fa fa-times"></i></button>
                    </div>
                    <h3>{this.props.title}</h3>
                </div>
                <div className="panel-body">
                    <h4>Voting period: <span className="text-info date-stamp">{this.props.start_date_formatted}</span> to <span className="text-info date-stamp">{this.props.end_date_formatted}</span></h4>
                    <button className="btn btn-default"><i className="fa fa-ticket"></i> Add Ticket</button>
                </div>
            </div>
        );
    }

});

var SingleBallotForm = React.createClass({

    getInitialState: function() {
        return {
            ballotId : 0,
            title : '',
            startDate : '',
            endDate : ''
        }
    },

    getDefaultProps: function() {
        return {
        };
    },

    componentDidMount: function() {
        this.initStartDate();
        this.initEndDate();
    },

    initStartDate : function() {
        $('#start-date').datetimepicker({
            minDate:0,
            onChangeDateTime : function(ct, i) {
                this.setState({
                    startDate : this.refs.startDate.value
                });
            }.bind(this)
        });
    },

    initEndDate : function() {
        $('#end-date').datetimepicker({
            minDate:0,
            onChangeDateTime : function(ct, i) {
                this.setState({
                    endDate : this.refs.endDate.value
                });
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

    updateStartDate : function(e) {
        this.setState({
            startDate : e.target.value
        });
    },

    updateEndDate : function(e) {
        this.setState({
            endDate : e.target.value
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
        } else if (this.state.startDate > this.state.endDate) {
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
                startDate : this.state.startDate,
                endDate: this.state.endDate
            }, null, 'json')
            	.done(function(data){
                    this.props.reload();
            	}.bind(this))
                .always(function(){
                    this.props.hideModal();
                }.bind(this));

        }
    },

    resetBorder : function(node) {
        $(node.target).removeAttr('style');
    },

    render: function() {
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="ballot-title" className="control-label">Title:</label>
                    <input ref="ballotTitle" type="text" className="form-control" id="ballot-title" onFocus={this.resetBorder} onChange={this.updateTitle}/>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-inline">
                            <div className="form-group">
                                <label htmlFor="start-date" className="control-label">Start voting:</label>
                                <div className="input-group">
                                    <input ref="startDate" type="text" className="form-control datepicker" id="start-date"  onFocus={this.resetBorder} onChange={this.updateStartDate}/>
                                    <div className="input-group-addon">
                                        <i className="fa fa-calendar" onClick={this.showStartCalendar}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-inline">
                            <div className="form-group">
                                <label htmlFor="end-date" className="control-label">End voting:</label>
                                <div className="input-group">
                                    <input ref="endDate" type="text" className="form-control datepicker" id="end-date" onFocus={this.resetBorder} onChange={this.updateEndDate}/>
                                    <div className="input-group-addon">
                                        <i className="fa fa-calendar" onClick={this.showEndCalendar}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="pull-right">
                    <button type="button" className="btn btn-danger" data-dismiss="modal"><i className="fa fa-times"></i> Cancel</button>&nbsp;
                    <button type="button" className="btn btn-primary" onClick={this.save}><i className="fa fa-save"></i> Save</button>
                </div>
                <div className="clearfix"></div>
            </form>
        );
    }
});


ReactDOM.render(<SingleBallot/>, document.getElementById('single-ballot'));
