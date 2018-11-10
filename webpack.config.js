const path = require('path');
const SimpleProgressWebpackPlugin = require( 'simple-progress-webpack-plugin' );

module.exports = {
	entry: './src/index.tsx',
	mode: 'development',
	devtool: 'inline-source-map',
	target: 'electron-renderer',
	resolve: {
		extensions: [ '.tsx', '.ts', '.js', '.css', '.sass' ]
	},
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
			{
				test: /\.scss$/,
				use: [
					"style-loader", // creates style nodes from JS strings
					"css-loader", // translates CSS into CommonJS
					"sass-loader" // compiles Sass to CSS, using Node Sass by default
				]
			},
		]
	},
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
	performance: {
		hints: false,
	},
	plugins: [
		new SimpleProgressWebpackPlugin(),
	],
	stats: 'minimal',
};
