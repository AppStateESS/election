'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import SingleResult from './SingleResult'
import MultipleResult from './MultipleResult'
import ReferendumResult from './ReferendumResult'

const Review = (props) => {
  var singleResult = null
  if (props.singleVote.length > 0) {
    singleResult = <SingleResult vote={props.singleVote} resetStage={props.resetStage}/>
  }

  var multipleResult = null
  if (props.multipleVote.length > 0) {
    multipleResult = <MultipleResult vote={props.multipleVote} resetStage={props.resetStage}/>
  }

  var referendumResult = null
  if (props.referendumVote.length > 0) {
    referendumResult = <ReferendumResult vote={props.referendumVote} resetStage={props.resetStage}/>
  }

  return (
    <div>
      <h2>Review</h2>
      <div className="review-warning">
        <p>You're almost done</p>
        <p>Since you may only vote once, let's review your selections.</p>
      </div>
      <div className="text-center">
        <button className="btn btn-lg btn-block btn-success" onClick={props.finalVote}>Place my Vote</button>
      </div>
      <div>&nbsp;</div>
      <div className="vote-results">
        {singleResult}
        {multipleResult}
        {referendumResult}
      </div>
      <div className="text-center">
        <button className="btn btn-lg btn-block btn-success" onClick={props.finalVote}>Place my Vote</button>
      </div>
    </div>
  )
}

Review.propTypes = {
  election: PropTypes.object,
  single: PropTypes.array,
  multiple: PropTypes.array,
  referendum: PropTypes.array,
  singleVote: PropTypes.array,
  multipleVote: PropTypes.array,
  referendumVote: PropTypes.array,
  resetStage: PropTypes.func,
  finalVote: PropTypes.func
}


export default Review
