import React, { Component } from 'react';
import Grid from '../level/Grid';
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

export default class TilesetsEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTilesetIndex: 0,
		};
	}

	onTilesetRemoved() {
		this.props.onTilesetRemoved(this.state.selectedTilesetIndex);
		this.setState({
			selectedTilesetIndex: Math.min(this.state.selectedTilesetIndex, this.props.tilesets.length - 2),
		});
	}

	render() {
		let selectedTileset = this.props.tilesets[this.state.selectedTilesetIndex];
		let selectedTilesetImage = this.props.tilesetImages[this.state.selectedTilesetIndex];

		return <Row>
			<Col sm={3}>
				<Navbar color='light'>
					<NavbarBrand>Tilesets</NavbarBrand>
					<ButtonGroup>
						<Button
							color='danger'
							disabled={this.props.tilesets.length === 0}
							onClick={() => this.onTilesetRemoved()}
						>
							<Octicon icon={Trashcan} ariaLabel='Remove tileset' />
						</Button>
						<Button
							onClick={() => this.props.onTilesetAdded()}
						>
							<Octicon icon={Plus} ariaLabel='Add tileset' />
						</Button>
					</ButtonGroup>
				</Navbar>
				<ListGroup flush>
					{this.props.tilesets.map((tileset, i) => {
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
								onChange={(event) => this.props.onTilesetNameChanged(this.state.selectedTilesetIndex, event.target.value)}
							/>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label sm={2}>Image path</Label>
						<Col sm={10}>
							<InputGroup>
								<InputGroupAddon addonType='append' >
									<Button
										onClick={() => this.props.onLocateTilesetImage(this.state.selectedTilesetIndex)}
									>
										<Octicon icon={FileDirectory} ariaLabel='Locate tileset image' />
									</Button>
								</InputGroupAddon>
								<Input readOnly value={selectedTileset.imagePath} />
							</InputGroup>
						</Col>
					</FormGroup>
				</Form>
				{selectedTilesetImage ? <div
					style={{
						transform: 'scale(2)',
						transformOrigin: '0% 0%',
						imageRendering: 'pixelated',
					}}
				>
					<Grid
						visible
						order={0}
						mapWidth={Math.ceil(selectedTilesetImage.width / this.props.tileSize)}
						mapHeight={Math.ceil(selectedTilesetImage.height / this.props.tileSize)}
						tileSize={this.props.tileSize}
						onMouseMove={() => {}}
						onMouseEnter={() => {}}
						onMouseLeave={() => {}}
					/>
					<img
						src={selectedTilesetImage.data}
						alt=''
						style={{
							position: 'absolute',
						}}
					/>
				</div> : ''}
			</Col> : ''}
		</Row>;
	}
}
