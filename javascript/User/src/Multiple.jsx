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
        return <MultipleBallot multipleId={this.props.ballot.id} {...this.props.ballot}
            updateVote={this.props.updateVote} vote={this.props.vote}/>;
    }
});

var MultipleBallot = React.createClass({
    getInitialState: function() {
        return {
            selectedRows : []
        };
    },

    getDefaultProps: function() {
        return {
            updateVote : null,
            title : null,
            candidates : [],
            vote : null,
            multipleId : 0
        };
    },

    select : function(candidateId) {
        var selectedRows = this.state.selectedRows;
        var found = $.inArray(candidateId, selectedRows);
        if (found === -1) {
            selectedRows.push(candidateId);
        } else {
            selectedRows.splice(found,1);
        }

        this.setState({
            selectedRows : selectedRows
        });
    },


    render: function() {
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

        return (
            <div className="multiple-ticket-vote">
                <h1>{this.props.title}</h1>
                <p className="warning">Select up to blanks seats</p>
                <ul className="list-group">
                    {candidates}
                </ul>
                <hr />
                <div className="text-right">
                    <SkipButton title={this.props.title} />
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
        return (
            <li className={_className} onClick={this.props.select}>
                {icon}
                {this.props.picture.length > 0 ? (
                    <img className="img-circle" src={this.props.picture}/>
                ) : (
                    <div className="no-picture text-muted"><i className="fa fa-user fa-5x"></i><br />No picture</div>
                )}
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
