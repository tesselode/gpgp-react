const path = require('path');

module.exports = {
	entry: './src/index.tsx',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js', '.css' ]
	},
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
	performance: {
		hints: false,
	}
};
