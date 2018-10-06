import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Level from '../data/Level';
import Project from '../data/Project';
import Editor from './GridEditor';
import LayerList from './sidebar/LayerList';
import HistoryManager, { HistoryStep } from '../data/HistoryManager';

export interface State {
	project: Project,
	levelHistory: HistoryManager<Level>,
	selectedLayerIndex: number,
}

export default class LevelEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			project: new Project(),
			levelHistory: new HistoryManager<Level>([new HistoryStep<Level>(new Level(), 'New level')]),
			selectedLayerIndex: 0,
		}
	}

	onPlace(x, y) {
		this.setState({
			levelHistory: this.state.levelHistory.do((level: Level) => {
				level.place(this.state.selectedLayerIndex, x, y);
				return 'Place tiles';
			}),
		});
	}

	onRemove(x, y) {
		this.setState({
			levelHistory: this.state.levelHistory.do((level: Level) => {
				level.remove(this.state.selectedLayerIndex, x, y);
				return 'Remove tiles';
			}),
		});
	}

	render() {
		return <Container fluid>
			<Row>
				<Col md={3} style={{padding: '1em'}}>
					<LayerList
						level={this.state.levelHistory.current()}
						selectedLayerIndex={this.state.selectedLayerIndex}
						onSelectLayer={(layerIndex) => this.setState({selectedLayerIndex: layerIndex})}
					/>
				</Col>
				<Col md={9} style={{padding: '1em'}}>
					<Editor
						project={this.state.project}
						level={this.state.levelHistory.current()}
						onPlace={this.onPlace.bind(this)}
						onRemove={this.onRemove.bind(this)}
					/>
				</Col>
			</Row>
		</Container>;
	}
}
