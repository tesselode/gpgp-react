import React, { Component } from 'react';
import {
	Nav,
	NavItem,
	NavLink,
	Navbar,
	NavbarBrand,
	Button,
	ButtonGroup,
	TabContent,
	TabPane,
	Form,
	FormGroup,
	Label,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Row,
	Col,
	ListGroup,
	ListGroupItem } from 'reactstrap';
import Octicon, { Plus, Trashcan, FileDirectory } from '@githubprimer/octicons-react';

export default class ProjectEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			project: {
				tilesets: [],
			},
			activeTab: 'settings',
			selectedTilesetIndex: 0,
		};
	}

	onTilesetAdded() {
		let project = JSON.parse(JSON.stringify(this.state.project));
		project.tilesets.push({
			name: 'New tileset',
			image: '',
		})
		this.setState({project: project});
	}

	onTilesetRemoved() {
		if (this.state.project.tilesets.length === 0) return;
		let project = JSON.parse(JSON.stringify(this.state.project));
		project.tilesets.splice(this.selectedTilesetIndex, 1);
		this.setState({
			project: project,
			selectedTilesetIndex: Math.min(this.state.selectedTilesetIndex, this.state.project.tilesets.length - 2),
		});
	}

	onTilesetNameChanged(name) {
		let project = JSON.parse(JSON.stringify(this.state.project));
		project.tilesets[this.state.selectedTilesetIndex].name = name;
		this.setState({project: project})
	}

	render() {
		return <div>
			<Navbar color='light'>
				<NavbarBrand>New project...</NavbarBrand>
				<ButtonGroup>
					<Button>Save project</Button>
					<Button>Save project as...</Button>
					<Button color='primary'>New level</Button>
				</ButtonGroup>
			</Navbar>
			<Nav tabs style={{padding: '1em', paddingBottom: '0'}}>
				<NavItem>
					<NavLink
						active={this.state.activeTab === 'settings'}
						onClick={() => this.setState({activeTab: 'settings'})}
					>
						Settings
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						active={this.state.activeTab === 'tilesets'}
						onClick={() => this.setState({activeTab: 'tilesets'})}
					>
						Tilesets
					</NavLink>
				</NavItem>
			</Nav>
			<TabContent activeTab={this.state.activeTab} style={{padding: '1em'}}>
				<TabPane tabId='settings'>
					<Form>
						<FormGroup row>
							<Label sm={2}>Default level width</Label>
							<Col sm={10}>
								<Input type='number'></Input>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={2}>Default level height</Label>
							<Col sm={10}>
								<Input type='number'></Input>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={2}>Max level width</Label>
							<Col sm={10}>
								<Input type='number'></Input>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={2}>Max level height</Label>
							<Col sm={10}>
								<Input type='number'></Input>
							</Col>
						</FormGroup>
					</Form>
				</TabPane>
				<TabPane tabId='tilesets'>
					<Row>
						<Col sm={3}>
							<Navbar color='light'>
								<NavbarBrand>Tilesets</NavbarBrand>
								<ButtonGroup>
									<Button
										color='danger'
										disabled={this.state.project.tilesets.length === 0}
										onClick={() => this.onTilesetRemoved()}
									>
										<Octicon icon={Trashcan} ariaLabel='Remove tileset' />
									</Button>
									<Button
										onClick={() => this.onTilesetAdded()}
									>
										<Octicon icon={Plus} ariaLabel='Add tileset' />
									</Button>
								</ButtonGroup>
							</Navbar>
							<ListGroup flush>
								{this.state.project.tilesets.map((tileset, i) => {
									return <ListGroupItem
										active={this.state.selectedTilesetIndex === i}
										key={i}
										onClick={() => this.setState({selectedTilesetIndex: i})}
									>
										{tileset.name}
									</ListGroupItem>;
								})}
							</ListGroup>
						</Col>
						{this.state.project.tilesets[this.state.selectedTilesetIndex] ? <Col sm={9}>
							<Form>
								<FormGroup row>
									<Label sm={2}>Tileset name</Label>
									<Col sm={10}>
										<Input
											value={this.state.project.tilesets[this.state.selectedTilesetIndex].name}
											onChange={(event) => this.onTilesetNameChanged(event.target.value)}
										/>
									</Col>
								</FormGroup>
								<FormGroup row>
									<Label sm={2}>Image path</Label>
									<Col sm={10}>
										<InputGroup>
											<InputGroupAddon addonType='append' >
												<Button>
													<Octicon icon={FileDirectory} ariaLabel='Locate tileset image' />
												</Button>
											</InputGroupAddon>
											<Input readOnly />
										</InputGroup>
									</Col>
								</FormGroup>
							</Form>
						</Col> : ''}
					</Row>
				</TabPane>
			</TabContent>
		</div>
	}
}
