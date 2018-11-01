import Octicon, { FileDirectory, Paintcan } from '@githubprimer/octicons-react';
import { remote } from 'electron';
import React from 'react';
import { SketchPicker } from 'react-color';
import { Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, ButtonGroup } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import Col from 'reactstrap/lib/Col';
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import Entity,
{
	EntityParameter,
	EntityParameterType,
	isNumberEntityParameter,
	isSwitchEntityParameter,
	isTextEntityParameter,
	NumberEntityParameter,
	SwitchEntityParameter,
	TextEntityParameter,
} from '../../data/entity';
import Image from '../../data/image-data';
import Project from '../../data/project';
import ItemList from './item-list';

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

const TextParameterForm = (parameter: TextEntityParameter) => <div>
	<FormGroup row>
		<Label md={1} size='sm'>Default</Label>
		<Col md={11}>
			<Input
				bsSize='sm'
				value={parameter.default}
			/>
		</Col>
	</FormGroup>
</div>;

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
	{parameter.hasMin && parameter.hasMax && <FormGroup row>
		<Label md={1} size='sm'>Show slider</Label>
		<Col md={11}>
			<Input
				bsSize='sm'
				type='checkbox'
				checked={parameter.useSlider}
			/>
		</Col>
	</FormGroup>}
	<FormGroup row>
		<Label md={1} size='sm'>Default</Label>
		<Col md={11}>
			<Input
				bsSize='sm'
				type='number'
				value={parameter.default}
			/>
		</Col>
	</FormGroup>
</div>;

const SwitchParameterForm = (parameter: SwitchEntityParameter, selectedParameter: boolean) => <div>
	<ButtonGroup size='sm'>
		<Button
			outline
			color={selectedParameter ? 'light' : 'dark'}
			active={!parameter.default}
			onClick={() => {}}
		>
			Off by default
		</Button>
		<Button
			outline
			color={selectedParameter ? 'light' : 'dark'}
			active={parameter.default}
			onClick={() => {}}
		>
			On by default
		</Button>
	</ButtonGroup>
</div>;

interface ParameterEditorProps {
	parameter: EntityParameter;
	selectedParameter: boolean;
	onChangeParameterName: (name: string) => void;
	onChangeParameterType: (type: EntityParameterType) => void;
}

const ParameterEditor = (props: ParameterEditorProps) => <Form>
	<h6>{props.parameter.name}</h6>
	<Row>
		<Col md={6}>
			<FormGroup row>
				<Label md={2} size='sm'>Name</Label>
				<Col md={10}>
					<Input
						bsSize='sm'
						value={props.parameter.name}
						onChange={event => props.onChangeParameterName(event.target.value)}
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
						onChange={event => props.onChangeParameterType(event.target.value as EntityParameterType)}
					>
						<option>Text</option>
						<option>Number</option>
						<option>Switch</option>
					</Input>
				</Col>
			</FormGroup>
		</Col>
	</Row>
	{
		isTextEntityParameter(props.parameter) ? TextParameterForm(props.parameter)
		: isNumberEntityParameter(props.parameter) ? NumberParameterForm(props.parameter)
		: isSwitchEntityParameter(props.parameter) ? SwitchParameterForm(props.parameter, props.selectedParameter)
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
	onAddParameter: () => void;
	onChangeParameterName: (parameterIndex: number, name: string) => void;
	onChangeParameterType: (parameterIndex: number, type: EntityParameterType) => void;
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
			<ItemList
				title='Parameters'
				selectedItemIndex={this.props.selectedEntityParameter}
				items={this.props.entity.parameters}
				onSelectItem={() => {}}
				onAddItem={this.props.onAddParameter}
				onRemoveItem={() => {}}
				onMoveItemUp={() => {}}
				onMoveItemDown={() => {}}
				renderItem={(parameter, i) => <ParameterEditor
					parameter={parameter}
					selectedParameter={i === this.props.selectedEntityParameter}
					onChangeParameterName={name => this.props.onChangeParameterName(i, name)}
					onChangeParameterType={type => this.props.onChangeParameterType(i, type)}
				/>}
			/>
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
	onAddParameter: (entityIndex: number) => void;
	onChangeParameterName: (entityIndex: number, parameterIndex: number, name: string) => void;
	onChangeParameterType: (entityIndex: number, parameterIndex: number, type: EntityParameterType) => void;
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
				<ItemList
					title='Entities'
					selectedItemIndex={this.state.selectedEntityIndex}
					items={this.props.project.entities}
					onSelectItem={entityIndex => this.setState({selectedEntityIndex: entityIndex})}
					onAddItem={this.props.onAddEntity}
					onRemoveItem={this.props.onRemoveEntity}
					onMoveItemUp={this.props.onMoveEntityUp}
					onMoveItemDown={this.props.onMoveEntityDown}
					renderItem={entity => <div>
						{
							entity.imagePath && this.props.images.get(entity.imagePath) ?
								<img
									src={this.props.images.get(entity.imagePath).data}
									style={{
										width: 'auto',
										height: '1em',
									}}
								/>
								: ColorDisplay(entity.color)
						}
						&nbsp;&nbsp;
						{entity.name}
					</div>}
				/>
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
					onAddParameter={() => this.props.onAddParameter(this.state.selectedEntityIndex)}
					onChangeParameterName={(parameterIndex, name) =>
						this.props.onChangeParameterName(this.state.selectedEntityIndex, parameterIndex, name)
					}
					onChangeParameterType={(parameterIndex, type) =>
						this.props.onChangeParameterType(this.state.selectedEntityIndex, parameterIndex, type)
					}
				/>
			</Col>}
		</Row>;
	}
}
