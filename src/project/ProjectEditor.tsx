import React from 'react';
import {
	Col,
	Nav,
	NavItem,
	NavLink,
	TabPane,
	TabContent,
	Form,
	FormGroup,
	Label,
	InputGroup,
	Input,
	FormFeedback,
} from 'reactstrap';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';

export enum ProjectEditorTab {
	Settings,
	Tilesets,
}

export interface State {
	activeTab: ProjectEditorTab;
	tileSize: number;
	defaultMapWidth: number;
	defaultMapHeight: number;
	maxMapWidth: number;
	maxMapHeight: number;
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
					<Form>
						<FormGroup row>
							<Label md={2}>Tile size</Label>
							<Col md={10}>
								<InputGroup>
									<Input
										type='number'
										value={this.state.tileSize}
										invalid={!isValidSize(this.state.tileSize)}
										onChange={(event) => this.setState({tileSize: Number(event.target.value)})}
									/>
									<InputGroupAddon addonType='append'>pixels</InputGroupAddon>
									<FormFeedback tooltip>
										Tile size must be 1 pixel or greater
									</FormFeedback>
								</InputGroup>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label md={2}>Default map width</Label>
							<Col md={10}>
								<InputGroup>
									<Input
										type='number'
										value={this.state.defaultMapWidth}
										invalid={!isValidSize(this.state.defaultMapWidth)}
										onChange={(event) => this.setState({defaultMapWidth: Number(event.target.value)})}
									/>
									<InputGroupAddon addonType='append'>tile</InputGroupAddon>
									<FormFeedback tooltip>
										Default map width must be 1 tile or greater
									</FormFeedback>
								</InputGroup>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label md={2}>Default map height</Label>
							<Col md={10}>
								<InputGroup>
									<Input
										type='number'
										value={this.state.defaultMapHeight}
										invalid={!isValidSize(this.state.defaultMapHeight)}
										onChange={(event) => this.setState({defaultMapHeight: Number(event.target.value)})}
									/>
									<InputGroupAddon addonType='append'>tile</InputGroupAddon>
									<FormFeedback tooltip>
										Default map height must be 1 tile or greater
									</FormFeedback>
								</InputGroup>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label md={2}>Max map width</Label>
							<Col md={10}>
								<InputGroup>
									<Input
										type='number'
										value={this.state.maxMapWidth}
										invalid={!isValidSize(this.state.maxMapWidth)}
										onChange={(event) => this.setState({maxMapWidth: Number(event.target.value)})}
									/>
									<InputGroupAddon addonType='append'>tile</InputGroupAddon>
									<FormFeedback tooltip>
										Max map width must be 1 tile or greater
									</FormFeedback>
								</InputGroup>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label md={2}>Max map height</Label>
							<Col md={10}>
								<InputGroup>
									<Input
										type='number'
										value={this.state.maxMapHeight}
										invalid={!isValidSize(this.state.maxMapHeight)}
										onChange={(event) => this.setState({maxMapHeight: Number(event.target.value)})}
									/>
									<InputGroupAddon addonType='append'>tile</InputGroupAddon>
									<FormFeedback tooltip>
										Max map height must be 1 tile or greater
									</FormFeedback>
								</InputGroup>
							</Col>
						</FormGroup>
					</Form>
				</TabPane>
				<TabPane tabId={ProjectEditorTab.Tilesets}>
				</TabPane>
			</TabContent>
		</div>;
	}
}
