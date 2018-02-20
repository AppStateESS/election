'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Panel from '../../Mixin/Panel.jsx'
import CategoryList from  './CategoryList'
import 'react-select/dist/react-select.css'

/* global $ */

export default class MultipleForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      seatNumber: '2',
      category: 'everyone',
    }
    this.resetBorder = this.resetBorder.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.updateSeatNumber = this.updateSeatNumber.bind(this)
    this.updateCategory = this.updateCategory.bind(this)
    this.save = this.save.bind(this)
  }

  componentWillMount () {
    if (this.props.id) {
      this.copyPropsToState()
    }
  }

  copyPropsToState () {
    this.setState(
      {title: this.props.title, seatNumber: this.props.seatNumber, category: this.props.category,}
    )
  }

  updateTitle (e) {
    this.setState({title: e.target.value})
  }

  updateSeatNumber (e) {
    var seatNumber = e.target.value
    if (seatNumber < 1) {
      e.target.value = '1'
      return
    }
    this.setState({seatNumber: e.target.value})
  }

  updateCategory (value) {
    this.setState({category: value})
  }

  checkForErrors () {
    var error = false
    if (this.state.title.length === 0) {
      $(this.refs.multipleTitle).css('borderColor', 'red').attr(
        'placeholder',
        'Please enter a title'
      )
      error = true
    }
    if (this.state.seatNumber < 1) {
      error = true
    }

    if (this.state.category == null || this.state.category.length == 0) {
      this.setState({category: 'everyone'})
      error = true
    }

    return error
  }

  save () {
    var error = this.checkForErrors()
    if (error === false) {
      $.post('election/Admin/Multiple', {
        command: 'save',
        multipleId: this.props.multipleId,
        electionId: this.props.electionId,
        title: this.state.title,
        seatNumber: this.state.seatNumber,
        category: this.state.category,
      }, null, 'json').done(function () {
        this.props.reload()
      }.bind(this)).always(function () {
        this.props.hideForm()
      }.bind(this))
    }
  }

  resetBorder (node) {
    $(node.target).removeAttr('style')
  }

  render () {
    var heading = (
      <div className="row">
        <div className="col-sm-9">
          <div className="row">
            <div className="col-sm-12">
              <label>Ballot title (e.g. Sophomore Senate)</label>
              <input
                ref="multipleTitle"
                type="text"
                className="form-control"
                defaultValue={this.props.title}
                id="multiple-title"
                min="2"
                onFocus={this.resetBorder}
                onChange={this.updateTitle}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <label>Available seats</label>
              <input
                ref="seatNumber"
                type="number"
                className="form-control"
                onChange={this.updateSeatNumber}
                defaultValue={this.props.seatNumber}/>
            </div>
            <div className="col-sm-8">
              <label>Filter</label>
              <CategoryList default={this.state.category} handleChange={this.updateCategory}/>
            </div>
          </div>
        </div>
        <div className="col-sm-3">
          <div>
            <button className="btn btn-block btn-primary" onClick={this.save}>
              <i className="fa fa-save"></i>&nbsp;
              Save</button>
            <button className="btn btn-block btn-danger" onClick={this.props.hideForm}>
              <i className="fa fa-times"></i>&nbsp;
              Cancel</button>
          </div>
        </div>
      </div>
    )

    return (<Panel type="success" heading={heading}/>)
  }
}

MultipleForm.defaultProps = {
  multipleId: 0,
  electionId: 0,
  title: '',
  seatNumber: '2',
  category: 'everyone',
}

MultipleForm.propTypes = {
  id : PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  multipleId: PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  electionId: PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  title: PropTypes.string,
  seatNumber: PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  category: PropTypes.string,
  hideForm: PropTypes.func,
  reload: PropTypes.func,
}
