const path = require('path');

module.exports = {
	entry: './src/index.tsx',
	mode: 'development',
	devtool: 'inline-source-map',
	target: 'electron-renderer',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js', '.css' ]
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist')
	},
	performance: {
		hints: false,
	},
};
