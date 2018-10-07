import React from 'react';
import Level from '../data/Level';
import Project from '../data/Project';
import GridEditor from './GridEditor';

export interface State {
	level: Level;
	selectedLayerIndex: number;
}

export default class LevelEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			level: new Level(new Project(16), 16, 9),
			selectedLayerIndex: 0,
		};
	}

	onPlace(x, y) {
		let level = this.state.level.place(this.state.selectedLayerIndex, x, y);
		this.setState({level: level});
	}
	
	onRemove(x, y) {
		let level = this.state.level.remove(this.state.selectedLayerIndex, x, y);
		this.setState({level: level});
	}

	render() {
		return <div>
			<GridEditor
				level={this.state.level}
				onPlace={this.onPlace.bind(this)}
				onRemove={this.onRemove.bind(this)}
			/>
		</div>;
	}
}
