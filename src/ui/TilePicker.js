import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, Collapse } from 'reactstrap';
import Editor from '../editor/Editor';

export default class TilePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: true,
		};
	}

	render() {
		var tileset = this.props.project.tilesets[this.props.tileset];

		return(<Card>
			<CardHeader
				onClick={() => this.setState({expanded: !this.state.expanded})}
				style={{
					padding: '0',
					cursor: 'pointer',
				}}
			>
				<Button color='link'>Tiles ({this.props.tileset})</Button>
			</CardHeader>
			<Collapse isOpen={this.state.expanded} style={{transition: '.15s'}}>
				<CardBody style={{padding: '0'}}>
					<Editor
						width='22.5vw'
						height='33vh'
						startingZoom={.5}
						mapWidth={tileset.imageWidth / tileset.tileSize}
						mapHeight={tileset.imageHeight / tileset.tileSize}
						project={this.props.project}
						layers={[
							{
								name: 'Tileset',
								type: 'tilePreview',
								tileset: this.props.tileset,
							},
						]}
						onPlace={() => {}}
						onRemove={() => {}}
					/>
				</CardBody>
			</Collapse>
		</Card>);
	}
}
