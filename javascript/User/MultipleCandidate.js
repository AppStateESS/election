'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const MultipleCandidate = (props) => {
  let _className = 'list-group-item pointer'
  let icon = <button className="float-right btn btn-outline-dark btn-lg">Select</button>

  if (props.selected) {
    _className = 'list-group-item pointer active'
    icon = <button className="float-right btn btn-outline-dark btn-lg">
      <i className="fa fa-check"></i>&nbsp; Selected</button>
  }

  let picture = <div className="no-photo">
    <span>No photo</span>
  </div>

  if (props.picture.length > 0) {
    picture = <img className="img-circle" src={props.picture}/>
  }

  return (
    <li className={_className} onClick={props.select}>
      {icon}
      {picture}
      {props.firstName}&nbsp; {props.lastName}
    </li>
  )
}

MultipleCandidate.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  picture: PropTypes.string,
  title: PropTypes.string,
  selected: PropTypes.bool,
  select: PropTypes.func
}

MultipleCandidate.defaultTypes = {
  firstName: '',
  lastName: '',
  picture: '',
  title: '',
  selected: false
}

export default MultipleCandidate
