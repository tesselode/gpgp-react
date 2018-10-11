import React from 'react';
import {
	Nav,
	NavItem,
	NavLink,
	TabPane,
	TabContent,
} from 'reactstrap';
import Project from '../data/Project';
import ProjectSettingsEditor from './ProjectSettingsEditor';
import ProjectTilesetsEditor from './ProjectTilesetsEditor';

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

	onChangeTileSize(tileSize: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.tileSize = tileSize;
		this.setState({project: project});
	}

	onChangeDefaultMapWidth(defaultMapWidth: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.defaultMapWidth = defaultMapWidth;
		this.setState({project: project});
	}

	onChangeDefaultMapHeight(defaultMapHeight: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.defaultMapHeight = defaultMapHeight;
		this.setState({project: project});
	}

	onChangeMaxMapWidth(maxMapWidth: number) {
		let project: Project = JSON.parse(JSON.stringify(this.state.project));
		project.maxMapWidth = maxMapWidth;
		this.setState({project: project});
	}

	onChangeMaxMapHeight(maxMapHeight: number) {
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
						onChangeTileSize={this.onChangeTileSize.bind(this)}
						onChangeDefaultMapWidth={this.onChangeDefaultMapWidth.bind(this)}
						onChangeDefaultMapHeight={this.onChangeDefaultMapHeight.bind(this)}
						onChangeMaxMapWidth={this.onChangeMaxMapWidth.bind(this)}
						onChangeMaxMapHeight={this.onChangeMaxMapHeight.bind(this)}
					/>
				</TabPane>
				<TabPane tabId={ProjectEditorTab.Tilesets}>
					<ProjectTilesetsEditor
						project={this.state.project}
						selectedTilesetIndex={this.state.selectedTilesetIndex}
						onAddTileset={this.onAddTileset.bind(this)}
						onRemoveTileset={this.onRemoveTileset.bind(this)}
						onChangeTilesetName={this.onChangeTilesetName.bind(this)}
						onSelectTileset={tilesetIndex => this.setState({selectedTilesetIndex: tilesetIndex})}
					/>
				</TabPane>
			</TabContent>
		</div>;
	}
}
