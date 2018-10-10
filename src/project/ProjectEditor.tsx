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
import Project from '../data/Project';
import ValidatedInput from '../ui/ValidatedInput';
import ProjectSettingsEditor from './ProjectSettingsEditor';

export enum ProjectEditorTab {
	Settings,
	Tilesets,
}

export interface State {
	project: Project,
	activeTab: ProjectEditorTab;
	selectedTilesetIndex: number;
}

export default class ProjectEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			project: {
				tileSize: 16,
				defaultMapWidth: 16,
				defaultMapHeight: 9,
				maxMapWidth: 1000,
				maxMapHeight: 1000,
				tilesets: [],
			},
			selectedTilesetIndex: 0,
			activeTab: ProjectEditorTab.Settings,
		};
	}

	onTileSizeChanged(tileSize: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.tileSize = tileSize;
		this.setState({project: project});
	}

	onDefaultMapWidthChanged(defaultMapWidth: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.defaultMapWidth = defaultMapWidth;
		this.setState({project: project});
	}

	onDefaultMapHeightChanged(defaultMapHeight: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.defaultMapHeight = defaultMapHeight;
		this.setState({project: project});
	}

	onMaxMapWidthChanged(maxMapWidth: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.maxMapWidth = maxMapWidth;
		this.setState({project: project});
	}

	onMaxMapHeightChanged(maxMapHeight: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.maxMapHeight = maxMapHeight;
		this.setState({project: project});
	}

	onAddTileset() {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.tilesets.push({
			name: 'New tileset',
			imagePath: '',
		});
		this.setState({project: project});
	}

	onRemoveTileset(tilesetIndex: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.tilesets.splice(tilesetIndex, 1);
		this.setState({
			project: project,
			selectedTilesetIndex: Math.min(this.state.selectedTilesetIndex, project.tilesets.length - 1),
		});
	}

	onChangeTilesetName(tilesetIndex: number, name: string) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.tilesets[tilesetIndex].name = name;
		this.setState({project: project});
	}

	renderTilesetsTab() {
		let selectedTileset = this.state.project.tilesets[this.state.selectedTilesetIndex];
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
					{this.state.project.tilesets.map((tileset, i) =>
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
					<ProjectSettingsEditor
						project={this.state.project}
						onTileSizeChanged={this.onTileSizeChanged.bind(this)}
						onDefaultMapWidthChanged={this.onDefaultMapWidthChanged.bind(this)}
						onDefaultMapHeightChanged={this.onDefaultMapHeightChanged.bind(this)}
						onMaxMapWidthChanged={this.onMaxMapWidthChanged.bind(this)}
						onMaxMapHeightChanged={this.onMaxMapHeightChanged.bind(this)}
					/>
				</TabPane>
				<TabPane tabId={ProjectEditorTab.Tilesets}>
					{this.renderTilesetsTab()}
				</TabPane>
			</TabContent>
		</div>;
	}
}
