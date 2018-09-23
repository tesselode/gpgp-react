import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

class LayerList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			layers: [
				{name: 'Entities'},
				{name: 'Geometry'},
				{name: 'Foreground Tiles'},
				{name: 'Background Tiles'},
			],
			activeLayer: 1,
		};
	}

	render() {
		return(
			<ListGroup>
				{this.state.layers.map((layer, i) =>
					<ListGroupItem
						action
						active={this.state.activeLayer === i}
						onClick={() => this.setState({activeLayer: i})}
						key={i}
					>
						{layer.name}
					</ListGroupItem>
				)}
			</ListGroup>
		);
	}
}

export default LayerList;
