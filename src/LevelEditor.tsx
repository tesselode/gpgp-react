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
		let level = this.state.level.clone();
		level.place(this.state.selectedLayerIndex, x, y);
		this.setState({level: level});
	}

	onRemove(x, y) {
		let level = this.state.level.clone();
		level.remove(this.state.selectedLayerIndex, x, y);
		this.setState({level: level});
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
