'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const MultipleCandidateRow = (props) => {
  var icon = <i className="float-right text-success fa fa-check-circle fa-2x"></i>

  var picture = <div className="no-photo">
    <span>No photo</span>
  </div>

  if (props.picture.length > 0) {
    picture = <img className="img-circle" src={props.picture}/>
  }

  return (
    <li className="list-group-item" onClick={props.select}>
      {icon}
      {picture}
      {props.firstName}&nbsp;{props.lastName}
    </li>
  )
}

MultipleCandidateRow.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  picture: PropTypes.string,
  select: PropTypes.func
}

export default MultipleCandidateRow
