import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Level from '../data/Level';
import Project from '../data/Project';
import GridEditor from './GridEditor';
import HistoryManager from '../data/HistoryManager';
import LayerList from './sidebar/LayerList';
import HistoryBrowser from './sidebar/HistoryBrowser';

export interface State {
	levelHistory: HistoryManager<Level>;
	selectedLayerIndex: number;
	continuedAction: boolean;
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
			continuedAction: false,
		};
	}

	onPlace(x, y) {
		this.setState({
			levelHistory: this.state.levelHistory.do(level => {
				return {
					data: level.place(this.state.selectedLayerIndex, x, y),
					description: 'Place tiles',
				};
			}, this.state.continuedAction),
			continuedAction: true,
		});
	}
	
	onRemove(x, y) {
		this.setState({
			levelHistory: this.state.levelHistory.do(level => {
				return {
					data: level.remove(this.state.selectedLayerIndex, x, y),
					description: 'Remove tiles',
				};
			}, this.state.continuedAction),
			continuedAction: true,
		});
	}

	render() {
		return <Container fluid>
			<Row>
				<Col
					md={3}
					style={{
						maxHeight: '100vh',
						overflowY: 'auto',
						padding: '1em',
					}}
				>
					<LayerList
						level={this.state.levelHistory.current()}
						selectedLayerIndex={this.state.selectedLayerIndex}
						onSelectLayer={(layerIndex) => this.setState({selectedLayerIndex: layerIndex})}
					/>
					<HistoryBrowser
						historyManager={this.state.levelHistory}
					/>
				</Col>
				<Col md={9} style={{padding: '1em'}}>
					<GridEditor
						level={this.state.levelHistory.current()}
						onPlace={this.onPlace.bind(this)}
						onRemove={this.onRemove.bind(this)}
						onMouseUp={() => this.setState({continuedAction: false})}
					/>
				</Col>
			</Row>
		</Container>;
	}
}
