const path = require('path');

module.exports = {
	entry: './assets/js/_main.js',
	output: {
		path: path.resolve(__dirname, 'assets/js/'),
		filename: 'main.min.js'
	}
}
