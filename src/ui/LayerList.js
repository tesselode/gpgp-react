import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import SidebarSection from './SidebarSection';

export default class LayerList extends Component {
	render() {
		return(<SidebarSection title='Layers'>
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
		</SidebarSection>);
	}
}
