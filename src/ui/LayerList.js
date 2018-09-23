import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

class LayerList extends Component {
	render() {
		return(<div>
			<h5>Layers</h5>
			<hr />
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
		</div>);
	}
}

export default LayerList;
