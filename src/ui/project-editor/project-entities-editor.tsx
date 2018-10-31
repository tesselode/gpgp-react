import Octicon, { ArrowDown, ArrowUp, FileDirectory, Paintcan, Plus, Trashcan } from '@githubprimer/octicons-react';
import { remote } from 'electron';
import React from 'react';
import { SketchPicker } from 'react-color';
import { ButtonGroup, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import Col from 'reactstrap/lib/Col';
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import ListGroup from 'reactstrap/lib/ListGroup';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';
import Navbar from 'reactstrap/lib/Navbar';
import NavbarBrand from 'reactstrap/lib/NavbarBrand';
import { isNumberEntityParameter } from '../../data/entity';
import Image from '../../data/image-data';
import Project from '../../data/project';

const ColorDisplay = (color: string) => <div
	style={{
		display: 'inline-block',
		position: 'relative',
		top: '.1em',
		width: '1em',
		height: '1em',
		borderRadius: '1em',
		background: color,
	}}
/>;

export interface Props {
	focused: boolean;
	project: Project;
	images: Map<string, Image>;
	selectedEntityIndex: number;
	selectedEntityParameter: number;
	onSelectEntity: (entityIndex: number) => void;
	onAddEntity: () => void;
	onRemoveEntity: (entityIndex: number) => void;
	onMoveEntityUp: (entityIndex: number) => void;
	onMoveEntityDown: (entityIndex: number) => void;
	onChangeEntityName: (entityIndex: number, name: string) => void;
	onChangeEntityColor: (entityIndex: number, color: string) => void;
	onChangeEntityWidth: (entityIndex: number, width: number) => void;
	onChangeEntityHeight: (entityIndex: number, height: number) => void;
	onChooseEntityImage: (entityIndex: number, imagePath: string) => void;
	onAddEntityParameter: (entityIndex: number) => void;
}

export interface State {
	showColorPicker: boolean;
}

export default class ProjectEntitiesEditor extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			showColorPicker: false,
		};
	}

	private chooseEntityImage(): void {
		remote.dialog.showOpenDialog({
			filters: [
				{name: 'Images', extensions: ['jpg', 'png']},
			],
		}, paths => {
			if (paths)
				this.props.onChooseEntityImage(this.props.selectedEntityIndex, paths[0]);
		});
	}

	public render() {
		const selectedEntity = this.props.project.entities[this.props.selectedEntityIndex];
		return <Row>
			<Col md={4}>
				<Navbar color='light'>
					<NavbarBrand>Entities</NavbarBrand>
					<ButtonGroup>
						<Button
							disabled={!selectedEntity}
							onClick={() => this.props.onRemoveEntity(this.props.selectedEntityIndex)}
						>
							<Octicon icon={Trashcan}/>
						</Button>
						<Button
							onClick={() => this.props.onAddEntity()}
						>
							<Octicon icon={Plus}/>
						</Button>
						<Button
							disabled={!(selectedEntity && this.props.selectedEntityIndex !== 0)}
							onClick={() => this.props.onMoveEntityUp(this.props.selectedEntityIndex)}
						>
							<Octicon icon={ArrowUp}/>
						</Button>
						<Button
							disabled={!(selectedEntity && this.props.selectedEntityIndex !== this.props.project.entities.length - 1)}
							onClick={() => this.props.onMoveEntityDown(this.props.selectedEntityIndex)}
						>
							<Octicon icon={ArrowDown}/>
						</Button>
					</ButtonGroup>
				</Navbar>
				<ListGroup flush>
					{this.props.project.entities.map((entity, i) =>
						<ListGroupItem
							key={i}
							active={i === this.props.selectedEntityIndex}
							onClick={() => this.props.onSelectEntity(i)}
						>
							{
								selectedEntity.imagePath && this.props.images.get(selectedEntity.imagePath) ?
									<img
										src={this.props.images.get(selectedEntity.imagePath).data}
										style={{
											width: 'auto',
											height: '1em',
										}}
									/>
									: ColorDisplay(entity.color)
							}
							&nbsp;&nbsp;
							{entity.name}
						</ListGroupItem>)
					}
				</ListGroup>
			</Col>
			{selectedEntity && <Col md={8}>
				<Form>
					<FormGroup row>
						<Label md={2}>Entity name</Label>
						<Col md={10}>
							<Input
								value={selectedEntity.name}
								onChange={(event) => this.props.onChangeEntityName(this.props.selectedEntityIndex, event.target.value)}
							/>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label md={2}>Size</Label>
						<Col md={10}>
							<InputGroup>
								<Input
									type='number'
									value={selectedEntity.width}
									onChange={event => {
										const value = Number(event.target.value);
										if (!isNaN(value) && value > 0)
											this.props.onChangeEntityWidth(this.props.selectedEntityIndex, value);
									}}
								/>
								<InputGroupAddon addonType='append'>
									<InputGroupText style={{borderRight: 'none'}}>x</InputGroupText>
								</InputGroupAddon>
								<Input
									type='number'
									value={selectedEntity.height}
									onChange={event => {
										const value = Number(event.target.value);
										if (!isNaN(value) && value > 0)
											this.props.onChangeEntityHeight(this.props.selectedEntityIndex, value);
									}}
								/>
								<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
							</InputGroup>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label md={2}>Color</Label>
						<Col md={10}>
							<InputGroup>
								<InputGroupAddon addonType='prepend'>
									<Button
										onClick={() => {this.setState({showColorPicker: !this.state.showColorPicker}); }}
									>
										<Octicon icon={Paintcan} />
									</Button>
									<InputGroupText>{ColorDisplay(selectedEntity.color)}</InputGroupText>
								</InputGroupAddon>
								<Input
									value={selectedEntity.color}
									disabled
								/>
							</InputGroup>
							{this.state.showColorPicker && <SketchPicker
								color={selectedEntity.color}
								onChangeComplete={color => this.props.onChangeEntityColor(this.props.selectedEntityIndex, color.hex)}
								disableAlpha
							/>}
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label md={2}>Image path</Label>
						<Col md={10}>
							<InputGroup>
								<InputGroupAddon addonType='prepend'>
									<Button
										onClick={this.chooseEntityImage.bind(this)}
									>
										<Octicon icon={FileDirectory} />
									</Button>
								</InputGroupAddon>
								<Input
									disabled
									value={selectedEntity.imagePath}
								/>
							</InputGroup>
						</Col>
					</FormGroup>
				</Form>
				<Navbar color='light'>
					<NavbarBrand>Parameters</NavbarBrand>
					<ButtonGroup>
						<Button
						>
							<Octicon icon={Trashcan}/>
						</Button>
						<Button
							onClick={() => {this.props.onAddEntityParameter(this.props.selectedEntityIndex); }}
						>
							<Octicon icon={Plus}/>
						</Button>
						<Button
						>
							<Octicon icon={ArrowUp}/>
						</Button>
						<Button
						>
							<Octicon icon={ArrowDown}/>
						</Button>
					</ButtonGroup>
				</Navbar>
				<ListGroup flush>
					{selectedEntity.parameters.map((parameter, i) =>
						<ListGroupItem
							key={i}
							active={this.props.selectedEntityParameter === i}
						>
							{
								isNumberEntityParameter(parameter) ? <Form>
									<h6>{parameter.name}</h6>
									<FormGroup row>
										<Label md={2} size='sm'>Name</Label>
										<Col md={10}>
											<Input
												bsSize='sm'
												value={parameter.name}
											/>
										</Col>
									</FormGroup>
									<FormGroup row>
										<Label md={2} size='sm'>Default</Label>
										<Col md={10}>
											<Input
												bsSize='sm'
												type='number'
												value={parameter.default}
											/>
										</Col>
									</FormGroup>
								</Form>
								: ''
							}
						</ListGroupItem>,
					)}
				</ListGroup>
			</Col>}
		</Row>;
	}
}
