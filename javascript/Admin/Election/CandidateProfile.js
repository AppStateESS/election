'use strict'
import React from 'react'
import PropTypes from 'prop-types'

/* global allowChange */

const CandidateProfile = (props) => {
  return (
    <div className="candidate-profile">
      <div className="photo-matte">
        {
          props.picture.length > 0
            ? (
              <div>
                <span className="helper"></span>
                <img src={props.picture} className="img-responsive candidate-pic"/>
              </div>
            )
            : (
              <div className="no-picture text-muted">
                <i className="fa fa-user fa-5x"></i><br/>No picture</div>
            )
        }
      </div>
      <div>
        <p>
          <strong>{props.firstName}&nbsp;{props.lastName}</strong><br/> {props.title}
        </p>
        <button className="btn btn-primary" title="Edit candidate" onClick={props.edit}>
          <i className="fa fa-edit"></i>
        </button>&nbsp;
        <button
          className="btn btn-danger"
          disabled={!allowChange}
          onClick={props.deleteCandidate}
          title="Delete candidate">
          <i className="fa fa-times"></i>
        </button>
      </div>
    </div>
  )
}

CandidateProfile.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  title: PropTypes.string,
  picture: PropTypes.string,
  edit: PropTypes.func,
  deleteCandidate: PropTypes.func
}

CandidateProfile.defaultTypes = {
  firstName: null,
  lastName: null,
  title: null,
  picture: null
}

export default CandidateProfile
