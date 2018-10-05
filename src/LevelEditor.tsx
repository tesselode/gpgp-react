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
		this.state = {
			project: new Project(),
			level: new Level(),
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
