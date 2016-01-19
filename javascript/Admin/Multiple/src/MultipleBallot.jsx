'use strict';

var MultipleBallot = React.createClass({
    mixins : ['Panel', Ballot],

    load : function() {
        $.getJSON('election/Admin/Multiple', {
        	command : 'list'
        }).done(function(data){
            this.setState({
                ballotList : data
            });
        }.bind(this));
    }
});

var BallotList = React.createClass({
    mixins : [BallotListMixin],
    render: function() {
        var form = null;

        if (this.state.ballotEditId === -1) {
            form = <MultipleBallotForm hideForm={this.editBallot.bind(null,0)} reload={this.props.reload}/>
        }

        var ballotList = this.props.listing.map(function(value){
            if (value.id === this.state.ballotEditId) {
                return <MultipleBallotForm key={value.id} {...value} hideForm={this.editBallot.bind(null, 0)} reload={this.props.reload}/>;
            } else {
                return <BallotListRow key={value.id} {...value} handleEdit={this.editBallot.bind(null, value.id)} reload={this.props.reload}/>
            }
        }.bind(this));

        if (ballotList.length === 0) {
            ballotList = (
                <div>
                <h3>No ballots found.</h3>
                </div>
            );
        }

        return (
            <div>
                <button className="btn btn-success" onClick={this.editBallot.bind(null, -1)}><i className="fa fa-5x fa-calendar-check-o"></i><br />Create ballot</button>
                <hr />
                {form}
                {ballotList}
            </div>
        );
    }

});

var BallotListRow = React.createClass({
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
            <div>
                hi
            </div>
        );
    }

});

var MultipleBallotForm = React.createClass({
    mixins : [BallotForm],

    save : function() {
        var error = this.checkForErrors();
        if (error === false) {
            $.post('election/Admin/Multiple', {
            	command : 'save',
                ballotId : this.state.ballotId,
                title : this.state.title,
                startDate : this.state.unixStart,
                endDate: this.state.unixEnd
            }, null, 'json')
            	.done(function(data){
                    this.props.reload();
            	}.bind(this))
                .always(function(){
                    this.props.hideForm();
                }.bind(this));

        }
    },

    render : function() {
        return this._render;
    }

});

ReactDOM.render(<MultipleBallot/>, document.getElementById('multiple-ballot'));
