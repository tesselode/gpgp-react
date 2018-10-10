import React from 'react';
import {
	Row,
	Col,
	Navbar,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	TabPane,
	TabContent,
	Form,
	ButtonGroup,
	Button,
	ListGroup,
	ListGroupItem,
	FormGroup,
	Label,
	InputGroup,
	InputGroupAddon,
	Input,
} from 'reactstrap';
import Octicon, { Plus, Trashcan, FileDirectory } from '@githubprimer/octicons-react';
import Tileset from '../data/Tileset';
import ValidatedInput from '../ui/ValidatedInput';

export enum ProjectEditorTab {
	Settings,
	Tilesets,
}

export interface State {
	tileSize: number;
	defaultMapWidth: number;
	defaultMapHeight: number;
	maxMapWidth: number;
	maxMapHeight: number;
	tilesets: Array<Tileset>;
	selectedTilesetIndex: number;
	activeTab: ProjectEditorTab;
}

function isValidSize(size: number) {
	return size !== NaN && size > 0;
}

export default class ProjectEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			tileSize: 16,
			defaultMapWidth: 16,
			defaultMapHeight: 9,
			maxMapWidth: 1000,
			maxMapHeight: 1000,
			tilesets: [],
			selectedTilesetIndex: 0,
			activeTab: ProjectEditorTab.Settings,
		};
	}

	onAddTileset() {
		let tilesets: Array<Tileset> = JSON.parse(JSON.stringify(this.state.tilesets));
		tilesets.push({
			name: 'New tileset',
			imagePath: '',
		});
		this.setState({tilesets: tilesets});
	}

	onRemoveTileset(tilesetIndex: number) {
		let tilesets: Array<Tileset> = JSON.parse(JSON.stringify(this.state.tilesets));
		tilesets.splice(tilesetIndex, 1);
		this.setState({
			tilesets: tilesets,
			selectedTilesetIndex: Math.min(this.state.selectedTilesetIndex, tilesets.length - 1),
		});
	}

	onChangeTilesetName(tilesetIndex: number, name: string) {
		let tilesets: Array<Tileset> = JSON.parse(JSON.stringify(this.state.tilesets));
		tilesets[tilesetIndex].name = name;
		this.setState({tilesets: tilesets});
	}

	renderSettingsTab() {
		return <Form>
			<ValidatedInput
				label='Tile size'
				type='number'
				value={this.state.tileSize}
				isValid={value => isValidSize(value)}
				onChange={(tileSize) => this.setState({tileSize: tileSize})}
				units='pixels'
				errorMessage='Tile size must be 1 pixel or greater'
			/>
			<ValidatedInput
				label='Default map width'
				type='number'
				value={this.state.defaultMapWidth}
				isValid={value => isValidSize(value)}
				onChange={(defaultMapWidth) => this.setState({defaultMapWidth: defaultMapWidth})}
				units='tiles'
				errorMessage='Default map width must be 1 tile or greater'
			/>
			<ValidatedInput
				label='Default map height'
				type='number'
				value={this.state.defaultMapHeight}
				isValid={value => isValidSize(value)}
				onChange={(defaultMapHeight) => this.setState({defaultMapHeight: defaultMapHeight})}
				units='tiles'
				errorMessage='Default map height must be 1 tile or greater'
			/>
			<ValidatedInput
				label='Max map width'
				type='number'
				value={this.state.maxMapWidth}
				isValid={value => isValidSize(value)}
				onChange={(maxMapWidth) => this.setState({maxMapWidth: maxMapWidth})}
				units='tiles'
				errorMessage='Max map width must be 1 tile or greater'
			/>
			<ValidatedInput
				label='Max map height'
				type='number'
				value={this.state.maxMapHeight}
				isValid={value => isValidSize(value)}
				onChange={(maxMapHeight) => this.setState({maxMapHeight: maxMapHeight})}
				units='tiles'
				errorMessage='Max map height must be 1 tile or greater'
			/>
		</Form>;
	}

	renderTilesetsTab() {
		let selectedTileset = this.state.tilesets[this.state.selectedTilesetIndex];
		return <Row>
			<Col md={4}>
				<Navbar color='light'>
					<NavbarBrand>Tilesets</NavbarBrand>
					<ButtonGroup>
						<Button
							onClick={() => this.onRemoveTileset(this.state.selectedTilesetIndex)}
						>
							<Octicon icon={Trashcan}/>
						</Button>
						<Button
							onClick={() => this.onAddTileset()}
						>
							<Octicon icon={Plus}/>
						</Button>
					</ButtonGroup>
				</Navbar>
				<ListGroup flush>
					{this.state.tilesets.map((tileset, i) =>
						<ListGroupItem
							active={i === this.state.selectedTilesetIndex}
							onClick={() => this.setState({selectedTilesetIndex: i})}
						>
							{tileset.name}
						</ListGroupItem>)
					}
				</ListGroup>
			</Col>
			{selectedTileset && <Col md={8}>
				<Form>
					<ValidatedInput
						label='Tileset name'
						value={selectedTileset.name}
						isValid={(value) => true}
						onChange={(value) => this.onChangeTilesetName(this.state.selectedTilesetIndex, value)}
					/>
					<FormGroup row>
						<Label md={2}>Image path</Label>
						<Col md={10}>
							<InputGroup>
								<InputGroupAddon addonType='append'>
									<Button>
										<Octicon icon={FileDirectory} />
									</Button>
								</InputGroupAddon>
								<Input
									disabled
								/>
							</InputGroup>
						</Col>
					</FormGroup>
				</Form>
			</Col>}
		</Row>
	}

	render() {
		return <div>
			<Nav tabs>
				<NavItem>
					<NavLink
						active={this.state.activeTab === ProjectEditorTab.Settings}
						onClick={() => this.setState({activeTab: ProjectEditorTab.Settings})}
					>
						Settings
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						active={this.state.activeTab === ProjectEditorTab.Tilesets}
						onClick={() => this.setState({activeTab: ProjectEditorTab.Tilesets})}
					>
						Tilesets
					</NavLink>
				</NavItem>
			</Nav>
			<TabContent
				activeTab={this.state.activeTab}
				style={{padding: '1em'}}
			>
				<TabPane tabId={ProjectEditorTab.Settings}>
					{this.renderSettingsTab()}
				</TabPane>
				<TabPane tabId={ProjectEditorTab.Tilesets}>
					{this.renderTilesetsTab()}
				</TabPane>
			</TabContent>
		</div>;
	}
}
