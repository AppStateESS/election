'use strict'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Multiple from './Multiple.jsx'
import Referendum from './Referendum.jsx'
import Review from './Review.jsx'
import Countdown from './Countdown'
import SingleBallot from './SingleBallot'

/* global $ */

export default class Election extends Component {
  constructor(props) {
    super(props)
    this.state = {
      election: null,
      currentSingle: 0,
      currentMultiple: 0,
      currentReferendum: 0,
      single: [],
      multiple: [],
      referendum: [],
      ballotCount: 0,
      referendumCount: 0,
      stage: 'loading',
      singleVote: [],
      multipleVote: [],
      referendumVote: [],
      unqualified: [],
      qualified: null,
      backToReview: false,
      surveyLink: null,
      supportLink: null
    }
    this.updateMultipleVote = this.updateMultipleVote.bind(this)
    this.load = this.load.bind(this)
    this.setStage = this.setStage.bind(this)
    this.updateSingleVote = this.updateSingleVote.bind(this)
    this.updateReferendumVote = this.updateReferendumVote.bind(this)
    this.resetStage = this.resetStage.bind(this)
    this.finalVote = this.finalVote.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  load() {
    $.getJSON('election/User/Election', { command: 'list' }).done(function (
      data) {
      var stage = this.state.stage
      if(!data.election) {
        this.setStage('empty')
      } else if(data.hasVoted) {
        this.setState({ stage: 'finished', election: data.election })
      } else {
        var singleLength = data.single.length
        var multipleLength = data.multiple.length
        var referendumLength = data.referendum.length

        /* If there are no single-type elections, then skip to multiple type */
        if(singleLength === 0) {
          if(multipleLength === 0) {
            if(referendumLength === 0) {
              stage = 'empty'
            } else {
              stage = 'referendum'
            }
          } else {
            stage = 'multiple'
          }
        } else {
          stage = 'single'
        }
        var ballotCount = singleLength + multipleLength
        this.setState({
          stage: stage,
          hasVoted: data.hasVoted,
          election: data.election,
          single: data.single,
          multiple: data.multiple,
          referendum: data.referendum,
          ballotCount: ballotCount,
          referendumCount: referendumLength,
          unqualified: data.unqualified,
          supportLink: data.supportLink,
          qualified: data.qualified,
        })
      }

    }.bind(this))
  }

  setStage(stage) {
    window.scrollTo(0, 0)
    this.setState({ stage: stage })
  }

  getSingleKey(id) {
    var found = 0
    $.each(this.state.single, function (index, value) {
      if(id === value.id) {
        found = index
      }
    })
    return found
  }

  getMultipleKey(id) {
    var found = 0
    $.each(this.state.multiple, function (index, value) {
      if(id === value.id) {
        found = index
      }
    })
    return found
  }

  getReferendumKey(id) {
    var found = 0
    $.each(this.state.referendum, function (index, value) {
      if(id === value.id) {
        found = index
      }
    })
    return found
  }

  setCurrentSingle(id) {
    this.setState({ currentSingle: id })
  }

  setCurrentMultiple(id) {
    this.setState({ currentMultiple: id })
  }

  setCurrentReferendum(id) {
    this.setState({ currentReferendum: id })
  }

  resetStage(stage, id) {
    switch(stage) {
      case 'single':
        this.setCurrentSingle(this.getSingleKey(id))
        break

      case 'multiple':
        this.setCurrentMultiple(this.getMultipleKey(id))
        break

      case 'referendum':
        this.setCurrentReferendum(this.getReferendumKey(id))
        break
    }
    this.setState({ backToReview: true, stage: stage })
  }

  updateSingleVote(ticket) {
    let stage = this.state.stage
    const current = this.state.currentSingle
    const nextSingle = current + 1
    let singleVote = this.state.singleVote
    let currentVote = singleVote[current]
    currentVote = {
      single: this.state.single[this.state.currentSingle],
      ticket: ticket
    }
    singleVote[current] = currentVote

    if(this.state.backToReview) {
      stage = 'review'
    } else if(typeof this.state.single[nextSingle] === 'undefined') {
      stage = 'multiple'

      if(this.state.multiple.length > 0 || this.state.unqualified.length > 0) {
        stage = 'multiple'
      } else if(this.state.referendum.length > 0) {
        stage = 'referendum'
      } else {
        stage = 'review'
      }

    }
    window.scrollTo(0, 0)
    this.setState({ stage: stage, singleVote: singleVote, currentSingle: nextSingle })
  }

  updateMultipleVote(chairs) {
    var stage = this.state.stage
    var current = this.state.currentMultiple
    var nextMultiple = current + 1
    var multipleVote = this.state.multipleVote
    var currentVote = multipleVote[current]

    currentVote = {
      multiple: this.state.multiple[current],
      chairs: chairs
    }

    multipleVote[current] = currentVote

    window.scrollTo(0, 0)
    if(this.state.backToReview) {
      stage = 'review'
    } else if(typeof this.state.multiple[nextMultiple] === 'undefined') {
      if(this.state.referendum.length > 0) {
        stage = 'referendum'
      } else {
        stage = 'review'
      }
    }

    this.setState({ stage: stage, multipleVote: multipleVote, currentMultiple: nextMultiple })
  }

  updateReferendumVote(vote) {
    var stage = this.state.stage
    var current = this.state.currentReferendum
    var nextReferendum = current + 1
    var referendumVote = this.state.referendumVote
    var currentVote = referendumVote[current]

    currentVote = {
      referendum: this.state.referendum[current],
      answer: vote
    }

    referendumVote[current] = currentVote

    window.scrollTo(0, 0)
    if(this.state.backToReview) {
      stage = 'review'
    } else if(typeof this.state.referendum[nextReferendum] === 'undefined') {
      stage = 'review'
    }

    this.setState({
      stage: stage,
      referendumVote: referendumVote,
      currentReferendum: nextReferendum
    })
  }

  finalVote() {
    var singleResult = []
    $.each(this.state.singleVote, function (index, value) {
      if(value.single && typeof value.single.id !== 'undefined' && value.ticket &&
        typeof value.ticket.id !== 'undefined') {
        singleResult.push({
          singleId: value.single.id,
          ticketId: value.ticket
            .id
        })
      }
    })

    var multipleResult = []
    // do not record if no multiple to vote on
    if(this.state.multiple.length > 0) {
      $.each(this.state.multipleVote, function (index, value) {
        multipleResult.push({
          multipleId: value.multiple.id,
          chairs: value
            .chairs
        })
      })
    }

    var referendumResult = []
    $.each(this.state.referendumVote, function (index, value) {
      referendumResult.push({
        referendumId: value.referendum.id,
        answer: value
          .answer
      })
    })
    $.post('election/User/Vote', {
      command: 'save',
      electionId: this.state.election.id,
      single: singleResult,
      multiple: multipleResult,
      referendum: referendumResult
    }, null, 'json').done(function (data) {
      if(data.success === true) {
        this.setState({
          backToReview: false,
          stage: 'finished',
          surveyLink: data.surveyLink
        })
      } else {
        this.setState({ backToReview: false, stage: 'failure' })
      }
    }.bind(this)).fail(function () {
      this.setStage('failure')
    }.bind(this))
  }

  render() {
    var content = null
    var review = null

    if(this.state.backToReview) {
      review =
        <button
        className="btn btn-lg btn-block btn-info"
        onClick={this.setStage.bind(null, 'review')}>Return to review without saving</button>
    }

    switch(this.state.stage) {
      case 'loading':
        content =
          <div className="text-center pad-top">
          <i className="fa fa-spinner fa-spin fa-5x"></i>
        </div>
        break

      case 'empty':
        content = <Empty/>
        break

      case 'finished':
        content =
          <Finished election={this.state.election} surveyLink={this.state.surveyLink}/>
        break

      case 'single':
        content =
          <SingleBallot
          election={this.state.election}
          ballot={this.state.single[this.state.currentSingle]}
          updateVote={this.updateSingleVote}
          vote={this.state.singleVote}/>
        break

      case 'multiple':
        content =
          <Multiple
          election={this.state.election}
          ballot={this.state.multiple[this.state.currentMultiple]}
          updateVote={this.updateMultipleVote}
          vote={this.state.multipleVote}
          unqualified={this.state.unqualified}
          qualified={this.state.qualified}
          supportLink={this.state.supportLink}/>
        break

      case 'referendum':
        content =
          <Referendum
          election={this.state.election}
          referendum={this.state.referendum[this.state.currentReferendum]}
          updateVote={this.updateReferendumVote}
          vote={this.state.referendumVote}/>
        break

      case 'failure':
        content = <Failure/>
        break

      case 'review':
        review = null
        content =
          <Review
          election={this.state.election}
          single={this.state.single}
          multiple={this.state.multiple}
          referendum={this.state.referendum}
          singleVote={this.state.singleVote}
          multipleVote={this.state.multipleVote}
          referendumVote={this.state.referendumVote}
          finalVote={this.finalVote}
          resetStage={this.resetStage}/>
        break
    }

    var countdown = null

    if(this.state.stage === 'single' && this.state.singleVote.length === 0 &&
      this.state.multipleVote.length === 0 && this.state.referendumVote.length ===
      0) {
      countdown = (
        <Countdown
          ballotCount={this.state.ballotCount}
          referendumCount={this.state.referendumCount}/>
      )
    }

    return(
      <div>
        {countdown}
        {review}
        {content}
      </div>
    )
  }
}

const Empty = () => {
  return(
    <div>
      <h3>No elections are available. Please check back later.</h3>
    </div>
  )
}

const Finished = (props) => {
  return(
    <div className="row">
      <div className="col-sm-6 col-sm-offset-3">
        <div className="well text-center">
          <h2>{props.election.title}</h2>
          <h3>Thank you for voting! Check our website for results.</h3>
          <a
            href="./index.php?module=users&action=user&command=logout"
            className="btn btn-lg btn-primary">Sign out</a>
          <hr/>
          <p>What do you think about the voting process? <a href={props.surveyLink}>Let us know!</a>
          </p>
        </div>
      </div>
    </div>
  )
}

Finished.propTypes = {
  election: PropTypes.object,
  surveyLink: PropTypes.string
}

const Failure = () => {
  return(
    <div>
      <h2>Sorry</h2>
      <p>Your vote failed to register. Please try again or report the problem.</p>
    </div>
  )
}

ReactDOM.render(<Election/>, document.getElementById('election'))
