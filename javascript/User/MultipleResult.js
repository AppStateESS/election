'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import MultipleResultRow from './MultipleResultRow'
import Panel from '../Mixin/Panel'

const MultipleResult = (props) => {
  let multiples = props.vote.map(function (vote, key) {
    return <MultipleResultRow {...vote} key={key} resetStage={props.resetStage}/>
  }.bind(this))

  const heading = (<h3>Senate Seats</h3>)

  const body = (<div>
    {multiples}
  </div>)

  return (<Panel heading={heading} body={body}/>)
}

MultipleResult.propTypes = {
  vote: PropTypes.array,
  resetStage: PropTypes.func
}

MultipleResult.defaultProps = {}

export default MultipleResult
