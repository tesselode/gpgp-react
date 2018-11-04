import Octicon, { Eye, Plus, Trashcan, ArrowUp, ArrowDown } from '@githubprimer/octicons-react';
import React from 'react';
import {
	Button,
	ButtonDropdown,
	ButtonGroup,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	ListGroup,
	ListGroupItem,
	Navbar,
	UncontrolledTooltip,
} from 'reactstrap';
import { newGeometryLayer } from '../../../data/layer/geometry-layer';
import { isTileLayer, newTileLayer } from '../../../data/layer/tile-layer';
import Level from '../../../data/level';
import Project from '../../../data/project';
import SidebarSection from './sidebar-section';
import { shiftUp, shiftDown } from '../../../util';

export interface Props {
	project: Project;
	level: Level;
	selectedLayerIndex: number;
	showSelectedLayerOnTop: boolean;
	onToggleShowSelectedLayerOnTop: () => void;
	onSelectLayer: (layerIndex: number) => void;
	modifyLevel: (f: (level: Level) => string | false, continuedAction?: boolean) => void;
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

	public render() {
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
				<Button
					id='removeLayerButton'
					size='sm'
					disabled={this.props.level.layers.length < 2}
					onClick={() => this.props.modifyLevel(level => {
						const layer = level.layers[this.props.selectedLayerIndex];
						level.layers.splice(this.props.selectedLayerIndex, 1);
						return 'Remove layer "' + layer.name + '"';
					})}
				>
					<Octicon icon={Trashcan} />
				</Button>
				<UncontrolledTooltip
					delay={{show: 500, hide: 0}}
					target='removeLayerButton'
				>
					Remove selected layer
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
							onClick={() => this.props.modifyLevel(level => {
								level.layers.splice(this.props.selectedLayerIndex, 0, newGeometryLayer());
								return 'Add geometry layer';
							})}
						>
							Geometry
						</DropdownItem>
						{this.props.project.tilesets.map((tileset, i) =>
							<DropdownItem
								key={i}
								onClick={() => this.props.modifyLevel(level => {
									level.layers.splice(this.props.selectedLayerIndex, 0, newTileLayer(i));
									return 'Add tile layer';
								})}
							>
								Tile - {tileset.name}
							</DropdownItem>,
						)}
					</DropdownMenu>
				</ButtonDropdown>
				<UncontrolledTooltip
					delay={{show: 500, hide: 0}}
					target='addLayerButton'
				>
					Add layer...
				</UncontrolledTooltip>
				<Button
					id='moveLayerUpButton'
					size='sm'
					disabled={this.props.selectedLayerIndex === 0}
					onClick={() => this.props.modifyLevel(level => {
						const layer = level.layers[this.props.selectedLayerIndex];
						shiftUp(level.layers, this.props.selectedLayerIndex);
						return 'Move layer "' + layer.name + '" up';
					})}
				>
					<Octicon icon={ArrowUp} />
				</Button>
				<UncontrolledTooltip
					delay={{show: 500, hide: 0}}
					target='moveLayerUpButton'
				>
					Move selected layer up
				</UncontrolledTooltip>
				<Button
					id='moveLayerDownButton'
					size='sm'
					disabled={this.props.selectedLayerIndex === this.props.level.layers.length - 1}
					onClick={() => this.props.modifyLevel(level => {
						const layer = level.layers[this.props.selectedLayerIndex];
						shiftDown(level.layers, this.props.selectedLayerIndex);
						return 'Move layer "' + layer.name + '" down';
					})}
				>
					<Octicon icon={ArrowDown} />
				</Button>
				<UncontrolledTooltip
					delay={{show: 500, hide: 0}}
					target='moveLayerDownButton'
				>
					Move selected layer down
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
								isTileLayer(layer) ? layer.name + ' (' + layer.type + ' - ' +
									this.props.project.tilesets[layer.tilesetIndex].name + ')'
								: layer.name + ' (' + layer.type + ')'
							}
							<Button
								id={'toggleLayerVisibilityButton' + i}
								outline={!layer.visible}
								color={this.props.selectedLayerIndex === i ? 'light' : 'dark'}
								size='sm'
								onClick={() => this.props.modifyLevel(level => {
									const layer = level.layers[i];
									layer.visible = !layer.visible;
									return layer.visible ? 'Show layer "' + layer.name + '"'
										: 'Hide layer "' + layer.name + '"';
								})}
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
					</ListGroupItem>,
				)}
			</ListGroup>
		</SidebarSection>;
	}
}
