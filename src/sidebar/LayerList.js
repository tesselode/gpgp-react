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
					<DropdownToggle caret color='link' size='sm'>New...</DropdownToggle>
					<DropdownMenu>
						<DropdownItem
							style={{fontSize: '.875em'}}
							key='geometry'
							onClick={() => this.props.onGeometryLayerAdded()}
						>
							Geometry
						</DropdownItem>
						{this.props.tilesetNames.map((tilesetName, i) =>
							<DropdownItem
								style={{fontSize: '.875em'}}
								key={'tile' + i}
								onClick={() => this.props.onTileLayerAdded(tilesetName)}
							>
								Tile - {tilesetName}
							</DropdownItem>)}
					</DropdownMenu>
				</ButtonDropdown>
			}
		>
			<ListGroup flush>
				{this.props.layers.map((layer, i) =>
					<ListGroupItem
						active={this.props.selectedLayer === i}
						key={i}
						style={{padding: '.5em', fontSize: '.875em'}}
						onClick={() => this.props.onSelectLayer(i)}
					>
						{layer.type === 'tile' ?
							layer.name + ' (' + layer.type + ' - ' + layer.tilesetName + ')' :
							layer.name + ' (' + layer.type + ')'}
					</ListGroupItem>
				)}
			</ListGroup>
		</SidebarSection>);
	}
}
