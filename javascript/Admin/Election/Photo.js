'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'

const Photo = (props) => {
  const onDrop = (photo) => {
    props.update(photo)
  }

  let photo
  let imageSrc = null
  if (props.photo.length > 0) {
    imageSrc = props.photo[0].preview
    photo = (<img src={imageSrc} className="img-responsive"/>)
  } else if (props.picture != null && props.picture.length) {
    photo = (<img src={props.picture} className="img-responsive"/>)
  } else {
    photo = (
      <div className="clickme">
        <i className="fa fa-camera fa-5x"></i><br/>
        <p>Click or drag image here</p>
      </div>
    )
  }
  return (
    <Dropzone onDrop={onDrop} className="dropzone text-center">
      {photo}
    </Dropzone>
  )
}

Photo.propTypes = {
  photo: PropTypes.array,
  picture: PropTypes.string,
  update: PropTypes.func
}

Photo.defaultTypes = {
  photo: [],
  picture: ''
}

export default Photo
