import React from 'react';
import Panel from './Panel.jsx'

var Referendum = React.createClass({
    getInitialState: function() {
        return {
            referendumList : [],
            itemCount : 0,
            showForm : false,
            panelOpen : false
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
        $.getJSON('election/Admin/Referendum', {
        	command : 'list',
            electionId : this.props.electionId
        }).done(function(data){
            this.setState({
                itemCount: data.length,
                referendumList : data
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
                <div className="col-sm-8">
                    <h4>Referendum - {this.state.itemCount} measure{this.state.itemCount !== 1 ? 's' : null}</h4>
                </div>
                <div className="col-sm-4">
                    <button disabled={!allowChange} className="btn btn-block btn-primary" onClick={this.showForm}>
                        <i className="fa fa-plus"></i> New referendum</button>
                </div>
            </div>
        );

        if (this.state.panelOpen) {
            var form  = null;
            if (this.state.showForm) {
                form = <ReferendumForm electionId={this.props.electionId} reload={this.load} hideForm={this.hideForm}/>;
            }
            var body = (
                <div>
                    {form}
                    <ReferendumList electionId={this.props.electionId} reload={this.load}
                        listing={this.state.referendumList}/>
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

var ReferendumList = React.createClass({
    getInitialState: function() {
        return {
            currentEdit : -1,
            openReferendum : 0
        };
    },

    getDefaultProps: function() {
        return {
            listing : [],
            reload : null,
            electionId : 0
        };
    },

    editRow : function(id) {
        this.setState({
            currentEdit : id
        });
    },

    openReferendum: function(referendumId) {
        if (referendumId === this.state.openreferendum) {
            referendumId = 0;
        }

        this.setState({
            openReferendum : referendumId
        });
    },

    render: function() {
        var listing = (
            <div>
                <h3>No referendums found.</h3>
            </div>
        );

        var shared = {
            electionId : this.props.electionId,
            reload : this.props.reload,
            hideForm : this.editRow.bind(null, -1),
            openReferendum : this.openReferendum
        };

        var referendumList = this.props.listing.map(function(value){
            if (value.id === this.state.currentEdit) {
                return <ReferendumForm key={value.id} {...value}
                    referendumId={value.id} {...shared}/>;
            } else {
                return <ReferendumListRow key={value.id} {...value}
                    isOpen={this.state.openReferendum === value.id}
                    referendumId={value.id} edit={this.editRow.bind(null, value.id)}
                        {...shared}/>
            }
        }.bind(this));

        return (
            <div className="pad-top">
                {referendumList}
            </div>
        );
    }
});

var ReferendumForm = React.createClass({
    getInitialState: function() {
        return {
            title : '',
            description: ''
        };
    },

    getDefaultProps: function() {
        return {
            referendumId : 0,
            electionId : 0,
            title : '',
            description : '',
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
            description : this.props.description
        });
    },

    updateTitle : function(e) {
        this.setState({
            title : e.target.value
        });
    },

    updateDescription : function(e) {
        this.setState({
            description : e.target.value
        });
    },

    checkForErrors : function() {
        var error = false;
        if (!this.state.title.length) {
            $(this.refs.referendumTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }

        if (!this.state.description.length) {
            $(this.refs.referendumDescription).css('borderColor', 'red').attr('placeholder', 'Please enter a description');
            error = true;
        }

        return error;
    },

    save : function() {
        var error = this.checkForErrors();
        if (error === false) {
            $.post('election/Admin/Referendum', {
            	command : 'save',
                electionId : this.props.electionId,
                referendumId : this.props.referendumId,
                title : this.state.title,
                description : this.state.description
            }, null, 'json')
            	.done(function(data){
                    this.props.reload();
            	}.bind(this))
                .always(function(){
                    this.props.hideForm();
                }.bind(this))
                .fail(function(data){
                    alert('Cannot save referendum');
                }.bind(this));
        }
    },

    resetBorder : function(node) {
        $(node.target).removeAttr('style');
    },

    render: function() {
        var heading = (
            <div>
                <input ref="referendumTitle" type="text" className="form-control"
                    defaultValue={this.props.title} id="referendum-title"
                    onFocus={this.resetBorder} onChange={this.updateTitle}
                    placeholder="Title of referendum"/>
            </div>
        );

        var body = (
            <div>
                <div>
                    <textarea ref="referendumDescription" className="form-control"
                        defaultValue={this.props.description} id="referendum-description"
                        onFocus={this.resetBorder} onChange={this.updateDescription}
                        placeholder="Description of referendum"/>
                </div>
                <div className="pad-top">
                    <button className="btn btn-primary pull-left pad-right" onClick={this.save}><i className="fa fa-save"></i> Save</button>
                    <button className="btn btn-danger" onClick={this.props.hideForm}><i className="fa fa-times"></i> Cancel</button>
                </div>
            </div>
        );

        return (
            <Panel type="success" heading={heading} body={body}/>
        );
    }

});

var ReferendumListRow = React.createClass({
    mixins : ['Panel'],

    getInitialState: function() {
        return {
            formId : -1,
        };
    },

    getDefaultProps: function() {
        return {
            electionId : 0,
            reload : null,
            hideForm : null,
            referendumId : 0,
            title : '',
            description : '',
            isOpen : true,
            edit : null,
            openReferendum : null
        };
    },

    deleteReferendum : function() {
        if (confirm('Are you sure you want to delete this referendum?')) {
            $.post('election/Admin/Referendum', {
            	command : 'delete',
                referendumId : this.props.referendumId
            }, null, 'json')
            	.done(function(data){
            		this.props.reload();
            	}.bind(this))
                .fail(function(data){
                    alert('Cannot delete referendum');
                    this.props.reload();
                }.bind(this));

        }
    },

    render: function() {
        var heading = (
            <div className="row">
                <div className="col-sm-8">
                    <h3>{this.props.title}</h3>
                </div>
                <div className="col-sm-4 text-right">
                    <button className="btn btn-success pad-right" onClick={this.props.edit}>
                        <i className="fa fa-edit"></i> Edit
                    </button>
                    <button disabled={!allowChange} className="btn btn-danger" onClick={this.deleteReferendum}>
                        <i className="fa fa-trash-o"></i> Delete
                    </button>
                </div>
            </div>
        );

        var body = (
            <p>{this.props.description.split("\n").map(function(item, i){
                    return (
                        <span key={i}>{item}
                            <br />
                        </span>
                    );
                })}
            </p>
        );
        return (<Panel type="success" heading={heading}
             body={body}/>
        );
    }

});
export default Referendum;
