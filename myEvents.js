/***********************************Vacation Manager REST Node************************************/
/* Created By: Ido Dor																			 */
/* Assumptions: user would also want a GET functionality for member details and for date details */
/* i chose to provide those and documented it properly in Postman's publish						 */
/*************************************************************************************************/
const logger = require("./logger");
const Emitter = require('events');
const emitter = new Emitter.EventEmitter();

const InvalidPath = () => {
    logger.log('error', "invalid path");
}

const alreadyExists = () => {
    logger.log('error', "can't add item already exist");
}

const memberNotFound = () => {
    logger.log('error', "id not found in members.json");
}

const memberDidNotChoose = () => {
    logger.log('error', "member is not in the choices list");
}

const dateNotFound = () => {
    logger.log('error', "id not found in dates.json");
}

const emptyList = () => {
    logger.log('error', "list is empty");
}

const emptyResponse = () => {
    logger.log('info', "(Empty response)");
}

module.exports = emitter.on('callSuccess', (method) => {
    logger.log('info', `${method} Success!`);
});

module.exports = emitter.on('callFeedback', (feedbackMessage) => {
    logger.log('info', `Response: ${feedbackMessage}`);
});

module.exports = emitter.on('connectionMsg', (port) => {
    logger.log('info', `Listening on port ${port}`)
});
module.exports = emitter.on('callError', (param) => {
    switch (param) {
        case 'InvalidPath':
            InvalidPath();
            return;
        case 'alreadyExists':
            alreadyExists();
            return;
        case 'memberNotFound':
            memberNotFound();
            return;
        case 'memberDidNotChoose':
            memberDidNotChoose();
            return;
        case 'dateNotFound':
            dateNotFound();
            return;
        case 'emptyList':
            emptyList();
            return;
        case 'emptyResponse':
            emptyResponse();
            return;
        default:
            return;
    }
});