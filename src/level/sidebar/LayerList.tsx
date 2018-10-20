import React from 'react';
import Level from '../../data/Level';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem } from 'reactstrap';
import SidebarSection from './SidebarSection';
import Octicon, { Plus } from '@githubprimer/octicons-react';

export interface Props {
	level: Level;
	selectedLayerIndex: number;
	onSelectLayer: (layerIndex: number) => void;
	onAddGeometryLayer: () => void;
}

export interface State {
	dropdownOpen: boolean;
}

export default class LayerList extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			dropdownOpen: false,
		};
	}

	render() {
		return <SidebarSection
			name='Layers'
			flush
			startExpanded
			headerContent={<ButtonDropdown
				isOpen={this.state.dropdownOpen}
				toggle={() => this.setState({dropdownOpen: !this.state.dropdownOpen})}
				>
				<DropdownToggle
					color='link'
					size='sm'
				>
					<Octicon icon={Plus} />
				</DropdownToggle>
				<DropdownMenu>
					<DropdownItem
						onClick={() => this.props.onAddGeometryLayer()}
					>
						Geometry
					</DropdownItem>
				</DropdownMenu>
			</ButtonDropdown>}
		>
			<ListGroup flush>
				{this.props.level.layers.map((layer, i) =>
					<ListGroupItem
						key={i}
						active={this.props.selectedLayerIndex === i}
						onClick={() => this.props.onSelectLayer(i)}
					>
						{layer.name + ' (' + layer.type + ')'}
					</ListGroupItem>
				)}
			</ListGroup>
		</SidebarSection>;
	}
}
