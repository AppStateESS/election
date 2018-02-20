'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import SingleResultRow from './SingleResultRow'

const SingleResult = (props) => {
  let rows = props.vote.map(function (value, key) {
    return <SingleResultRow
      key={key}
      {...value}
      resetStage={props.resetStage.bind(null, 'single', value.single.id)}/>
  }.bind(this))

  return (<div>
    {rows}
  </div>)
}

SingleResult.propTypes = {
  vote: PropTypes.array,
  resetStage: PropTypes.func
}

export default SingleResult
