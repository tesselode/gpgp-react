import React from 'react';
import Level from '../../data/Level';
import {
	Button,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	ListGroup,
	ListGroupItem,
	Navbar,
	ButtonGroup,
	UncontrolledTooltip
} from 'reactstrap';
import SidebarSection from './SidebarSection';
import Octicon, { Plus, Eye } from '@githubprimer/octicons-react';
import Project from '../../data/Project';
import { isTileLayer } from '../../data/layer/TileLayer';

export interface Props {
	project: Project;
	level: Level;
	selectedLayerIndex: number;
	showSelectedLayerOnTop: boolean;
	onToggleShowSelectedLayerOnTop: () => void;
	onSelectLayer: (layerIndex: number) => void;
	onToggleLayerVisibility: (layerIndex: number) => void;
	onAddGeometryLayer: () => void;
	onAddTileLayer: (tilesetIndex: number) => void;
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
			headerContent={<ButtonGroup>
				<Button
					id='toggleShowSelectedLayerOnTopButton'
					size='sm'
					outline={!this.props.showSelectedLayerOnTop}
					onClick={() => this.props.onToggleShowSelectedLayerOnTop()}
				>
					<Octicon icon={Eye} />
				</Button>
				<UncontrolledTooltip
					delay={{show: 500, hide: 0}}
					target='toggleShowSelectedLayerOnTopButton'
				>
					Highlight selected layer
				</UncontrolledTooltip>
				<ButtonDropdown
					isOpen={this.state.dropdownOpen}
					toggle={() => this.setState({dropdownOpen: !this.state.dropdownOpen})}
					>
					<DropdownToggle
						id='addLayerButton'
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
						{this.props.project.tilesets.map((tileset, i) =>
							<DropdownItem
								key={i}
								onClick={() => this.props.onAddTileLayer(i)}
							>
								Tile - {tileset.name}
							</DropdownItem>
						)}
					</DropdownMenu>
				</ButtonDropdown>
				<UncontrolledTooltip
					delay={{show: 500, hide: 0}}
					target='addLayerButton'
				>
					Add layer...
				</UncontrolledTooltip>
			</ButtonGroup>}
		>
			<ListGroup flush>
				{this.props.level.layers.map((layer, i) =>
					<ListGroupItem
						key={i}
						active={this.props.selectedLayerIndex === i}
						onClick={() => this.props.onSelectLayer(i)}
						className='compact-list-group-item'
					>
						<Navbar style={{padding: 0}}>
							{
								isTileLayer(layer) ? layer.name + ' (' + layer.type + ' - ' + this.props.project.tilesets[layer.tilesetIndex].name + ')'
								: layer.name + ' (' + layer.type + ')'
							}
							<Button
								id={'toggleLayerVisibilityButton' + i}
								outline={!layer.visible}
								color={this.props.selectedLayerIndex === i ? 'light' : 'dark'}
								size='sm'
								onClick={() => this.props.onToggleLayerVisibility(i)}
							>
								<Octicon icon={Eye} />
							</Button>
							<UncontrolledTooltip
								delay={{show: 500, hide: 0}}
								target={'toggleLayerVisibilityButton' + i}
							>
								Toggle layer visibility
							</UncontrolledTooltip>
						</Navbar>
					</ListGroupItem>
				)}
			</ListGroup>
		</SidebarSection>;
	}
}