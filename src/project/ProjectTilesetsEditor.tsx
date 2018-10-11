import React from 'react';
import {
	Row,
	Col,
	Navbar,
	NavbarBrand,
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

export interface Props {
	project: Project;
	selectedTilesetIndex: number;
	onAddTileset: () => void;
	onRemoveTileset: (tilesetIndex: number) => void;
	onChangeTilesetName: (tilesetIndex: number, name: string) => void;
	onSelectTileset: (tilesetIndex: number) => void;
}

export default (props: Props) => {
	let selectedTileset = props.project.tilesets[props.selectedTilesetIndex];
	return <Row>
		<Col md={4}>
			<Navbar color='light'>
				<NavbarBrand>Tilesets</NavbarBrand>
				<ButtonGroup>
					<Button
						onClick={() => props.onRemoveTileset(props.selectedTilesetIndex)}
					>
						<Octicon icon={Trashcan}/>
					</Button>
					<Button
						onClick={() => props.onAddTileset()}
					>
						<Octicon icon={Plus}/>
					</Button>
				</ButtonGroup>
			</Navbar>
			<ListGroup flush>
				{props.project.tilesets.map((tileset, i) =>
					<ListGroupItem
						active={i === props.selectedTilesetIndex}
						onClick={() => props.onSelectTileset(i)}
					>
						{tileset.name}
					</ListGroupItem>)
				}
			</ListGroup>
		</Col>
		{selectedTileset && <Col md={8}>
			<Form>
				<FormGroup row>
					<Label md={2}>Tileset name</Label>
					<Col md={10}>
						<Input
							value={selectedTileset.name}
							onChange={(event) => props.onChangeTilesetName(props.selectedTilesetIndex, event.target.value)}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label md={2}>Image path</Label>
					<Col md={10}>
						<InputGroup>
							<InputGroupAddon addonType='prepend'>
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
	</Row>;
}
