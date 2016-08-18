import React from 'react';
import ReactDOM from 'react-dom';

var Multiple = React.createClass({
    getDefaultProps: function() {
        return {
            election: {},
            updateVote: null,
            vote: [],
            ballot: {},
            unqualified: [],
            supportLink: null
        };
    },

    render: function() {
        if (Object.keys(this.props.ballot).length == 0) {
            return <EmptyMultiple
                unqualified={this.props.unqualified}
                update={this.props.updateVote}/>;
        }
        return <MultipleBallot
            multipleId={this.props.ballot.id}
            {...this.props.ballot}
            updateVote={this.props.updateVote}
            vote={this.props.vote}
            unqualified={this.props.unqualified}
            supportLink={this.props.supportLink}/>;
    }
});

var EmptyMultiple = React.createClass({
    getDefaultProps: function() {
        return {unqualified: []};
    },

    render: function() {
        return (
            <div>
                <h2>No senate seats to vote on</h2>
                <Unqualified
                    unqualified={this.props.unqualified}
                    supportLink={this.props.supportLink}/>
                <button
                    className="pull-right btn btn-success btn-lg"
                    onClick={this.props.update}>Continue&nbsp;
                    <i className="fa fa-arrow-right"></i>
                </button>
            </div>
        );
    }
});

var MultipleBallot = React.createClass({
    getInitialState: function() {
        return {selectedRows: [], totalSelected: 0};
    },

    getDefaultProps: function() {
        return {
            updateVote: null,
            seatNumber: 2,
            title: null,
            candidates: [],
            vote: null,
            multipleId: 0,
            supportLink: null
        };
    },

    select: function(candidateId) {
        var selectedRows = this.state.selectedRows;
        var found = $.inArray(candidateId, selectedRows);
        var totalSelected = this.state.totalSelected;
        var totalSeats = this.props.seatNumber * 1;

        if (found === -1) {
            if (totalSelected !== totalSeats) {
                totalSelected++;
                selectedRows.push(candidateId);
            }
        } else {
            if (totalSelected > 0) {
                totalSelected--;
            }
            selectedRows.splice(found, 1);
        }

        this.setState({selectedRows: selectedRows, totalSelected: totalSelected});
    },

    saveVotes: function() {
        this.props.updateVote(this.state.selectedRows);
        this.setState({selectedRows: [], totalSelected: 0});
    },

    render: function() {
        var seatNumber = this.props.seatNumber * 1;
        var candidates = this.props.candidates.map(function(value) {
            if ($.inArray(value.id, this.state.selectedRows) !== -1) {
                var selected = true;
            } else {
                var selected = false;
            }
            return (<MultipleCandidate
                key={value.id}
                {...value}
                selected={selected}
                select={this.select.bind(null, value.id)}/>);
        }.bind(this));

        if (this.state.totalSelected > 0) {
            var button = <button className="pull-right btn btn-success btn-lg" onClick={this.saveVotes}>Continue&nbsp;
                <i className="fa fa-arrow-right"></i>
            </button>;
        } else {
            var button = <button className="pull-right btn btn-warning" onClick={this.saveVotes}>Abstain from {this.props.title}&nbsp;
                <i className="fa fa-arrow-right"></i>
            </button>;
        }

        var unqualified = null;
        if (this.props.unqualified.length > 0) {
            unqualified = <Unqualified
                unqualified={this.props.unqualified}
                supportLink={this.props.supportLink}/>;
        }
        return (
            <div className="multiple-ticket-vote">
                <h2>{this.props.title}</h2>
                <div className="container remaining-seats alert alert-success">
                    {button}You have selected {this.state.totalSelected}
                    of the allowed {this.props.seatNumber}
                    seat{this.props.seatNumber === '1'
                        ? null
                        : 's'}.
                </div>
                <ul className="list-group">
                    {candidates}
                </ul>
                <hr/>
                <div>
                    {button}
                </div>
                <div style={{
                    clear: 'both'
                }}>
                    {unqualified}
                </div>
            </div>
        );
    }
});

var Unqualified = React.createClass({
    getDefaultProps: function() {
        return {unqualified: []};
    },

    render: function() {
        let supportLink = 'mailto:' + this.props.supportLink;
        return (
            <div className="row">
                <div className="col-sm-6">
                    <p>
                        <strong>You were not qualified to vote in the following ballots because of your
                            class, college, or organizational affiliation.</strong>
                    </p>
                    <div
                        style={{
                        height: '300px',
                        overflow: 'auto'
                    }}>
                        <table className="table table-striped">
                            <tbody>
                                {this.props.unqualified.map(function(value, key) {
                                    return <tr key={key}>
                                        <td>{value}</td>
                                    </tr>;
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-sm-6 well">
                    <div className="alert alert-danger">
                        <strong>Is there ballot you should be able to vote on?</strong>
                    </div>
                    <ol>
                        <li>STOP! Do not complete your vote</li>
                        <li>
                            <a href={supportLink}>
                                <strong>click here</strong>&nbsp; and email your ASU username and the missing ballot name.</a>
                        </li>
                    </ol>
                    <p>We will check your account and get back to you.</p>
                </div>
            </div>
        );
    },
});

var MultipleCandidate = React.createClass({
    getInitialState: function() {
        return {};
    },

    getDefaultProps: function() {
        return {
            firstName: '',
            lastName: '',
            picture: '',
            title: '',
            selected: false,
            select: null
        };
    },

    render: function() {
        if (this.props.selected) {
            var _className = 'list-group-item pointer active';
            var icon = <button className="pull-right btn btn-default btn-lg">
                <i className="fa fa-check"></i>&nbsp; Selected</button>;
        } else {
            var _className = 'list-group-item pointer';
            var icon = <button className="pull-right btn btn-default btn-lg">Select</button>;
        }

        var picture = <div className="no-photo">
            <span>No photo</span>
        </div>;

        if (this.props.picture.length > 0) {
            picture = <img className="img-circle" src={this.props.picture}/>;
        }

        return (
            <li className={_className} onClick={this.props.select}>
                {icon}
                {picture}
                {this.props.firstName}&nbsp; {this.props.lastName}
            </li>
        );
    }
});

export default Multiple;
