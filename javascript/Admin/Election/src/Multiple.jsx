'use strict';

import React from 'react';
import Panel from '../../../Mixin/src/Panel.jsx';
import MultipleForm from './MultipleForm.jsx';
import Candidates from './Candidate.jsx';
import {categoryTypes} from './types.js';

var Multiple = React.createClass({
    getInitialState: function() {
        return {
            multipleList : [],
            itemCount : 0,
            panelOpen : false,
            showForm : false,
            categoryList : []
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
        $.getJSON('election/Admin/Multiple', {
        	command : 'list',
            electionId : this.props.electionId
        }).done(function(data){
            this.setState({
                itemCount: data.length,
                multipleList : data
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
                    <h4>Multiple chair - {this.state.itemCount} ballot{this.state.itemCount !== 1 ? 's' : null}</h4>
                </div>
                <div className="col-sm-3">
                    <button className="btn btn-block btn-primary" onClick={this.showForm} disabled={!allowChange}>
                        <i className="fa fa-plus"></i> New ballot</button>
                </div>
            </div>
        );
        if (this.state.panelOpen) {
            var form  = null;
            if (this.state.showForm) {
                form = <MultipleForm electionId={this.props.electionId} reload={this.load} hideForm={this.hideForm}/>;
            }
            var body = (
                <div>
                    {form}
                    <MultipleList electionId={this.props.electionId} reload={this.load} listing={this.state.multipleList}/>
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

var MultipleList = React.createClass({
    getInitialState : function() {
        return {
            currentEdit : -1,
            openMultiple : 0
        };
    },

    getDefaultProps: function() {
        return {
            listing : [],
            reload : null,
            electionId : 0
        };
    },

    editRow : function(multipleId) {
        this.setState({
            currentEdit : multipleId
        });
    },

    openMultiple: function(multipleId) {
        if (multipleId === this.state.openMultiple) {
            multipleId = 0;
        }

        this.setState({
            openMultiple : multipleId
        });
    },

    render: function() {
        var multipleList = (
            <div>
                <h3>No multiple chair ballots found.</h3>
            </div>
        );

        var shared = {
            electionId : this.props.electionId,
            reload : this.props.reload,
            hideForm : this.editRow.bind(null, -1),
            openMultiple : this.openMultiple
        };

        var multipleList = this.props.listing.map(function(value){
            if (value.id === this.state.currentEdit) {
                return <MultipleForm key={value.id} {...value}
                        multipleId={value.id} {...shared}/>;
            } else {
                return <MultipleListRow key={value.id} {...value}
                    isOpen={this.state.openMultiple === value.id}
                    multipleId={value.id} edit={this.editRow.bind(null, value.id)}
                        {...shared}/>
            }
        }.bind(this));

        return (
            <div>
                <div className="pad-top">
                    {multipleList}
                </div>
            </div>
        );
    }

});

var MultipleListRow = React.createClass({
    mixins : ['Panel'],

    getDefaultProps: function() {
        return {
            electionId : 0,
            reload : null,
            hideForm : null,
            multipleId : 0,
            title : '',
            seatNumber : 0,
            category : '',
            isOpen : true
        };
    },

    getInitialState: function() {
        return {
            formId : -1,
            candidates : [],
            candidateCount : 0
        };
    },

    componentDidMount: function() {
        this.load();
    },

    load : function() {
        $.getJSON('election/Admin/Candidate', {
        	command : 'candidateList',
            multipleId : this.props.multipleId
        }).done(function(data){
            this.setState({
                candidates : data,
                candidateCount : data.length
            });

        }.bind(this));
    },

    toggleExpand: function() {
        this.props.openMultiple(this.props.multipleId);
    },

    handleDelete : function(event) {
        if (confirm('Are you sure you want to delete this ballot?')) {
            $.post('election/Admin/Multiple', {
                command : 'delete',
                ballotId : this.props.id,
            }, null, 'json')
            	.done(function(data){
                    this.props.reload();
            	}.bind(this))
                .fail(function(data){
                    alert('Unable to delete multiple ballot');
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
                <div className="col-sm-9">
                    <div className="ballot-title">{this.props.title}&nbsp;-&nbsp;
                        {this.state.candidateCount} candidate{this.state.candidateCount !== 1 ? 's' : null}
                    </div>
                    <div><strong>Available seats:</strong> {this.props.seatNumber}</div>
                    <div><strong>Voting categor{(this.props.category.indexOf(',') != -1) ? 'ies' : 'y'}:</strong> <CategoryTitle category={this.props.category}/></div>
                </div>
                <div className="col-sm-3">
                    <button className="btn btn-success btn-block" onClick={this.edit} title="Edit ballot">
                        <i className="fa fa-edit"></i> Edit</button>
                    <button disabled={!allowChange} className="btn btn-danger btn-block" onClick={this.handleDelete}>
                        <i className="fa fa-trash-o" title="Remove ballot"></i> Delete</button>
                </div>
            </div>
        );

        if (this.props.isOpen) {
            var body = (
                <Candidates type="multiple" electionId={this.props.electionId} multipleId={this.props.multipleId}
                    candidates={this.state.candidates} reload={this.load}/>
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

var CategoryTitle = function(props) {
    let category = props.category.split(',');
    let listing = '';
    listing += category.map(function(value,key){
        return ' ' + categoryTypes[value];
    });
    return (
        <span>
            {listing}
        </span>
    );
}

export default Multiple;
