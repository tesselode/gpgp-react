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
import TileLayer from '../../../data/layer/tile-layer';
import Level from '../../../data/level';
import Project from '../../../data/project';
import SidebarSection from './sidebar-section';

export interface Props {
	/** The project the level belongs to. */
	project: Project;
	/** The currently open level. */
	level: Level;
	/** The number of the selected layer. */
	selectedLayerIndex: number;
	/** Whether the selected layer should be shown on top. */
	showSelectedLayerOnTop: boolean;
	/** A function that is called when the show selected layer on top option is toggled. */
	onToggleShowSelectedLayerOnTop: () => void;
	/** A function that is called when a layer is clicked. */
	onSelectLayer: (layerIndex: number) => void;
	/** A function that adds a new level state to the history. */
	modifyLevel: (level: Level, description: string, continuedAction?: boolean) => void;
}

export interface State {
	/** Whether the "add layer" dropdown is open. */
	dropdownOpen: boolean;
}

/** A list of the layers in a level. */
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
					disabled={this.props.level.data.layers.length < 2}
					onClick={() => {
						const layer = this.props.level.data.layers[this.props.selectedLayerIndex];
						this.props.onSelectLayer(Math.min(this.props.selectedLayerIndex, this.props.level.data.layers.length - 2));
						this.props.modifyLevel(
							this.props.level.removeLayer(this.props.selectedLayerIndex),
							'Remove layer "' + layer.data.name + '"',
						);
					}}
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
							onClick={() => {
								this.props.onSelectLayer(Math.max(this.props.selectedLayerIndex, 0));
								this.props.modifyLevel(
									this.props.level.addGeometryLayer(),
									'Add geometry layer',
								);
							}}
						>
							Geometry
						</DropdownItem>
						{this.props.project.data.tilesets.map((tileset, i) =>
							<DropdownItem
								key={i}
								onClick={() => {
									this.props.onSelectLayer(Math.max(this.props.selectedLayerIndex, 0));
									this.props.modifyLevel(
										this.props.level.addTileLayer(tileset.data.name),
										'Add tile layer',
									);
								}}
							>
								Tile - {tileset.data.name}
							</DropdownItem>,
						)}
					</DropdownMenu>
				</ButtonDropdown>
				<Button
					id='moveLayerUpButton'
					size='sm'
					disabled={this.props.selectedLayerIndex === 0}
					onClick={() => {
						const layer = this.props.level.data.layers[this.props.selectedLayerIndex];
						this.props.onSelectLayer(this.props.selectedLayerIndex - 1);
						this.props.modifyLevel(
							this.props.level.moveLayerUp(this.props.selectedLayerIndex),
							'Move layer "' + layer.data.name + '" up',
						);
					}}
				>
					<Octicon icon={ArrowUp} />
				</Button>
				<Button
					id='moveLayerDownButton'
					size='sm'
					disabled={this.props.selectedLayerIndex === this.props.level.data.layers.length - 1}
					onClick={() => {
						const layer = this.props.level.data.layers[this.props.selectedLayerIndex];
						this.props.onSelectLayer(this.props.selectedLayerIndex + 1);
						this.props.modifyLevel(
							this.props.level.moveLayerDown(this.props.selectedLayerIndex),
							'Move layer "' + layer.data.name + '" down',
						);
					}}
				>
					<Octicon icon={ArrowDown} />
				</Button>
			</ButtonGroup>}
		>
			<ListGroup flush>
				{this.props.level.data.layers.map((layer, i) =>
					<ListGroupItem
						key={i}
						active={this.props.selectedLayerIndex === i}
						onClick={() => this.props.onSelectLayer(i)}
						className='compact-list-group-item'
					>
						<Navbar style={{padding: 0}}>
							{
								layer instanceof TileLayer ?
									layer.data.name + ' (Tile - ' + layer.data.tilesetName + ')' :
									layer.data.name + ' (Geometry)'
							}
							<Button
								id={'toggleLayerVisibilityButton' + i}
								outline={!layer.data.visible}
								color={this.props.selectedLayerIndex === i ? 'light' : 'dark'}
								size='sm'
								onClick={() => {
									const layer = this.props.level.data.layers[i];
									this.props.modifyLevel(
										this.props.level.setLayer(i, layer.toggleVisibility()),
										layer.data.visible ? 'Hide layer "' + layer.data.name + '"'
											: 'Show layer "' + layer.data.name + '"',
									);
								}}
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
