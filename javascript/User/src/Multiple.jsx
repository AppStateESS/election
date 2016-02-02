var Multiple = React.createClass({
    getDefaultProps: function() {
        return {
            election : {},
            updateVote : null,
            vote : [],
            ballot : {}
        };
    },

    render: function() {
        return <MultipleBallot multipleId={this.props.ballot.id}
            {...this.props.ballot}
            updateVote={this.props.updateVote} vote={this.props.vote}/>;
    }
});

var MultipleBallot = React.createClass({
    getInitialState: function() {
        return {
            selectedRows : [],
            totalSelected : 0
        };
    },

    getDefaultProps: function() {
        return {
            updateVote : null,
            seatNumber : 2,
            title : null,
            candidates : [],
            vote : null,
            multipleId : 0
        };
    },

    select : function(candidateId) {
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
            selectedRows.splice(found,1);
        }

        this.setState({
            selectedRows : selectedRows,
            totalSelected : totalSelected
        });
    },

    saveVotes : function() {
        this.props.updateVote(this.state.selectedRows);
    },

    render: function() {
        var seatNumber = this.props.seatNumber * 1;
        var candidates = this.props.candidates.map(function(value){
            if ($.inArray(value.id, this.state.selectedRows) !== -1) {
                var selected = true;
            } else {
                var selected = false;
            }
            return (
                <MultipleCandidate key={value.id} {...value}
                    selected={selected} select={this.select.bind(null, value.id)}/>
            );
        }.bind(this));

        var button = null;
        if (this.state.totalSelected == seatNumber) {
            button = <button className="pull-right btn btn-success" onClick={this.saveVotes}>Continue <i className="fa fa-arrow-right"></i></button>;
        }

        return (
            <div className="multiple-ticket-vote">
                <h2>{this.props.title}</h2>
                <div className="remaining-seats alert alert-success">
                    {button}You have selected {this.state.totalSelected} of the allowed {this.props.seatNumber} seats.
                </div>
                <ul className="list-group">
                    {candidates}
                </ul>
                <hr />
                <div className="text-right">
                    <SkipButton title={this.props.title} handleClick={this.saveVotes} />
                </div>
            </div>
        );
    }
});

var MultipleCandidate = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            firstName : '',
            lastName : '',
            picture : '',
            title : '',
            selected : false,
            select : null
        };
    },

    render: function() {
        if (this.props.selected) {
            var _className = 'list-group-item pointer active';
            var icon = <i className="pull-right fa fa-check fa-2x"></i>;
        } else {
            var _className = 'list-group-item pointer';
            var icon = null;
        }

        var picture = <img className="img-circle" src='mod/election/img/no-picture.gif'/>

        if (this.props.picture.length > 0) {
            picture = <img className="img-circle" src={this.props.picture}/>;
        }

        return (
            <li className={_className} onClick={this.props.select}>
                {icon}
                {picture}
                {this.props.firstName} {this.props.lastName}
            </li>
        );
    }

});


var SkipButton = (props) => (
    <div className="btn btn-success btn-lg" onClick={props.handleClick}>
        Continue <i className="fa fa-arrow-right"></i>
    </div>
);
