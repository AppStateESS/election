'use strict';

import React from 'react';
import Panel from './Panel.jsx'

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
                    <div><strong>Voting category:</strong> <CategoryTitle category={this.props.category}/></div>
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
    return (
        <span>
            {categoryTypes[props.category]}
        </span>
    );
}

var MultipleForm = React.createClass({
    getInitialState: function() {
        return {
            title : '',
            seatNumber : '2',
            category : ''
        }
    },

    getDefaultProps: function() {
        return {
            multipleId : 0,
            electionId : 0,
            title: '',
            seatNumber : '2',
            category : '',
            hideForm : null,
            reload : null
        };
    },

    componentWillMount: function() {
        if (this.props.id) {
            this.copyPropsToState();
        }
    },

    componentDidMount: function() {
        if (!this.state.category.length) {
            this.setState({
                category : electionTypes.electionTypes[0]['subcategory'][0].type
            });
        }
    },

    copyPropsToState: function() {
        this.setState({
            title : this.props.title,
            seatNumber : this.props.seatNumber,
            category : this.props.category
        });
    },

    updateTitle : function(e) {
        this.setState({
            title : e.target.value
        });
    },

    updateSeatNumber : function(e) {
        var seatNumber = e.target.value;
        if (seatNumber < 1) {
            e.target.value = '1';
            return;
        }
        this.setState({
            seatNumber : e.target.value
        });
    },

    updateCategory : function(e) {
        this.setState({
            category : e.target.value
        });
    },

    checkForErrors : function() {
        var error = false;
        if (this.state.title.length === 0) {
            $(this.refs.multipleTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }
        if (this.state.seatNumber < 1) {
            error = true;
        }

        return error;
    },

    save : function() {
        var error = this.checkForErrors();
        if (error === false) {
            $.post('election/Admin/Multiple', {
            	command : 'save',
                multipleId : this.props.multipleId,
                electionId : this.props.electionId,
                title : this.state.title,
                seatNumber : this.state.seatNumber,
                category : this.state.category
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
            <div className="row">
                <div className="col-sm-9">
                    <div className="row">
                        <div className="col-sm-12">
                            <label>Ballot title (e.g. Sophomore Senate)</label>
                            <input ref="multipleTitle" type="text" className="form-control"
                                defaultValue={this.props.title} id="multiple-title" min="2"
                                onFocus={this.resetBorder} onChange={this.updateTitle}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <label>Available seats</label>
                            <input ref="seatNumber" type="number" className="form-control"
                                onChange={this.updateSeatNumber}
                                defaultValue={this.props.seatNumber}/>
                        </div>
                        <div className="col-sm-8">
                            <label>Filter</label>
                            <CategoryList default={this.state.category} handleChange={this.updateCategory}/>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3">
                    <div>
                        <button className="btn btn-block btn-primary" onClick={this.save}><i className="fa fa-save"></i> Save</button>
                        <button className="btn btn-block btn-danger" onClick={this.props.hideForm}><i className="fa fa-times"></i> Cancel</button>
                    </div>
                </div>
            </div>
        );

        return (
            <Panel type="success" heading={heading} />
        );
    }

});

var CategoryList = React.createClass({

    getDefaultProps: function() {
        return {
            default : '',
            handleChange : null
        };
    },

    render: function() {
        var options = electionTypes.electionTypes.map(function(value, key){
            return (
                <CategoryOption key={key} category={value.category} subcategory={value.subcategory}/>
            );
        });
        return (
            <select className="form-control" defaultValue={this.props.defValue} onChange={this.props.handleChange} value={this.props.default}>
                {options}
            </select>
        );
    }
});

var CategoryOption = React.createClass({

    getDefaultProps: function() {
        return {
            category : '',
            subcategory : []
        };
    },

    render: function() {
        var suboptions = this.props.subcategory.map(function(value, key){
            return <option key={key} value={value.type}>{value.name}</option>;
        }.bind(this));
        return <optgroup label={this.props.category}>{suboptions}</optgroup>;
    }

});
export default Multiple;
