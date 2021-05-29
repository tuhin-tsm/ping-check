const moment = require('moment');
const fetch = require('node-fetch');
const chalk = require('chalk');
const Image = require('ascii-art-image');

const url = 'https://google.com';
var image = new Image({
    filepath: __dirname + `\\router.jpg`,
    alphabet: 'binary',
    width: 80
});
 
image.write(function(err, rendered){
    console.log(rendered);

    // 
    renderPingDetails();
})

let isLastFailed = false;
let lastFailedDate = moment();

const intervalSecond = 1;


function renderPingDetails() {
	console.log(chalk.bgMagenta('Fetching start at ' + lastFailedDate.format('dddd, MMMM Do, YYYY h:mma')));
	console.log(chalk.cyan(`Fetching google.com every ${intervalSecond} second${intervalSecond > 1 ? 's' : ''}`));

	setInterval(async () => {
		try {
			const response = await fetch(url);

			if (isLastFailed) {
				const currentDate = moment();
				console.log(chalk`{yellow [${currentDate.format('dddd, MMMM Do, YYYY h:mma')}]} Back to {green online} after ${prepareAfter(currentDate)}`);
			}

			isLastFailed = false
		} catch(e) {
			if (!isLastFailed) {
				const currentDate = moment();
				console.log(chalk`{yellow [${currentDate.format('dddd, MMMM Do, YYYY h:mma')}]} {red Offline} after ${prepareAfter(currentDate)} of being online`);
				// 
				lastFailedDate = currentDate;
			}

			isLastFailed = true
		};
	}, intervalSecond * 1000);
}

function prepareAfter(currentDate) {
	const diff = currentDate.diff(lastFailedDate);
	const duration = moment.duration(diff);
	const durationInHours = duration.hours();
	const durationInMinutes = duration.minutes();
	const durationInSeconds = duration.seconds();

	let failedAfter = '';
	if (durationInHours) {
		failedAfter = `${durationInHours} hour${durationInHours > 1 ? 's' : ''}`;
	} else if (durationInMinutes) {
		failedAfter += `${durationInMinutes} minute${durationInMinutes > 1 ? 's' : ''}`;
	} else {
		failedAfter += `${durationInSeconds} second${durationInSeconds > 1 ? 's' : ''}`;
	}

	return failedAfter;
}