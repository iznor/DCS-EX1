/***********************************Vacation Manager REST Node************************************/
/* Created By: Ido Dor																			 */
/* Assumptions: user would also want a GET functionality for member details and for date details */
/* i chose to provide those and documented it properly in Postman's publish						 */
/*************************************************************************************************/
const http = require("http");
const trip = require("./trip.js");
const myEvents = require("./myEvents.js");
const port = 8080;
http.createServer(async (req, res) => {
	res.writeHead(200);
	let data = '';
	req.on('data', chunk => {
		data += chunk;
	})
	const logEvent = (param) => { myEvents.emit('callError', param); }
	let adr = new URL(`http://localhost:${port}${req.url}`);
	const { protocol, host, search } = adr;
	const queryPath = adr.pathname.valueOf();
	const method = req.method;
	let splitPath = queryPath.split('/');
	const responseModel = async () => {
		if (!splitPath[1] || splitPath.length > 3) {
			logEvent('InvalidPath');
			return;
		}
		switch (splitPath[1]) {
			case 'members':
				if (method == 'GET' && splitPath[2]) {
					if (!trip.getMember(splitPath[2])) {
						return;
					} else {
						myEvents.emit('callSuccess', method);
						return trip.getMember(splitPath[2]);
					}
				} else {
					logEvent('InvalidPath');
					return;
				}
			case 'dates':
				if (method == 'GET' && splitPath[2]) {
					if (!trip.getDate(splitPath[2])) {
						return;
					} else {
						myEvents.emit('callSuccess', method);
						return trip.getDate(splitPath[2]);
					}
				} else {
					logEvent('InvalidPath');
					return;
				}
			case 'choices':
				if (method == 'POST') {
					if (!splitPath[2]) {
						return new Promise((resolve) => {
							req.on('end', () => {
								let parsedObject = JSON.parse(data);
								let choice = parsedObject;
								if (trip.choices.find(x => x.memberId == choice.memberId)) {
									logEvent('alreadyExists');
									resolve('Fail!');
								} else if (!trip.getMember(choice.memberId)) {
									resolve('Fail!')
								} else if (!trip.getDate(choice.dateId)) {
									resolve('Fail!')
								} else {
									trip.choices.push(choice);
									myEvents.emit('callSuccess', method);
									resolve("Success!");
								}
							});
						});
					} else {
						logEvent('InvalidPath');
						return;
					}

				} else if (method == 'PUT') {
					return new Promise((resolve) => {
						req.on('end', () => {
							if (splitPath.length < 3 || !splitPath[2]) {
								logEvent('InvalidPath');
								resolve('Fail!');
							} else {
								let parsedObject = JSON.parse(data);
								let newDate = parsedObject.dateId;
								let index = trip.choices.findIndex(x => x.memberId == splitPath[2]);
								if (index === -1) {
									logEvent('memberDidNotChoose');
									resolve('Fail!');
								} else if (!trip.getDate(newDate)) {

									resolve('Fail!');
								} else {
									trip.choices[index].dateId = newDate;
									myEvents.emit('callSuccess', method);
									resolve("Success!");
								}
							}
						})
					})
				} else if (method == 'GET') {
					if (splitPath.length > 2 && !splitPath[2]) {
						logEvent('InvalidPath');
						return;
					}
					if (!trip.choices.length) {
						logEvent('emptyList');
						return;
					}
					let summary = [...trip.choices].map((value, index) => {
						const date = trip.getDate(value.dateId).date;
						const member = trip.getMember(value.memberId);
						return { ...member, date }
					})
					if (!splitPath[2]) {
						return summary;
					}
					//if id was specified - return specific choice of a member
					myEvents.emit('callSuccess', method);
					return summary.find(x => x.id == splitPath[2]).date;
				} else if (method == 'DELETE') {
					return new Promise((resolve) => {
						req.on('end', () => {
							if (splitPath.length < 3 || !splitPath[2]) {
								logEvent('InvalidPath');
								resolve('Fail!');
							} else {
								let index = trip.choices.findIndex(x => x.memberId == splitPath[2]);
								if (index === -1 && splitPath[2]) {
									logEvent('memberDidNotChoose');
									resolve('Fail!');
								} else {
									trip.choices.splice(index);
									myEvents.emit('callSuccess', method);
									resolve("Success!");
								}
							}
						})
					})
				}
				return;
			default:
				logEvent('InvalidPath');
				return;
		}
	}

	let stringResponse = JSON.stringify(await responseModel());
	if (stringResponse) {
		myEvents.emit('callFeedback', stringResponse);
		res.write(stringResponse);
	} else {
		logEvent('emptyResponse');
	}
	res.end();
}).listen(port);