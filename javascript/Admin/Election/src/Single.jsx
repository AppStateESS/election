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
        }
    },

    getDefaultProps: function() {
        return {
            id : 0,
            title: '',
            hideForm : null
        };
    },

    componentWillMount: function() {
        if (this.props.id) {
            this.copyPropsToState();
        }
    },

    copyPropsToState: function() {
        this.setState({
            ballotId : this.props.id,
            title : this.props.title,
        });
    },

    updateTitle : function(e) {
        this.setState({
            title : e.target.value
        });
    },

    checkForErrors : function() {
        var error = false;
        if (this.state.title.length === 0) {
            $(this.refs.ballotTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
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
            <div>Body goes here</div>
        );

        return (
            <Panel heading={heading} body={body} />
        );
    }
});