import React, { Component } from 'react';
import { Button, Nav, NavItem, NavLink, TabContent, TabPane, Jumbotron, Row, Col } from 'reactstrap';
import Octicon, { Plus } from '@githubprimer/octicons-react';
import LevelEditor from './level/LevelEditor';
import ProjectEditor from './project/ProjectEditor';
const fs = window.require('fs');
const { dialog } = window.require('electron').remote;

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabs: [],
			selectedTabIndex: 0,
		};
	}

	newProject() {
		let tab = {title: 'New project'};
		tab.content = <ProjectEditor
			onChangeTabTitle={(title) => tab.title = title}
		/>;
		this.setState({
			tabs: this.state.tabs.concat(tab),
		});
	}

	openProject() {
		let path = dialog.showOpenDialog();
		if (path) {
			fs.readFile(path[0], (error, data) => {
				if (error)
					dialog.showErrorBox('Error opening project', 'The project could not be opened.')
				else {
					let tab = {title: 'Open project'};
					tab.content = <ProjectEditor
						onChangeTabTitle={(title) => tab.title = title}
						project={JSON.parse(data)}
						projectFilePath={path[0]}
					/>;
					this.setState({
						tabs: this.state.tabs.concat(tab),
					});
				}
			})
		}
	}

	render() {
		return this.state.tabs.length > 0 ? <div>
			<Nav tabs>
				{this.state.tabs.map((tab, i) =>
					<NavItem key={i}>
						<NavLink
							active={this.state.selectedTabIndex === i}
							onClick={() => this.setState({selectedTabIndex: i})}
						>
							{tab.title}
						</NavLink>
					</NavItem>
				)}
				<NavItem>
					<Button
						color='link'
					>
						<Octicon icon={Plus} />
					</Button>
				</NavItem>
			</Nav>
			<TabContent activeTab={this.state.selectedTabIndex}>
				{this.state.tabs.map((tab, i) =>
					<TabPane key={i} tabId={i}>
						{tab.content}
					</TabPane>
				)}
			</TabContent>
		</div> : <div>
			<Jumbotron>
				<h1>Welcome to GPGP</h1>
				<p>Open an existing project or level, or create a new project.</p>
				<Row>
					<Col md={4}>
						<Button
							block
							onClick={() => this.newProject()}
						>
							New project
						</Button>
						<br />
						<Row>
							<Col md={6}>
								<Button
									block
									onClick={() => this.openProject()}
								>
									Open project
								</Button>
							</Col>
							<Col md={6}>
								<Button block>Open level</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</Jumbotron>
		</div>
	}
}
