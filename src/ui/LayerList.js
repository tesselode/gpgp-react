import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

class LayerList extends Component {
	render() {
		return(
			<ListGroup>
				{this.props.layers.map((layer, i) =>
					<ListGroupItem
						action
						active={this.props.selectedLayer === i}
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
