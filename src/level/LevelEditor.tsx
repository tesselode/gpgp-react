import React from 'react';
import Level from '../data/Level';
import Project from '../data/Project';
import GridEditor from './GridEditor';
import HistoryManager from '../data/HistoryManager';

export interface State {
	levelHistory: HistoryManager<Level>;
	selectedLayerIndex: number;
}

export default class LevelEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			levelHistory: new HistoryManager<Level>([{
				data: new Level(new Project(16), 16, 9),
				description: 'New level',
			}]),
			selectedLayerIndex: 0,
		};
	}

	onPlace(x, y) {
		this.setState({levelHistory: this.state.levelHistory.do(level => {
			return {
				data: level.place(this.state.selectedLayerIndex, x, y),
				description: 'Place tiles',
			};
		})});
	}
	
	onRemove(x, y) {
		this.setState({levelHistory: this.state.levelHistory.do(level => {
			return {
				data: level.remove(this.state.selectedLayerIndex, x, y),
				description: 'Remove tiles',
			};
		})});
	}

	render() {
		return <div>
			<GridEditor
				level={this.state.levelHistory.current()}
				onPlace={this.onPlace.bind(this)}
				onRemove={this.onRemove.bind(this)}
			/>
		</div>;
	}
}
