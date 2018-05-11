'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import Panel from '../Mixin/Panel'
import MultipleCandidateRow from './MultipleCandidateRow'

/* global $ */

const MultipleResultRow = (props) => {
  var heading = (
    <div className="row">
      <div className="col-xs-10">
        <h4>{props.multiple.title}</h4>
      </div>
      <div className="col-xs-2">
        <button
          disabled={props.multiple.candidates === undefined}
          className="btn btn-outline-dark btn-block"
          onClick={props.resetStage.bind(null, 'multiple', props.multiple.id)}>
          <i className="fas fa-pencil-alt"></i>&nbsp;
          Edit
        </button>
      </div>
    </div>
  )
  let candidates
  if (props.multiple.candidates === undefined) {
    candidates = <div>
      <h4>No seats to vote on.</h4>
    </div>
  } else if (props.chairs.length === 0) {
    candidates = <div>
      <h4>No candidates chosen.</h4>
      <p>Abstained.</p>
    </div>
  } else {
    var candidateListing = props.multiple.candidates.map(
      function (candidate, key) {
        if ($.inArray(candidate.id, props.chairs) !== -1) {
          return <MultipleCandidateRow {...candidate} key={key}/>
        }
      }.bind(this)
    )
    candidates = (
      <ul className="list-group">
        {candidateListing}
      </ul>
    )
  }

  const body = (
    <div className="multiple-ticket-vote">
      {candidates}
    </div>
  )
  return <Panel heading={heading} body={body}/>
}

MultipleResultRow.propTypes = {
  resetStage: PropTypes.func,
  multiple: PropTypes.object,
  chairs: PropTypes.array
}

export default MultipleResultRow
