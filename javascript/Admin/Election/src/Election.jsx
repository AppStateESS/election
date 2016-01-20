'use strict';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Election = React.createClass({
    getInitialState: function() {
        return {
            formId : -1,
            elections : []
        };
    },

    componentDidMount: function() {
        this.load();
    },

    load: function() {
        $.getJSON('election/Admin/Election', {
        	command : 'list'
        }).done(function(data){
        	this.setState({
                elections : data
            });
        }.bind(this));
    },

    showForm : function() {
        this.setState({
            formId : 0
        });
    },

    hideForm : function() {
        this.setState({
            formId : -1
        });
    },

    render: function() {
        var form = null;
        var sharedFunc = {hideForm : this.hideForm, load : this.load};
        if (this.state.formId === 0) {
            form = <ElectionForm electionId={0} {...sharedFunc} />;
        }

        return (
            <div>
                <CreateElectionButton handleClick={this.showForm}/>
                {form}
                <ElectionList elections={this.state.elections} hideForm={this.hideForm} load={this.load}/>
            </div>
        );
    }

});

var CreateElectionButton = (props) => (
    <button className="btn btn-lg btn-primary" onClick={props.handleClick}><i className="fa fa-gavel"></i> Create new election</button>
);

var ElectionForm = React.createClass({
    getInitialState: function() {
        return {
            title : '',
            startDate : '',
            endDate : '',
            unixStart : 0,
            unixEnd : 0
        };
    },

    getDefaultProps: function() {
        return {
            electionId : 0,
            title: '',
            startDate : '',
            endDate : '',
            hideForm : null
        };
    },

    componentWillMount: function() {
        if (this.props.electionId) {
            this.copyPropsToState();
        }
    },

    componentDidMount: function() {
        this.initStartDate();
        this.initEndDate();
    },

    copyPropsToState: function() {
        this.setState({
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

    changeStartDate: function(e) {
        this.updateStartDate(e.target.value);
    },

    changeEndDate: function(e) {
        this.updateEndDate(e.target.value);
    },

    updateTitle : function(e) {
        this.setState({
            title : e.target.value
        });
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

    showStartCalendar : function() {
        $('#start-date').datetimepicker('show');
    },

    showEndCalendar : function() {
        $('#end-date').datetimepicker('show');
    },

    resetBorder : function(node) {
        $(node.target).removeAttr('style');
    },

    checkForErrors : function() {
        var error = false;
        if (this.state.title.length === 0) {
            $(this.refs.electionTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
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
            $.post('election/Admin/Election', {
                command : 'save',
                electionId : this.props.electionId,
                title : this.state.title,
                startDate : this.state.unixStart,
                endDate: this.state.unixEnd
            }, null, 'json')
                .done(function(data){
                    this.props.load();
                }.bind(this))
                .always(function(){
                    this.props.hideForm();
                }.bind(this));
        }
    },

    render: function() {
        var title = (
            <input ref="electionTitle" type="text" className="form-control" defaultValue={this.props.title}
            id="election-title" onFocus={this.resetBorder} onChange={this.updateTitle} placeholder='Title (e.g. Fall 2016 Election)' />
        );
        var date =(
            <div className="row pad-top">
                <div className="col-sm-6">
                    <div className="input-group">
                        <input placeholder="Voting start date and time" ref="startDate" type="text" className="form-control datepicker" id="start-date" onFocus={this.resetBorder} onChange={this.changeStartDate}/>
                        <div className="input-group-addon">
                            <i className="fa fa-calendar" onClick={this.showStartCalendar}></i>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="input-group">
                        <input placeholder="Voting deadline" ref="endDate" type="text" className="form-control datepicker" id="end-date" onFocus={this.resetBorder} onChange={this.changeEndDate}/>
                        <div className="input-group-addon">
                            <i className="fa fa-calendar" onClick={this.showEndCalendar}></i>
                        </div>
                    </div>
                </div>
            </div>
        );
        var buttons = (
            <div>
                <button className="btn btn-primary btn-block" onClick={this.save}><i className="fa fa-save"></i> Save election</button>
                <button className="btn btn-danger btn-block" onClick={this.props.hideForm}><i className="fa fa-times"></i> Cancel</button>
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

        return (
            <Panel type="info" heading={heading} />
        );
    }

});

var ElectionList = React.createClass({
    getInitialState: function() {
        return {
            currentEdit : 0
        };
    },

    getDefaultProps: function() {
        return {
            elections : [],
            hideForm : null
        };
    },

    editRow : function(electionId) {
        this.props.hideForm();
        this.setState({
            currentEdit : electionId
        });
    },

    render: function() {
        var electionListing = <h3>No elections found</h3>;

        if (this.props.elections.length > 0) {
            electionListing = this.props.elections.map(function(value){
                if (value.id === this.state.currentEdit) {
                    return <ElectionForm key={value.id} {...value} electionId={value.id} hideForm={this.editRow.bind(null, 0)} load={this.props.load}/>
                } else {
                    return <ElectionRow key={value.id} {...value} edit={this.editRow.bind(this, value.id)}/>
                }
            }.bind(this));
        }

        return (
            <div className="pad-top">
                {electionListing}
            </div>
        );
    }

});

var ElectionRow = React.createClass({
    getInitialState: function() {
        return {
            panelOpen : false
        };
    },

    getDefaultProps: function() {
        return {
        };
    },

    toggleExpand: function() {
        this.setState({
            panelOpen : !this.state.panelOpen
        });
    },

    render: function() {
        var title = <h3>{this.props.title}</h3>;
        var date = <h4>{this.props.startDateFormatted} - {this.props.endDateFormatted}</h4>;

        var heading = (

            <div className="row">
                <div className="col-sm-9">
                    {title}
                    {date}
                </div>
                <div className="col-sm-3">
                    <div className="text-right">
                        <button className="btn btn-block btn-success" onClick={this.props.edit}><i className="fa fa-edit"></i> Edit election</button>
                        <button className="btn btn-block btn-danger"><i className="fa fa-trash-o"></i> Delete election</button>
                    </div>
                </div>
            </div>
        );


        if (this.state.panelOpen) {
            var body = (
                <div>
                    <VoteChoice />
                    <SingleBallot />
                    <MultipleBallot />
                    <Referendum />
                </div>
            );
            var arrow = <i className="fa fa-chevron-up"></i>;
        } else {
            var body = null;
            var arrow = <i className="fa fa-chevron-down"></i>;
        }

        var footer = (<div className="text-center pointer" onClick={this.toggleExpand}>{arrow}</div>);

        return <Panel type="info" heading={heading} body={body} footer={footer} />;
    }
});

var VoteChoice = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
        };
    },

    render: function() {
        return (
            <div className="well">
                Create new...&nbsp;
                <button className="btn btn-primary pad-right"><i className="fa fa-user"></i> Single ballot</button>
                <button className="btn btn-primary pad-right"><i className="fa fa-users"></i> Multiple chair ballot</button>
                <button className="btn btn-primary"><i className="fa fa-gavel"></i> Referendum</button>
            </div>
        );
    }

});

ReactDOM.render(<Election/>, document.getElementById('election-dashboard'));
