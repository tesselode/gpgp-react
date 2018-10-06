import React from 'react';
import Level from './data/Level';
import Project from './data/Project';
import Editor from './editor/Editor';

export interface State {
	project: Project,
	level: Level,
	selectedLayerIndex: number,
}

export default class LevelEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			project: new Project(),
			level: new Level(),
			selectedLayerIndex: 0,
		}
	}

	onPlace(x, y) {
		this.state.level.place(this.state.selectedLayerIndex, x, y);
	}

	onRemove(x, y) {
		this.state.level.remove(this.state.selectedLayerIndex, x, y);
	}

	render() {
		return <div>
			<Editor
				project={this.state.project}
				level={this.state.level}
				onPlace={this.onPlace.bind(this)}
				onRemove={this.onRemove.bind(this)}
			/>
		</div>;
	}
}
