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
import Entity, { EntityParameter, isNumberEntityParameter, NumberEntityParameter } from '../../data/entity';
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

const NumberParameterForm = (parameter: NumberEntityParameter) => <div>
	<Row>
		<Col md={6}>
			<FormGroup row>
				<Label md={2} size='sm'>Min</Label>
				<Col md={10}>
					<InputGroup size='sm'>
						<InputGroupAddon addonType='prepend'>
							<InputGroupText>
								<Input addon type='checkbox' checked={parameter.hasMin} />
							</InputGroupText>
						</InputGroupAddon>
						<Input
							type='number'
							disabled={!parameter.hasMin}
							value={parameter.min}
						/>
					</InputGroup>
				</Col>
			</FormGroup>
		</Col>
		<Col md={6}>
			<FormGroup row>
				<Label md={2} size='sm'>Max</Label>
				<Col md={10}>
					<InputGroup size='sm'>
						<InputGroupAddon addonType='prepend'>
							<InputGroupText>
								<Input addon type='checkbox' checked={parameter.hasMax} />
							</InputGroupText>
						</InputGroupAddon>
						<Input
							type='number'
							disabled={!parameter.hasMax}
							value={parameter.max}
						/>
					</InputGroup>
				</Col>
			</FormGroup>
		</Col>
	</Row>
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
</div>;

const ParameterEditor = (parameter: EntityParameter) => <Form>
	<h6>{parameter.name}</h6>
	<Row>
		<Col md={6}>
			<FormGroup row>
				<Label md={2} size='sm'>Name</Label>
				<Col md={10}>
					<Input
						bsSize='sm'
						value={parameter.name}
					/>
				</Col>
			</FormGroup>
		</Col>
		<Col md={6}>
			<FormGroup row>
				<Label md={2} size='sm'>Type</Label>
				<Col md={10}>
					<Input
						bsSize='sm'
						type='select'
					>
						<option>Text</option>
						<option>Number</option>
						<option>Choice</option>
						<option>Switch</option>
					</Input>
				</Col>
			</FormGroup>
		</Col>
	</Row>
	{
		isNumberEntityParameter(parameter) ? NumberParameterForm(parameter)
		: ''
	}
</Form>;

interface EntityEditorProps {
	entity: Entity;
	selectedEntityParameter: number;
	onChangeEntityName: (name: string) => void;
	onChangeEntityColor: (color: string) => void;
	onChangeEntityWidth: (width: number) => void;
	onChangeEntityHeight: (height: number) => void;
	onChooseEntityImage: (imagePath: string) => void;
	onAddEntityParameter: () => void;
}

interface EntityEditorState {
	showColorPicker: boolean;
}

class EntityEditor extends React.Component<EntityEditorProps, EntityEditorState> {
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
				this.props.onChooseEntityImage(paths[0]);
		});
	}

	public render() {
		return <div>
			<Form>
				<FormGroup row>
					<Label md={2}>Entity name</Label>
					<Col md={10}>
						<Input
							value={this.props.entity.name}
							onChange={(event) => this.props.onChangeEntityName(event.target.value)}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label md={2}>Size</Label>
					<Col md={10}>
						<InputGroup>
							<Input
								type='number'
								value={this.props.entity.width}
								onChange={event => {
									const value = Number(event.target.value);
									if (!isNaN(value) && value > 0)
										this.props.onChangeEntityWidth(value);
								}}
							/>
							<InputGroupAddon addonType='append'>
								<InputGroupText style={{borderRight: 'none'}}>x</InputGroupText>
							</InputGroupAddon>
							<Input
								type='number'
								value={this.props.entity.height}
								onChange={event => {
									const value = Number(event.target.value);
									if (!isNaN(value) && value > 0)
										this.props.onChangeEntityHeight(value);
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
								<InputGroupText>{ColorDisplay(this.props.entity.color)}</InputGroupText>
							</InputGroupAddon>
							<Input
								value={this.props.entity.color}
								disabled
							/>
						</InputGroup>
						{this.state.showColorPicker && <SketchPicker
							color={this.props.entity.color}
							onChangeComplete={color => this.props.onChangeEntityColor(color.hex)}
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
								value={this.props.entity.imagePath}
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
						onClick={() => {this.props.onAddEntityParameter(); }}
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
				{this.props.entity.parameters.map((parameter, i) =>
					<ListGroupItem
						key={i}
						active={this.props.selectedEntityParameter === i}
					>
						{ParameterEditor(parameter)}
					</ListGroupItem>,
				)}
			</ListGroup>
		</div>;
	}
}

export interface Props {
	focused: boolean;
	project: Project;
	images: Map<string, Image>;
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
	selectedEntityIndex: number;
	selectedEntityParameter: number;
}

export default class ProjectEntitiesEditor extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			selectedEntityIndex: 0,
			selectedEntityParameter: 0,
		};
	}

	public render() {
		const selectedEntity = this.props.project.entities[this.state.selectedEntityIndex];
		return <Row>
			<Col md={4}>
				<Navbar color='light'>
					<NavbarBrand>Entities</NavbarBrand>
					<ButtonGroup>
						<Button
							disabled={!selectedEntity}
							onClick={() => this.props.onRemoveEntity(this.state.selectedEntityIndex)}
						>
							<Octicon icon={Trashcan}/>
						</Button>
						<Button
							onClick={() => this.props.onAddEntity()}
						>
							<Octicon icon={Plus}/>
						</Button>
						<Button
							disabled={!(selectedEntity && this.state.selectedEntityIndex !== 0)}
							onClick={() => this.props.onMoveEntityUp(this.state.selectedEntityIndex)}
						>
							<Octicon icon={ArrowUp}/>
						</Button>
						<Button
							disabled={!(selectedEntity && this.state.selectedEntityIndex !== this.props.project.entities.length - 1)}
							onClick={() => this.props.onMoveEntityDown(this.state.selectedEntityIndex)}
						>
							<Octicon icon={ArrowDown}/>
						</Button>
					</ButtonGroup>
				</Navbar>
				<ListGroup flush>
					{this.props.project.entities.map((entity, i) =>
						<ListGroupItem
							key={i}
							active={i === this.state.selectedEntityIndex}
							onClick={() => {this.setState({selectedEntityIndex: i}); }}
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
				<EntityEditor
					entity={selectedEntity}
					selectedEntityParameter={this.state.selectedEntityParameter}
					onChangeEntityName={name => this.props.onChangeEntityName(this.state.selectedEntityIndex, name)}
					onChangeEntityColor={color => this.props.onChangeEntityColor(this.state.selectedEntityIndex, color)}
					onChangeEntityWidth={width => this.props.onChangeEntityWidth(this.state.selectedEntityIndex, width)}
					onChangeEntityHeight={height => this.props.onChangeEntityHeight(this.state.selectedEntityIndex, height)}
					onChooseEntityImage={imagePath => this.props.onChooseEntityImage(this.state.selectedEntityIndex, imagePath)}
					onAddEntityParameter={() => this.props.onAddEntityParameter(this.state.selectedEntityIndex)}
				/>
			</Col>}
		</Row>;
	}
}
