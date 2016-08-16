let electionTypes = {};
let categoryTypes = {};

let getElectionTypes = function() {
    $.getJSON('election/Admin/Election', {
    	command : 'getElectionTypes'
    }).done(function(data){
        electionTypes = data;
        sortCategoryTypes();
    }.bind(this));
};

$(document).ready(function(){
    getElectionTypes();
});

let sortCategoryTypes = function() {
    electionTypes.electionTypes.forEach(function(value){
        value.subcategory.forEach(function(subval){
            categoryTypes[subval.type] = subval.name;
        });
    });
};

export {electionTypes, categoryTypes};
