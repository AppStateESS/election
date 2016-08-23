import React from 'react';
import Panel from '../../../Mixin/src/Panel.jsx';
import {electionTypes} from './types.js';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

var MultipleForm = React.createClass({
    getInitialState: function() {
        return {
            title : '',
            seatNumber : '2',
            category : 'everyone'
        }
    },

    getDefaultProps: function() {
        return {
            multipleId : 0,
            electionId : 0,
            title: '',
            seatNumber : '2',
            category : 'everyone',
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

    updateCategory : function(value) {
        this.setState({
            category : value
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

        if (this.state.category == null || this.state.category.length == 0) {
            this.setState({category: 'everyone'});
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
        let otherOptions = [];
        electionTypes.electionTypes.map(function(value,key){
            value.subcategory.map(function(subval, subkey){
                otherOptions.push({
                    value: subval.type,
                    label: subval.matchName + ': ' + subval.name
                });
            });
        });
        return (
            <div>
                <Select multi={true} simpleValue={true} name="filter" options={otherOptions} value={this.props.default} onChange={this.props.handleChange}/>
            </div>
        );
    }
});

export default MultipleForm;
