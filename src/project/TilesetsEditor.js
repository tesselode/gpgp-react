import React, { Component } from 'react';
import {
	Navbar,
	NavbarBrand,
	Button,
	ButtonGroup,
	Form,
	FormGroup,
	Label,
	Input,
	InputGroup,
	InputGroupAddon,
	Row,
	Col,
	ListGroup,
	ListGroupItem } from 'reactstrap';
import Octicon, { Plus, Trashcan, FileDirectory } from '@githubprimer/octicons-react';
const fs = window.require('fs');
const { dialog } = window.require('electron').remote;

export default class TilesetsEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			project: {
				tilesets: [],
			},
			tilesetImagePaths: [],
			tilesetImages: [],
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

	onLocateTilesetImage() {
		let path = dialog.showOpenDialog()[0];
		if (path) {
			fs.readFile(path, 'base64', (error, data) => {
				if (error)
					dialog.showErrorBox('Error opening image', 'The image could not be opened.')
				else {
					let tilesetName = this.state.project.tilesets[this.state.selectedTilesetIndex].name;
					let tilesetImagePaths = JSON.parse(JSON.stringify(this.state.tilesetImagePaths));
					tilesetImagePaths[tilesetName] = path;
					let tilesetImages = JSON.parse(JSON.stringify(this.state.project));
					tilesetImages[tilesetName] = 'data:image/png;base64,' + data;
					this.setState({
						tilesetImagePaths: tilesetImagePaths,
						tilesetImages: tilesetImages,
					})
				}
			});
		}
	}

	render() {
		let selectedTileset = this.state.project.tilesets[this.state.selectedTilesetIndex];

		return <Row>
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
			{selectedTileset ? <Col sm={9}>
				<Form>
					<FormGroup row>
						<Label sm={2}>Tileset name</Label>
						<Col sm={10}>
							<Input
								value={selectedTileset.name}
								onChange={(event) => this.onTilesetNameChanged(event.target.value)}
							/>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label sm={2}>Image path</Label>
						<Col sm={10}>
							<InputGroup>
								<InputGroupAddon addonType='append' >
									<Button
										onClick={() => this.onLocateTilesetImage()}
									>
										<Octicon icon={FileDirectory} ariaLabel='Locate tileset image' />
									</Button>
								</InputGroupAddon>
								<Input readOnly value={this.state.tilesetImagePaths[selectedTileset.name]} />
							</InputGroup>
						</Col>
					</FormGroup>
				</Form>
				{this.state.tilesetImages[selectedTileset.name] ? <div>
					<img
						src={this.state.tilesetImages[selectedTileset.name]}
						alt=''
					/>
				</div> : ''}
			</Col> : ''}
		</Row>;
	}
}
