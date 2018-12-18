import React from 'react';
import Grid from './grid';

export default class App extends React.Component {
	public render() {
		return <Grid
			viewportWidth={window.innerWidth}
			viewportHeight={window.innerHeight}
			width={32}
			height={18}
		/>;
	}
}
