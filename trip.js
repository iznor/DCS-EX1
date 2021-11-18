/***********************************Vacation Manager REST Node************************************/
/* Created By: Ido Dor																			 */
/* Assumptions: user would also want a GET functionality for member details and for date details */
/* i chose to provide those and documented it properly in Postman's publish						 */
/*************************************************************************************************/
const dates = require("./data/dates.json");
const members = require("./data/members.json");
const myEvents = require("./myEvents.js");
const errEvent = (param) => { myEvents.emit('callError', param); }

let choices = [];

const getDate = (id) => {
    const element = dates.find(x => x.id == id)
    if (element)
        return element;
    else
        errEvent('dateNotFound');
    return element;
}

const getMember = (id) => {
    const element = members.find(x => x.id == id)
    if (element)
        return element;
    else
        errEvent('memberNotFound');
    return element;
    // return `id ${id} does not exist`;            
}

module.exports.getDate = getDate;
module.exports.getMember = getMember;
module.exports.choices = choices;