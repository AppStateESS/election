'use strict';

var BreakIt = function(text) {
    if (typeof text === 'undefined') {
        throw 'BreakIt text parameter is undefined';
    }
    var broken = text.split("\n").map(function(item, i) {
        return (
            <span key={i}>{item}
                <br/>
            </span>
        );
    });
    return broken;
}


var AbstainButton = function(props) {
    return (
        <div className="btn btn-warning btn-lg" onClick={props.handleClick}>
            Abstain from {props.title} <i className="fa fa-arrow-right"></i>
        </div>
    );
}
