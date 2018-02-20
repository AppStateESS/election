'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReferendumForm from './ReferendumForm'
import ReferendumListRow from './ReferendumListRow'

export default class ReferendumList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentEdit: -1,
      openReferendum: 0,
    }
    this.editRow = this.editRow.bind(this)
    this.openReferendum = this.openReferendum.bind(this)
  }

  editRow(id) {
    this.setState({currentEdit: id})
  }

  openReferendum(referendumId) {
    if (referendumId === this.state.openreferendum) {
      referendumId = 0
    }

    this.setState({openReferendum: referendumId})
  }

  render() {

    var shared = {
      electionId: this.props.electionId,
      reload: this.props.reload,
      hideForm: this.editRow.bind(null, -1),
      openReferendum: this.openReferendum,
    }

    var referendumList = this.props.listing.map(function (value) {
      if (value.id === this.state.currentEdit) {
        return <ReferendumForm key={value.id} {...value} referendumId={value.id} {...shared}/>
      } else {
        return <ReferendumListRow
          key={value.id}
          {...value}
          isOpen={this.state.openReferendum === value.id}
          referendumId={value.id}
          edit={this.editRow.bind(null, value.id)}
          {...shared}/>
      }
    }.bind(this))

    return (
      <div className="pad-top">
        {referendumList}
      </div>
    )
  }
}

ReferendumList.propTypes = {
  electionId : PropTypes.number,
  listing: PropTypes.array,
  reload: PropTypes.func,
}

ReferendumList.defaultProps = {
  listing: [],
  reload: null,
  electionId: 0,
}
