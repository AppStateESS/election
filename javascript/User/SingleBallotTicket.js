'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import Panel from '../Mixin/Panel'
import SingleCandidate from './SingleCandidate'
import {BreakIt} from '../Mixin/Mixin.jsx'

const SingleBallotTicket = (props) => {
  const candidateCount = props.candidates.length
  let candidates
  if (candidateCount > 0) {
    candidates = props.candidates.map(function (value) {
      return <SingleCandidate key={value.id} {...value} candidateLength={candidateCount}/>
    }.bind(this))
  }

  var heading = <h2>{props.title}</h2>

  var platform = BreakIt(props.platform)

  var website = null

  if (props.siteAddress.length) {
    website = <div className="website">
      <a href={props.siteAddress} target="_blank">{props.siteAddress}
        <i className="fa fa-external-link"></i>
      </a>
    </div>
  }

  var body = (
    <div className="ticket">
      <div className="row">
        <div className="col-sm-6">
          {platform}
          <hr/> {website}
        </div>
        {candidates}
      </div>
      <button className="btn btn-primary btn-block btn-lg" onClick={props.updateVote}>
        <i className="fa fa-check-square-o"></i>&nbsp;
        Vote for {props.title}
      </button>
    </div>
  )

  return (<Panel heading={heading} body={body}/>)
}

SingleBallotTicket.propTypes = {
  title: PropTypes.string,
  platform: PropTypes.string,
  siteAddress: PropTypes.string,
  candidates: PropTypes.array,
  updateVote: PropTypes.func,
  vote: PropTypes.array,
}

export default SingleBallotTicket
