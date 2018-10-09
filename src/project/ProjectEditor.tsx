import React from 'react';
import {
	Nav,
	NavItem,
	NavLink,
	TabPane,
	TabContent,
} from 'reactstrap';
import ProjectSettingsEditor from './ProjectSettingsEditor';

export enum ProjectEditorTab {
	Settings,
	Tilesets,
}

export interface State {
	activeTab: ProjectEditorTab;
}

export default class ProjectEditor extends React.Component<{}, State> {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: ProjectEditorTab.Settings,
		};
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
					<ProjectSettingsEditor />
				</TabPane>
				<TabPane tabId={ProjectEditorTab.Tilesets}>
				</TabPane>
			</TabContent>
		</div>;
	}
}
