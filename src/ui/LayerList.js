import React, { Component } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem } from 'reactstrap';
import SidebarSection from './SidebarSection';

export default class LayerList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dropdownOpen: false,
		};
	}

	render() {
		return(<SidebarSection
			title='Layers'
			flush
			headerContent={
				<ButtonDropdown
					isOpen={this.state.dropdownOpen}
					toggle={() => this.setState({dropdownOpen: !this.state.dropdownOpen})}
				>
					<DropdownToggle color='light' size='sm'>+</DropdownToggle>
					<DropdownMenu>
						<DropdownItem>Geometry</DropdownItem>
						<DropdownItem>Tile</DropdownItem>
					</DropdownMenu>
				</ButtonDropdown>
			}
		>
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
