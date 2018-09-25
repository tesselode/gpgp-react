import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, Collapse, ListGroup, ListGroupItem } from 'reactstrap';

class LayerList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: true,
		};
	}

	render() {
		return(<Card>
			<CardHeader
				onClick={() => this.setState({expanded: !this.state.expanded})}
				style={{
					padding: '0',
					cursor: 'pointer',
				}}
			>
				<Button color='link'>Layers</Button>
			</CardHeader>
			<Collapse isOpen={this.state.expanded} style={{transition: '.15s'}}>
				<CardBody style={{padding: '0'}}>
					<ListGroup flush>
						{this.props.layers.map((layer, i) =>
							<ListGroupItem
								action
								active={this.props.selectedLayer === i}
								key={i}
								style={{padding: '.5em'}}
								onClick={() => this.props.onSelectLayer(i)}
							>
								{layer.name + ' (' + layer.type + ')'}
							</ListGroupItem>
						)}
					</ListGroup>
				</CardBody>
			</Collapse>
		</Card>);
	}
}

export default LayerList;
