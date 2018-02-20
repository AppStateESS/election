'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import MultipleForm from './MultipleForm'
import MultipleListRow from "./MultipleListRow"

export default class MultipleList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentEdit: -1,
      openMultiple: 0
    }
    this.openMultiple = this.openMultiple.bind(this)
    this.editRow = this.editRow.bind(this)
  }

  editRow(multipleId) {
    this.setState({currentEdit: multipleId})
  }

  openMultiple(multipleId) {
    if (multipleId === this.state.openMultiple) {
      multipleId = 0
    }

    this.setState({openMultiple: multipleId})
  }

  render() {
    let multipleList = (
      <div>
        <h3>No multiple chair ballots found.</h3>
      </div>
    )

    const shared = {
      electionId: this.props.electionId,
      reload: this.props.reload,
      hideForm: this.editRow.bind(null, -1),
      openMultiple: this.openMultiple
    }

    multipleList = this.props.listing.map(function (value) {
      if (value.id === this.state.currentEdit) {
        return <MultipleForm key={value.id} {...value} multipleId={value.id} {...shared}/>
      } else {
        return <MultipleListRow
          key={value.id}
          {...value}
          isOpen={this.state.openMultiple === value.id}
          multipleId={value.id}
          edit={this.editRow.bind(null, value.id)}
          {...shared}/>
      }
    }.bind(this))

    return (
      <div>
        <div className="pad-top">
          {multipleList}
        </div>
      </div>
    )
  }
}

MultipleList.propTypes = {
  listing: PropTypes.array,
  reload: PropTypes.func,
  electionId: PropTypes.number
}

MultipleList.defaultProps = {
  listing: [],
  electionId: 0
}
