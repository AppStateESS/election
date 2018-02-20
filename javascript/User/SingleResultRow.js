'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import Panel from '../Mixin/Panel'
import SingleCandidate from './SingleCandidate'

const SingleResultRow = (props) => {
  var heading = (
    <div className="row">
      <div className="col-xs-10">
        <h3>{props.single.title}</h3>
      </div>
      <div className="col-xs-2">
        <button
          className="btn btn-block btn-default"
          onClick={props.resetStage.bind(null, 'single', props.single.id)}>
          <i className="fa fa-pencil"></i>&nbsp;
          Edit
        </button>
      </div>
    </div>
  )
  let icon
  let title
  let candidates

  if (props.ticket) {
    icon = <i className="fa fa-check-circle text-success fa-5x pull-right"></i>
    title = <h4>{props.ticket.title}</h4>
    candidates = props.ticket.candidates.map(function (value, key) {
      return (
        <div className="pull-left pad-right" key={key}>
          <SingleCandidate {...value}/>
        </div>
      )
    })
  } else {
    icon = null
    title = <h4>No ticket chosen</h4>
    candidates = <p>Abstained</p>
  }

  const body = (
    <div>
      {icon}
      {title}
      <div>
        {candidates}
      </div>
    </div>
  )

  return <Panel heading={heading} body={body}/>
}

SingleResultRow.propTypes = {
  single: PropTypes.object,
  ticket: PropTypes.object,
  resetStage: PropTypes.func,
}

export default SingleResultRow
