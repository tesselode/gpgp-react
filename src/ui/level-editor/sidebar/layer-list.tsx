import Octicon, { ArrowDown, ArrowUp, Eye, Plus, Trashcan } from '@githubprimer/octicons-react';
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
} from 'reactstrap';
import { newGeometryLayer } from '../../../data/layer/geometry-layer';
import { isTileLayer, newTileLayer } from '../../../data/layer/tile-layer';
import Level from '../../../data/level';
import Project from '../../../data/project';
import { shiftDown, shiftUp } from '../../../util';
import SidebarSection from './sidebar-section';

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
				<Button
					id='removeLayerButton'
					size='sm'
					disabled={this.props.level.layers.length < 2}
					onClick={() => this.props.modifyLevel(level => {
						const layer = level.layers[this.props.selectedLayerIndex];
						level.layers.splice(this.props.selectedLayerIndex, 1);
						this.props.onSelectLayer(Math.min(this.props.selectedLayerIndex, level.layers.length - 1));
						return 'Remove layer "' + layer.name + '"';
					})}
				>
					<Octicon icon={Trashcan} />
				</Button>
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
								this.props.onSelectLayer(Math.max(this.props.selectedLayerIndex, 0));
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
									this.props.onSelectLayer(Math.max(this.props.selectedLayerIndex, 0));
									return 'Add tile layer';
								})}
							>
								Tile - {tileset.name}
							</DropdownItem>,
						)}
					</DropdownMenu>
				</ButtonDropdown>
				<Button
					id='moveLayerUpButton'
					size='sm'
					disabled={this.props.selectedLayerIndex === 0}
					onClick={() => this.props.modifyLevel(level => {
						const layer = level.layers[this.props.selectedLayerIndex];
						shiftUp(level.layers, this.props.selectedLayerIndex);
						this.props.onSelectLayer(this.props.selectedLayerIndex - 1);
						return 'Move layer "' + layer.name + '" up';
					})}
				>
					<Octicon icon={ArrowUp} />
				</Button>
				<Button
					id='moveLayerDownButton'
					size='sm'
					disabled={this.props.selectedLayerIndex === this.props.level.layers.length - 1}
					onClick={() => this.props.modifyLevel(level => {
						const layer = level.layers[this.props.selectedLayerIndex];
						shiftDown(level.layers, this.props.selectedLayerIndex);
						this.props.onSelectLayer(this.props.selectedLayerIndex + 1);
						return 'Move layer "' + layer.name + '" down';
					})}
				>
					<Octicon icon={ArrowDown} />
				</Button>
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
						</Navbar>
					</ListGroupItem>,
				)}
			</ListGroup>
		</SidebarSection>;
	}
}
