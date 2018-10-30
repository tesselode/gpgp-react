import Octicon, { ArrowDown, ArrowUp, FileDirectory, Plus, Trashcan } from '@githubprimer/octicons-react';
import { remote } from 'electron';
import React from 'react';
import {
	Button,
	ButtonGroup,
	Col,
	Form,
	FormGroup,
	Input,
	InputGroup,
	InputGroupAddon,
	Label,
	ListGroup,
	ListGroupItem,
	Navbar,
	NavbarBrand,
	Row,
} from 'reactstrap';
import Image from '../../data/image-data';
import Project from '../../data/project';
import Grid from '../grid';

export interface Props {
	focused: boolean;
	project: Project;
	images: Map<string, Image>;
	selectedTilesetIndex: number;
	onSelectTileset: (tilesetIndex: number) => void;
	onAddTileset: () => void;
	onRemoveTileset: (tilesetIndex: number) => void;
	onMoveTilesetUp: (tilesetIndex: number) => void;
	onMoveTilesetDown: (tilesetIndex: number) => void;
	onChangeTilesetName: (tilesetIndex: number, name: string) => void;
	onChooseTilesetImage: (tilesetIndex: number, imagePath: string) => void;
}

function chooseTilesetImage(props: Props): void {
	remote.dialog.showOpenDialog({
		filters: [
			{name: 'Images', extensions: ['jpg', 'png']},
		],
	}, paths => {
		if (paths)
			props.onChooseTilesetImage(props.selectedTilesetIndex, paths[0]);
	});
}

function renderTilesetPreview(props: Props) {
	if (!props.focused) return;
	const selectedTileset = props.project.tilesets[props.selectedTilesetIndex];
	const selectedTilesetImage: Image = props.images.get(selectedTileset.imagePath);
	if (!selectedTilesetImage) return;
	if (selectedTilesetImage.error) return <div>{selectedTilesetImage.error}</div>;
	return <Grid
		tileSize={props.project.tileSize}
		width={Math.ceil(selectedTilesetImage.width / props.project.tileSize)}
		height={Math.ceil(selectedTilesetImage.height / props.project.tileSize)}
	>
		<img src={selectedTilesetImage.data} />
	</Grid>;
}

export default (props: Props) => {
	const selectedTileset = props.project.tilesets[props.selectedTilesetIndex];
	return <Row>
		<Col md={4}>
			<Navbar color='light'>
				<NavbarBrand>Tilesets</NavbarBrand>
				<ButtonGroup>
					<Button
						disabled={!selectedTileset}
						onClick={() => props.onRemoveTileset(props.selectedTilesetIndex)}
					>
						<Octicon icon={Trashcan}/>
					</Button>
					<Button
						onClick={() => props.onAddTileset()}
					>
						<Octicon icon={Plus}/>
					</Button>
					<Button
						disabled={!(selectedTileset && props.selectedTilesetIndex !== 0)}
						onClick={() => props.onMoveTilesetUp(props.selectedTilesetIndex)}
					>
						<Octicon icon={ArrowUp}/>
					</Button>
					<Button
						disabled={!(selectedTileset && props.selectedTilesetIndex !== props.project.tilesets.length - 1)}
						onClick={() => props.onMoveTilesetDown(props.selectedTilesetIndex)}
					>
						<Octicon icon={ArrowDown}/>
					</Button>
				</ButtonGroup>
			</Navbar>
			<ListGroup flush>
				{props.project.tilesets.map((tileset, i) =>
					<ListGroupItem
						key={i}
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
								<Button
									onClick={() => chooseTilesetImage(props)}
								>
									<Octicon icon={FileDirectory} />
								</Button>
							</InputGroupAddon>
							<Input
								disabled
								value={selectedTileset.imagePath}
							/>
						</InputGroup>
					</Col>
				</FormGroup>
			</Form>
			{renderTilesetPreview(props)}
		</Col>}
	</Row>;
};
