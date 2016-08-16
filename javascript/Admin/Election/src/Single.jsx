'use strict';
import React from 'react';
import Panel from '../../../Mixin/src/Panel.jsx';
import Tickets from './Ticket.jsx';

module.exports = React.createClass({
    getInitialState: function() {
        return {
            singleList : [],
            itemCount : 0,
            showForm : false,
            panelOpen : true
        };
    },

    getDefaultProps: function() {
        return {
            electionId : 0
        };
    },

    componentDidMount: function() {
        this.load();
    },

    load : function() {
        $.getJSON('election/Admin/Single', {
        	command : 'list',
            electionId : this.props.electionId
        }).done(function(data){
            this.setState({
                itemCount : data.length,
                singleList : data
            });
        }.bind(this));
    },

    toggleExpand: function() {
        this.setState({
            panelOpen : !this.state.panelOpen
        });
    },

    showForm : function(e) {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            panelOpen : true,
            showForm : true
        });
    },

    hideForm : function() {
        this.setState({
            showForm : false
        });
    },

    render: function() {
        var heading = (
            <div className="row">
                <div className="col-sm-9">
                    <h4>Single chair - {this.state.itemCount} ballot{this.state.itemCount !== 1 ? 's' : null}</h4>
                </div>
                <div className="col-sm-3">
                    <button className="btn btn-block btn-primary" disabled={!allowChange} onClick={this.showForm}>
                        <i className="fa fa-plus"></i> New ballot</button>
                </div>
            </div>
        );
        if (this.state.panelOpen) {
            var form  = null;
            if (this.state.showForm) {
                form = <SingleBallotForm electionId={this.props.electionId} reload={this.load} hideForm={this.hideForm}/>;
            }
            var body = (
                <div>
                    {form}
                    <SingleList electionId={this.props.electionId} reload={this.load} hideForm={this.hideForm} listing={this.state.singleList}/>
                </div>
            );
            var arrow = <i className="fa fa-chevron-up"></i>;
        } else {
            var body = null;
            var arrow = <i className="fa fa-chevron-down"></i>;
        }

        var footer = (<div className="text-center pointer" onClick={this.toggleExpand}>{arrow}</div>);

        return (
            <Panel type="info" heading={heading} body={body} footer={footer}
                headerClick={this.toggleExpand} footerClick={this.toggleExpand}/>
        );
    }

});

var SingleList = React.createClass({
    getInitialState : function() {
        return {
            currentEdit : -1,
            openSingle : 0
        };
    },

    getDefaultProps: function() {
        return {
            listing : [],
            reload : null,
            electionId : 0
        };
    },

    setCurrentEdit : function(singleId) {
        this.props.hideForm();
        this.setState({
            currentEdit : singleId
        });
    },

    openSingle: function(singleId) {
        if (singleId === this.state.openSingle) {
            singleId = 0;
        }

        this.setState({
            openSingle : singleId
        });
    },

    componentDidUpdate: function(prevProps, prevState) {
    },

    render: function() {
        var singleList = (
            <div>
                <h3>No single ballots found.</h3>
            </div>
        );

        var shared = {
            electionId : this.props.electionId,
            reload : this.props.reload,
            hideForm : this.setCurrentEdit.bind(null, -1),
            openSingle : this.openSingle
        };

        var singleList = this.props.listing.map(function(value){
            if (value.id === this.state.currentEdit) {
                return <SingleBallotForm key={value.id} {...value}
                        singleId={value.id} {...shared}/>;
            } else {
                return <SingleListRow key={value.id} {...value}
                        isOpen={this.state.openSingle === value.id}
                        singleId={value.id} edit={this.setCurrentEdit.bind(null, value.id)}
                        {...shared}/>
            }
        }.bind(this));

        return (
            <div>
                <div className="pad-top">
                    {singleList}
                </div>
            </div>
        );
    }

});

var SingleListRow = React.createClass({
    mixins : ['Panel'],

    getDefaultProps: function() {
        return {
            electionId : 0,
            reload : null,
            hideForm : null,
            singleId : 0,
            title : '',
            isOpen : true
        };
    },

    getInitialState: function() {
        return {
            formId : -1,
            tickets : [],
            ticketCount : 0
        };
    },

    componentDidMount: function() {
        this.load();
    },

    load : function() {
        $.getJSON('election/Admin/Ticket', {
        	command : 'list',
            singleId : this.props.singleId
        }).done(function(data){
            this.setState({
                tickets : data,
                ticketCount : data.length
            });

        }.bind(this));
    },

    toggleExpand: function() {
        this.props.openSingle(this.props.singleId);
    },

    handleDelete : function(event) {
        if (confirm('Are you sure you want to delete this ballot?')) {
            $.post('election/Admin/Single', {
                command : 'delete',
                singleId : this.props.id,
            }, null, 'json')
            	.done(function(data){
                    this.props.reload();
            	}.bind(this))
                .fail(function(data){
                    alert('Unable to delete ballot.');
                    this.props.reload();
                }.bind(this));
        }
    },

    edit : function(e) {
        e.stopPropagation();
        this.props.edit();
    },

    render: function() {
        var heading = (
            <div className="row">
                <div className="col-sm-6">
                    <div className="ballot-title">{this.props.title}&nbsp;-&nbsp;
                        {this.state.ticketCount} ticket{this.state.ticketCount !== 1 ? 's' : null}
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="pull-right">
                        <button className="btn btn-success pad-right" onClick={this.edit} title="Edit ballot">
                            <i className="fa fa-edit"></i> Edit</button>
                        <button disabled={!allowChange} className="btn btn-danger" onClick={this.handleDelete}>
                            <i className="fa fa-trash-o" title="Remove ballot"></i> Delete</button>
                    </div>
                </div>
            </div>
        );

        if (this.props.isOpen) {
            var body = (
                <div>
                    <Tickets singleId={this.props.singleId} tickets={this.state.tickets} load={this.load}/>
                </div>
            );
            var arrow = <i className="fa fa-chevron-up"></i>;
        } else {
            var body = null;
            var arrow = <i className="fa fa-chevron-down"></i>;
        }

        var footer = (<div className="text-center pointer">{arrow}</div>);

        return (<Panel type="success" heading={heading}
             body={body} footer={footer}
             footerClick={this.toggleExpand}
             headerClick={this.toggleExpand}/>
        );

    }

});

var SingleBallotForm = React.createClass({

    getInitialState: function() {
        return {
            title : '',
        }
    },

    getDefaultProps: function() {
        return {
            singleId : 0,
            electionId : 0,
            title: '',
            hideForm : null,
            reload : null
        };
    },

    componentWillMount: function() {
        if (this.props.id) {
            this.copyPropsToState();
        }
    },

    copyPropsToState: function() {
        this.setState({
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
                singleId : this.props.singleId,
                electionId : this.props.electionId,
                title : this.state.title,
            }, null, 'json')
            	.done(function(data){
                    this.props.reload();
            	}.bind(this))
                .fail(function(){
                    alert('Could not save single chair ballot');
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
            <div className="row">
                <div className="col-sm-8">
                    <input ref="singleTitle" type="text" className="form-control"
                        defaultValue={this.props.title} id="single-title"
                        onFocus={this.resetBorder} onChange={this.updateTitle}
                        placeholder='Ballot title (e.g. President/Vice President)' />
                </div>
                <div className="col-sm-4">
                    <div className="pull-right">
                        <button className="btn btn-primary pad-right" onClick={this.save}><i className="fa fa-save"></i> Save</button>
                        <button className="btn btn-danger" onClick={this.props.hideForm}><i className="fa fa-times"></i> Cancel</button>
                    </div>
                </div>
            </div>
        );

        return (
            <Panel type="success" heading={heading} />
        );
    }
});
