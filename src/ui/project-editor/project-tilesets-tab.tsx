import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import Image from '../../data/image';
import Project from '../../data/project/project';
import ItemList from './item-list';

export interface Props {
	focused: boolean;
	project: Project;
	images: Map<string, Image>;
	setProject: (project: Project) => void;
}

export interface State {
	selectedTilesetIndex: number;
}

export default class ProjectTilesetsTab extends React.Component<Props, State> {
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
			if (paths) {
				const tileset = this.props.project.data.tilesets[this.state.selectedTilesetIndex];
				this.props.setProject(this.props.project.setTileset(
					this.state.selectedTilesetIndex,
					tileset.setImagePath(paths[0]),
				));
			}
		});
	}

	public render() {
		const selectedTileset = this.props.project.data.tilesets[this.state.selectedTilesetIndex];
		return <Row>
			<Col md={4}>
				<ItemList
					title='Tilesets'
					selectedItemIndex={this.state.selectedTilesetIndex}
					items={this.props.project.data.tilesets}
					onSelectItem={tilesetIndex => this.setState({selectedTilesetIndex: tilesetIndex})}
					onAddItem={() => this.props.setProject(this.props.project.addTileset(this.state.selectedTilesetIndex))}
					onRemoveItem={tilesetIndex => this.props.setProject(this.props.project.removeTileset(tilesetIndex))}
					onMoveItemUp={tilesetIndex => this.props.setProject(this.props.project.moveTilesetUp(tilesetIndex))}
					onMoveItemDown={tilesetIndex => this.props.setProject(this.props.project.moveTilesetDown(tilesetIndex))}
					renderItem={tileset => tileset.data.name}
				/>
			</Col>
			{selectedTileset && <Col
				md={8}
				key={this.state.selectedTilesetIndex}
				style={{
					height: 'calc(100vh - 194px)',
					overflowY: 'auto',
				}}
			>
				<Form>
					<FormGroup row>
						<Label md={2}>Tileset name</Label>
						<Col md={10}>
							<Input
								value={selectedTileset.data.name}
								onChange={event => this.props.setProject(this.props.project.setTileset(
									this.state.selectedTilesetIndex,
									selectedTileset.setName(event.target.value),
								))}
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
										<FontAwesomeIcon icon={faFolderOpen} />
									</Button>
								</InputGroupAddon>
								<Input
									disabled
									value={selectedTileset.data.imagePath}
								/>
							</InputGroup>
						</Col>
					</FormGroup>
				</Form>
			</Col>}
		</Row>;
	}
}
