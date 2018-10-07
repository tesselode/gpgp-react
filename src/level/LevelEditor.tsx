import React from 'react';
import Level from '../data/Level';
import Project from '../data/Project';
import GridEditor from './GridEditor';

export interface State {
	level: Level;
}

export default class LevelEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			level: new Level(new Project(16), 16, 9)
				.place(0, 0, 0)
				.place(0, 1, 1)
				.place(0, 1, 2),
		};
	}

	render() {
		return <div>
			<GridEditor
				level={this.state.level}
			/>
		</div>;
	}
}
