'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import Unqualified from './Unqualified'
import MultipleBallot from './MultipleBallot'
import Qualified from './Qualified'

const Multiple = (props) => {
  if (props.ballot === undefined || Object.keys(props.ballot).length == 0) {
    return (
      <div>
        <EmptyMultiple unqualified={props.unqualified} update={props.updateVote}/>
        <Qualified qualified={props.qualified}/>
      </div>
    )
  }
  return (
    <div>
      <MultipleBallot
        multipleId={props.ballot.id}
        {...props.ballot}
        updateVote={props.updateVote}
        vote={props.vote}
        unqualified={props.unqualified}
        supportLink={props.supportLink}/>
      <Qualified qualified={props.qualified}/>
    </div>
  )
}

Multiple.propTypes = {
  election: PropTypes.object,
  updateVote: PropTypes.func,
  vote: PropTypes.array,
  ballot: PropTypes.object,
  unqualified: PropTypes.array,
  qualified: PropTypes.object,
  supportLink: PropTypes.string
}

export default Multiple

const EmptyMultiple = (props) => {
  return (
    <div>
      <h2>No senate seats to vote on</h2>
      <Unqualified unqualified={props.unqualified} supportLink={props.supportLink}/>
      <button className="pull-right btn btn-success btn-lg" onClick={props.update}>Continue&nbsp;
        <i className="fa fa-arrow-right"></i>
      </button>
    </div>
  )
}

EmptyMultiple.propTypes = {
  unqualified: PropTypes.array,
  supportLink: PropTypes.string,
  update: PropTypes.func
}
