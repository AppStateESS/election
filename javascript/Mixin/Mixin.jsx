'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const BreakIt = (text) => {
  if (typeof text === 'undefined') {
    throw 'BreakIt text parameter is undefined'
  }
  let broken = text.split("\n").map(function (item, i) {
    return (<span key={i}>{item}
      <br/>
    </span>)
  })
  return broken
}

BreakIt.propTypes = {
  text : PropTypes.string,
}

const AbstainButton = (props) => {
  return (
    <div className="btn btn-warning btn-lg" onClick={props.handleClick}>
      Abstain from {props.title}
      <i className="fa fa-arrow-right"></i>
    </div>
  )
}

AbstainButton.propTypes = {
  handleClick: PropTypes.func,
  title: PropTypes.string
}

export {
  BreakIt,
  AbstainButton,
}
