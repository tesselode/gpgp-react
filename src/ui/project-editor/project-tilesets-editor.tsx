import Octicon, { FileDirectory } from '@githubprimer/octicons-react';
import { remote } from 'electron';
import React from 'react';
import {
	Button,
	Col,
	Form,
	FormGroup,
	Input,
	InputGroup,
	InputGroupAddon,
	Label,
	Row,
} from 'reactstrap';
import Image from '../../data/image-data';
import Project from '../../data/project';
import { newTileset } from '../../data/tileset';
import { shiftDown, shiftUp } from '../../util';
import Grid from '../grid';
import ItemList from './item-list';

export interface Props {
	focused: boolean;
	project: Project;
	images: Map<string, Image>;
	modifyProject: (f: (project: Project) => void) => void;
}

export interface State {
	selectedTilesetIndex: number;
}

export default class extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			selectedTilesetIndex: 0,
		};
	}

	private chooseTilesetImage() {
		remote.dialog.showOpenDialog({
			filters: [
				{name: 'Images', extensions: ['jpg', 'png']},
			],
		}, paths => {
			if (paths)
				this.props.modifyProject(project => {
					project.tilesets[this.state.selectedTilesetIndex].imagePath = paths[0];
				});
		});
	}

	private renderTilesetPreview() {
		if (!this.props.focused) return;
		const selectedTileset = this.props.project.tilesets[this.state.selectedTilesetIndex];
		const selectedTilesetImage: Image = this.props.images.get(selectedTileset.imagePath);
		if (!selectedTilesetImage) return;
		if (selectedTilesetImage.error) return <div>{selectedTilesetImage.error}</div>;
		return <Grid
			tileSize={this.props.project.tileSize}
			width={Math.ceil(selectedTilesetImage.width / this.props.project.tileSize)}
			height={Math.ceil(selectedTilesetImage.height / this.props.project.tileSize)}
		>
			<img src={selectedTilesetImage.data} />
		</Grid>;
	}

	public render() {
		const selectedTileset = this.props.project.tilesets[this.state.selectedTilesetIndex];
		return <Row>
			<Col md={4}>
				<ItemList
					title='Tilesets'
					selectedItemIndex={this.state.selectedTilesetIndex}
					items={this.props.project.tilesets}
					onSelectItem={tilesetIndex => this.setState({selectedTilesetIndex: tilesetIndex})}
					onAddItem={() => this.props.modifyProject(project => {
						project.tilesets.push(newTileset());
					})}
					onRemoveItem={tilesetIndex => this.props.modifyProject(project => {
						project.tilesets.splice(tilesetIndex, 1);
					})}
					onMoveItemUp={tilesetIndex => this.props.modifyProject(project => {
						shiftUp(project.tilesets, tilesetIndex);
					})}
					onMoveItemDown={tilesetIndex => this.props.modifyProject(project => {
						shiftDown(project.tilesets, tilesetIndex);
					})}
					renderItem={tileset => tileset.name}
				/>
			</Col>
			{selectedTileset && <Col md={8} key={this.state.selectedTilesetIndex}>
				<Form>
					<FormGroup row>
						<Label md={2}>Tileset name</Label>
						<Col md={10}>
							<Input
								value={selectedTileset.name}
								onChange={event => this.props.modifyProject(project => {
									project.tilesets[this.state.selectedTilesetIndex].name = event.target.value;
								})}
							/>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label md={2}>Image path</Label>
						<Col md={10}>
							<InputGroup>
								<InputGroupAddon addonType='prepend'>
									<Button
										onClick={() => this.chooseTilesetImage()}
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
				{this.renderTilesetPreview()}
			</Col>}
		</Row>;
	}
}
