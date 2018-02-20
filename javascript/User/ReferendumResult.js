'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import ReferendumResultRow from './ReferendumResultRow'
import Panel from '../Mixin/Panel'

const ReferendumResult = (props) => {
  var rows = props.vote.map(function (value, key) {
    return <ReferendumResultRow key={key} {...value} resetStage={props.resetStage}/>
  }.bind(this))

  var heading = (<h3>Referenda</h3>)

  var body = (<div>
    {rows}
  </div>)

  return <Panel heading={heading} body={body}/>
}

ReferendumResult.propTypes = {
  vote: PropTypes.array,
  resetStage: PropTypes.func
}

export default ReferendumResult
