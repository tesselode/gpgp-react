import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Level from '../data/Level';
import Project from '../data/Project';
import Editor from './GridEditor';
import LayerList from './sidebar/LayerList';

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
		return <Container fluid>
			<Row>
				<Col md={3} style={{padding: '1em'}}>
					<LayerList
						level={this.state.level}
						selectedLayerIndex={this.state.selectedLayerIndex}
						onSelectLayer={(layerIndex) => this.setState({selectedLayerIndex: layerIndex})}
					/>
				</Col>
				<Col md={9} style={{padding: '1em'}}>
					<Editor
						project={this.state.project}
						level={this.state.level}
						onPlace={this.onPlace.bind(this)}
						onRemove={this.onRemove.bind(this)}
					/>
				</Col>
			</Row>
		</Container>;
	}
}
