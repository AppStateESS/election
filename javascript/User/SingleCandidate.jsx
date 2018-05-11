'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const SingleCandidate = (props) => {
  let colSize
  switch (props.candidateLength) {
    case 1:
      colSize = 'col-sm-6'
      break
    case 2:
      colSize = 'col-sm-3'
  }
  return (
    <div className={colSize}>
      <div>
        {
          props.picture.length > 0
            ? (
              <div className="photo-matte">
                <span className="helper"></span>
                <img src={props.picture} className="img-fluid candidate"/>
              </div>
            )
            : (
              <div className="no-picture text-muted">
                <i className="fa fa-user fa-5x"></i><br/>No picture</div>
            )
        }
      </div>
      <p>
        <strong>{props.firstName}&nbsp;{props.lastName}</strong><br/> {props.title}</p>
    </div>
  )
}

SingleCandidate.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  picture: PropTypes.string,
  title: PropTypes.string,
  candidateLength: PropTypes.number,
}

SingleCandidate.defaultProps = {
  firstName: '',
  lastName: '',
  picture: '',
  title: '',
  candidateLength: 1
}

export default SingleCandidate
