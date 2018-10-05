import React from 'react';
import Level from './data/Level';
import Project from './data/Project';
import Editor from './editor/Editor';

export interface State {
	project: Project,
	level: Level,
}

export default class LevelEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);

		let level = new Level();
		level.place(0, 0, 0);
		level.place(0, 1, 1);
		level.place(0, 1, 2);
		level.remove(0, 0, 0);

		this.state = {
			project: new Project(),
			level: level,
		}
	}

	render() {
		return <div>
			<Editor
				project={this.state.project}
				level={this.state.level}
			/>
		</div>;
	}
}
