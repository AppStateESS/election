'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Panel from '../../Mixin/Panel'
import {categoryTypes} from './types.js'
import Candidates from './Candidates.jsx'
/* global $, allowChange */

export default class MultipleListRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formId: -1,
      candidates: [],
      candidateCount: 0,
    }
    this.edit = this.edit.bind(this)
    this.load = this.load.bind(this)
    this.toggleExpand = this.toggleExpand.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  load() {
    $.getJSON('election/Admin/Candidate', {
      command: 'candidateList',
      multipleId: this.props.multipleId,
    }).done(function (data) {
      this.setState({candidates: data, candidateCount: data.length,})

    }.bind(this))
  }

  toggleExpand() {
    this.props.openMultiple(this.props.multipleId)
  }

  handleDelete() {
    if (confirm('Are you sure you want to delete this ballot?')) {
      $.post('election/Admin/Multiple', {
        command: 'delete',
        ballotId: this.props.id
      }, null, 'json').done(function () {
        this.props.reload()
      }.bind(this)).fail(function () {
        alert('Unable to delete multiple ballot')
        this.props.reload()
      }.bind(this))
    }
  }

  edit(e) {
    e.stopPropagation()
    this.props.edit()
  }

  render() {
    var heading = (
      <div className="row">
        <div className="col-sm-9">
          <div className="ballot-title">{this.props.title}&nbsp;-&nbsp; {this.state.candidateCount}&nbsp;
            candidate{
              this.state.candidateCount !== 1
                ? 's'
                : null
            }
          </div>
          <div>
            <strong>Available seats:</strong>&nbsp;
            {this.props.seatNumber}</div>
          <div>
            <strong>Voting categor{
                (this.props.category.indexOf(',') != -1)
                  ? 'ies'
                  : 'y'
              }:</strong>
            <CategoryTitle category={this.props.category}/></div>
        </div>
        <div className="col-sm-3">
          <button
            className="btn btn-success btn-block"
            onClick={this.edit}
            title="Edit ballot">
            <i className="fa fa-edit"></i>&nbsp;
            Edit</button>
          <button
            disabled={!allowChange}
            className="btn btn-danger btn-block"
            onClick={this.handleDelete}>
            <i className="far fa-trash-alt" title="Remove ballot"></i>&nbsp;
            Delete</button>
        </div>
      </div>
    )
    let body
    let arrow
    if (this.props.isOpen) {
      
      body = (
        <Candidates
          type="multiple"
          electionId={this.props.electionId}
          multipleId={this.props.multipleId}
          candidates={this.state.candidates}
          reload={this.load}/>
      )
      arrow = <i className="fa fa-chevron-up"></i>
    } else {
      body = null
      arrow = <i className="fa fa-chevron-down"></i>
    }

    var footer = (<div className="text-center pointer">{arrow}</div>)

    return (
      <Panel
        type="success"
        heading={heading}
        body={body}
        footer={footer}
        footerClick={this.toggleExpand}
        headerClick={this.toggleExpand}/>
    )

  }
}

MultipleListRow.propTypes = {
  id: PropTypes.string,
  electionId: PropTypes.number,
  multipleId: PropTypes.string,
  title: PropTypes.string,
  seatNumber: PropTypes.string,
  category: PropTypes.string,
  isOpen: PropTypes.bool,
  openMultiple: PropTypes.func,
  reload: PropTypes.func,
  edit: PropTypes.func
}

MultipleListRow.defaultProps = {
  electionId: 0,
  multipleId: 0,
  title: '',
  seatNumber: 0,
  category: '',
  isOpen: true,
}

const CategoryTitle = (props) => {
  let prebreak = props.category
  const category = prebreak.split(',')
  let listing = ''
  listing += category.map(function (value) {
    return ' ' + categoryTypes[value]
  })
  return (<span>
    {listing}
  </span>)
}

CategoryTitle.propTypes = {
  category: PropTypes.string,
}
