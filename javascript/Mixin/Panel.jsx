'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const Panel = (props) => {
  let heading = null
  if (props.heading) {
    heading = <div className="panel-heading" onClick={props.headerClick}>{props.heading}</div>
  }

  let body = null
  if (props.body) {
    body = (<div className="panel-body">
      {props.body}
    </div>)
  }

  let footer = null
  if (props.footer) {
    footer = <div className="panel-footer" onClick={props.footerClick}>{props.footer}</div>
  }

  let panelType = 'panel panel-' + props.type
  return (
    <div className={panelType}>
      {heading}
      <ReactCSSTransitionGroup
        transitionName="expand"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        {body}
      </ReactCSSTransitionGroup>
      {footer}
    </div>
  )
}

Panel.propTypes = {
  heading: PropTypes.oneOfType([PropTypes.string,PropTypes.object,]),
  headerClick: PropTypes.func,
  body: PropTypes.oneOfType([PropTypes.string,PropTypes.object,PropTypes.array,]),
  footerClick: PropTypes.func,
  footer: PropTypes.oneOfType([PropTypes.string,PropTypes.object,]),
  type: PropTypes.string
}

export default Panel
