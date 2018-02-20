'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import SingleBallotForm from './SingleBallotForm'
import SingleListRow from './SingleListRow'

export default class SingleList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentEdit: -1,
      openSingle: 0
    }
    this.openSingle = this.openSingle.bind(this)
    this.setCurrentEdit = this.setCurrentEdit.bind(this)
  }
  
  setCurrentEdit(singleId) {
    this.props.hideForm()
    this.setState({currentEdit: singleId})
  }

  openSingle(singleId) {
    if (singleId === this.state.openSingle) {
      singleId = 0
    }

    this.setState({openSingle: singleId})
  }

  render() {
    let singleList = (<div>
      <h3>No single ballots found.</h3>
    </div>)

    const shared = {
      electionId: this.props.electionId,
      reload: this.props.reload,
      hideForm: this.setCurrentEdit.bind(null, -1),
      openSingle: this.openSingle
    }

    if (this.props.listing.length > 0) {
      singleList = this.props.listing.map(function (value) {
        if (value.id === this.state.currentEdit) {
          return <SingleBallotForm key={value.id} {...value} singleId={value.id} {...shared}/>
        } else {
          return <SingleListRow
            key={value.id}
            {...value}
            isOpen={this.state.openSingle === value.id}
            singleId={value.id}
            edit={this.setCurrentEdit.bind(null, value.id)}
            {...shared}/>
        }
      }.bind(this))
    }

    return (
      <div>
        <div className="pad-top">
          {singleList}
        </div>
      </div>
    )
  }
}

SingleList.propTypes = {
  listing: PropTypes.array,
  reload: PropTypes.func,
  electionId: PropTypes.number,
  hideForm: PropTypes.func,
}

SingleList.defaultProps = {
  listing: [],
  reload: null,
  electionId: 0
}
