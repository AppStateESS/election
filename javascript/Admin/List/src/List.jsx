'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '../../../Mixin/src/Modal.jsx';
import Panel from '../../../Mixin/src/Panel.jsx';
import DateMixin from '../../../Mixin/src/Date.jsx';

var ElectionList = React.createClass({
    getInitialState: function() {
        return {
            elections: [],
            showForm: false,
            currentElectionId: 0,
            studentFound: null,
            foundName: null,
            resetOpen: false,
            currentStudent: 0,
            message: null,
        };
    },

    componentDidMount: function() {
        this.load();
    },

    load: function() {
        $.getJSON('election/Admin/Election', {command: 'list'}).done(function(data) {
            this.setState({elections: data});
        }.bind(this));
    },

    showForm: function() {
        this.setState({showForm: true});
    },

    hideForm: function() {
        this.setState({showForm: false});
    },

    closeModal: function() {
        $('#reactModal').modal('hide');
        this.setState({
            studentFound: null,
            foundName: null,
            currentElectionId: 0,
            currentStudent: 0,
            resetOpen: false,
            currentStudent: 0,
        });
    },

    showResetForm: function(electionId) {
        this.setState({currentElectionId: electionId, resetOpen: true,});
        $('#reactModal').modal('show');

    },

    searchVotes: function(searchFor) {
        $.getJSON('election/Admin/Election', {
            command: 'findVote',
            electionId: this.state.currentElectionId,
            searchFor: searchFor,
        }).done(function(data) {
            if (data === null) {
                this.setState({studentFound: false, foundName: null});
            } else {
                this.setState({studentFound: true, foundName: data['student'], currentStudent: searchFor})
            }
        }.bind(this));
    },

    resetVote: function() {
        $.post('election/Admin/Election', {
            command: 'resetVote',
            electionId: this.state.currentElectionId,
            bannerId: this.state.currentStudent,
        }).done(function(data) {
            this.setState({message: 'Vote reset'});
            this.closeModal();
            this.load();
        }.bind(this), 'json');
    },

    render: function() {
        let rows = this.state.elections.map(function(value, key) {
            return <ElectionRow
                key={key}
                {...value}
                hideForm={this.hideForm}
                reload={this.load}
                showResetForm={this.showResetForm}/>;
        }.bind(this));
        let form = <button className="btn btn-success" onClick={this.showForm}>
            <i className="fa fa-plus"></i>&nbsp; Add Election
        </button>;
        if (this.state.showForm) {
            form = <ElectionForm hideForm={this.hideForm} load={this.load}/>;
        }

        let message = null;
        if (this.state.message != null) {
            message = <div className="alert alert-success">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                {this.state.message}
            </div>;
            setTimeout(function() {
                this.setState({message: null});
            }.bind(this), 4000);
        }

        let modalBody = (<ResetForm
            searchVotes={this.searchVotes}
            studentFound={this.state.studentFound}
            foundName={this.state.foundName}
            resetOpen={this.state.resetOpen}
            resetVote={this.resetVote}/>);
        let modal = <Modal body={modalBody} header='Reset student vote' onClose={this.closeModal}/>;
        return (
            <div>
                {message}
                {form}
                {modal}
                <table className="table table-striped pad-top">
                    <tbody>
                        <tr>
                            <th>Title</th>
                            <th>Date range</th>
                            <th>Total votes</th>
                            <th>&nbsp;</th>
                        </tr>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    },
});

var ResetForm = React.createClass({
    getInitialState: function() {
        return {search: '', checking: false,}
    },

    getDefaultProps: function() {
        return {searchVotes: null, studentFound: null, studentName: null, resetOpen: false, resetVote: null};
    },

    updateSearch: function(event) {
        let value = event.target.value.replace(/[^\d]/, '');
        this.setState({search: value});
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.studentFound != null) {
            this.setState({checking: false});
        }
        if (nextProps.resetOpen == false) {
            this.setState({search: ''});
        }
    },

    sendSearch: function() {
        this.setState({checking: true});
        this.props.searchVotes(this.state.search);
    },

    render: function() {
        let message = null;
        if (this.state.checking) {
            message = (
                <div className="alert alert-default">
                    <i className="fa fa-spinner fa-spin fa-2x fa-fw"></i>Searching for vote...</div>
            );
        } else if (this.props.studentFound == false) {
            message = <div className="alert alert-warning">Vote banner id not found</div>;
        } else if (this.props.studentFound == true) {
            message = (
                <div className="alert alert-danger">
                    Are you sure you want to reset&nbsp;<strong>{this.props.foundName}'s</strong>&nbsp;vote?&nbsp;
                    <button className="btn btn-success" onClick={this.props.resetVote}>
                        <i className="fa fa-check"></i>&nbsp;Yes</button>&nbsp;
                    <button className="btn btn-warning" data-dismiss="modal">
                        <i className="fa fa-times"></i>&nbsp;No</button>
                </div>
            );
        }
        return (
            <div>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter student banner id"
                        onChange={this.updateSearch}
                        value={this.state.search}/>
                    <span className="input-group-btn">
                        <button className="btn btn-success" type="button" onClick={this.sendSearch}>Search</button>
                    </span>

                </div>
                <div>{message}</div>
            </div>
        );
    },
});

var ElectionRow = React.createClass({

    getDefaultProps: function() {
        return {
            id: 0,
            title: '',
            startDateFormatted: '',
            endDateFormatted: '',
            totalVotes: 0,
            past: false,
            edit: false,
            reload: null,
            showResetForm: null
        };
    },

    delete: function() {
        if (prompt('Are you sure you want to delete this election? Type Y-E-S if sure.') == 'YES') {
            $.post('election/Admin/Election', {
                command: 'delete',
                electionId: this.props.id,
            }, null, 'json').done(function(data) {
                this.props.reload();
            }.bind(this));
        }
    },

    showForm: function() {
        this.props.showResetForm(this.props.id);
    },

    render: function() {
        var buttons = null;
        // admin defined in <head> by Admin/Election class.
        if (this.props.past && admin) {
            buttons = <button className="btn btn-danger" onClick={this.delete}>
                <i className="fa fa-trash-o"></i>&nbsp; Delete</button>;
        } else {
            var href = 'election/Admin/?command=edit&electionId=' + this.props.id;
            var buttons = (
                <span>
                    <a href={href} className="btn btn-primary btn-sm">
                        <i className="fa fa-edit"></i>&nbsp;Edit</a>&nbsp;
                    <button className="btn btn-warning btn-sm" onClick={this.showForm}>
                        <i className="fa fa-refresh"></i>&nbsp;Reset vote</button>
                </span>
            );
        }
        var reportHref = 'election/Admin/Report/?command=show&electionId=' + this.props.id;
        return (
            <tr>
                <td>{this.props.title}</td>
                <td>{this.props.startDateFormatted}&nbsp;-&nbsp;{this.props.endDateFormatted}</td>
                <td>{this.props.totalVotes}</td>
                <td>{buttons}&nbsp;
                    <a href={reportHref} className="btn btn-info btn-sm">
                        <i className="fa fa-envelope"></i>&nbsp;Report</a>
                </td>
            </tr>
        );
    },
});

class ElectionForm extends DateMixin {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            startDate: '',
            endDate: '',
            unixStart: 0,
            unixEnd: 0,
        };

    }

    componentDidMount() {
        this.initStartDate();
        this.initEndDate();
    }

    componentWillMount() {
        if (this.props.electionId) {
            this.copyPropsToState();
        }
    }

    copyPropsToState() {
        this.setState({
            title: this.props.title,
            startDate: this.props.startDateFormatted,
            endDate: this.props.endDateFormatted,
            unixStart: this.props.startDate,
            unixEnd: this.props.endDate,
        });
    }

    updateTitle(e) {
        this.setState({title: e.target.value});
    }

    checkForErrors() {
        var error = false;
        if (this.state.title.length === 0) {
            $(this.refs.electionTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }

        if (this.hasDateErrors()) {
            error = true;
        }

        return error;
    }

    save() {
        var error = this.checkForErrors();
        if (error === false) {
            var conflict = this.checkForConflict();
            conflict.done(function(data) {
                if (data.conflict === false) {
                    $.post('election/Admin/Election', {
                        command: 'save',
                        electionId: this.props.electionId,
                        title: this.state.title,
                        startDate: this.state.unixStart,
                        endDate: this.state.unixEnd,
                    }, null, 'json').done(function(data) {
                        this.props.load();
                    }.bind(this)).always(function() {
                        this.props.hideForm();
                    }.bind(this));
                } else {
                    $(this.refs.startDate).css('borderColor', 'red').attr('placeholder', 'Date conflict');
                    $(this.refs.endDate).css('borderColor', 'red').attr('placeholder', 'Date conflict');
                    this.setState({startDate: '', unixStart: 0, endDate: '', unixEnd: 0,});
                }
            }.bind(this));
        }
    }

    render() {
        var title = (<input
            ref="electionTitle"
            type="text"
            className="form-control"
            defaultValue={this.props.title}
            id="election-title"
            onFocus={this.resetBorder.bind(this)}
            onChange={this.updateTitle.bind(this)}
            placeholder='Title (e.g. Fall 2016 Election)'/>);
        var date = (
            <div className="row pad-top">
                <div className="col-sm-6">
                    <div className="input-group">
                        <input
                            placeholder="Voting start date and time"
                            ref="startDate"
                            type="text"
                            className="form-control datepicker"
                            id="start-date"
                            onFocus={this.resetBorder}
                            onChange={this.changeStartDate}
                            value={this.state.startDate}/>
                        <div className="input-group-addon">
                            <i className="fa fa-calendar" onClick={this.showStartCalendar.bind(this)}></i>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="input-group">
                        <input
                            placeholder="Voting deadline"
                            ref="endDate"
                            type="text"
                            className="form-control datepicker"
                            id="end-date"
                            onFocus={this.resetBorder}
                            onChange={this.changeEndDate}
                            value={this.state.endDate}/>
                        <div className="input-group-addon">
                            <i className="fa fa-calendar" onClick={this.showEndCalendar.bind(this)}></i>
                        </div>
                    </div>
                </div>
            </div>
        );
        var buttons = (
            <div>
                <button className="btn btn-primary btn-block" onClick={this.save.bind(this)}>
                    <i className="fa fa-save"></i>&nbsp;
                Save election</button>
                <button className="btn btn-danger btn-block" onClick={this.props.hideForm}>
                    <i className="fa fa-times"></i>&nbsp;
                Cancel</button>
            </div>
        );

        var heading = (
            <div className="row">
                <div className="col-sm-9">
                    {title}
                    {date}
                </div>
                <div className="col-sm-3">
                    {buttons}
                </div>
            </div>
        );

        return (<Panel type="info" heading={heading}/>);
    }
};
ElectionForm.defaultProps = {
    electionId: 0,
    title: '',
    startDate: '',
    endDate: '',
    hideForm: null,
}

ReactDOM.render(
    <ElectionList/>, document.getElementById('election-listing'));
