import React from 'react';
import Level from '../data/Level';
import Project from '../data/Project';

export interface State {
	level: Level;
}

export default class LevelEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			level: new Level(new Project(16), 16, 9),
		};
	}

	render() {
		console.log(this.state.level);
		return <div>hi!</div>;
	}
}
