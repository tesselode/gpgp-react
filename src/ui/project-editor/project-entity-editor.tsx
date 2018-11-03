import Octicon, { FileDirectory, Paintcan } from '@githubprimer/octicons-react';
import { remote } from 'electron';
import React from 'react';
import { SketchPicker } from 'react-color';
import { Button, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from 'reactstrap';
import Entity, { EntityParameterType } from '../../data/entity';
import { shiftDown, shiftUp } from '../../util';
import ColorDisplay from './color-display';
import ParameterEditor from './entity-parameter-editor';
import ItemList from './item-list';

export interface Props {
	entity: Entity;
	modifyEntity: (f: (entity: Entity) => void) => void;
}

export interface State {
	selectedParameterIndex: number;
	showColorPicker: boolean;
}

export default class EntityEditor extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			selectedParameterIndex: 0,
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
				this.props.modifyEntity(entity => {entity.imagePath = paths[0]; });
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
							onChange={event => this.props.modifyEntity(entity => {entity.name = event.target.value; })}
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
										this.props.modifyEntity(entity => {entity.width = value; });
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
									this.props.modifyEntity(entity => {entity.height = value; });
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
							onChangeComplete={color => this.props.modifyEntity(entity => {
								entity.color = color.hex;
							})}
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
				selectedItemIndex={this.state.selectedParameterIndex}
				items={this.props.entity.parameters}
				onSelectItem={parameterIndex => this.setState({selectedParameterIndex: parameterIndex})}
				onAddItem={() => this.props.modifyEntity(entity => {
					entity.parameters.push({name: 'New parameter', type: EntityParameterType.Text});
				})}
				onRemoveItem={parameterIndex => this.props.modifyEntity(entity => {
					entity.parameters.splice(parameterIndex, 1);
				})}
				onMoveItemUp={parameterIndex => this.props.modifyEntity(entity => {
					shiftUp(entity.parameters, parameterIndex);
				})}
				onMoveItemDown={parameterIndex => this.props.modifyEntity(entity => {
					shiftDown(entity.parameters, parameterIndex);
				})}
				renderItem={(parameter, i) => <ParameterEditor
					parameter={parameter}
					selectedParameter={i === this.state.selectedParameterIndex}
					modifyParameter={f => this.props.modifyEntity(entity => {
						f(entity.parameters[i]);
					})}
				/>}
			/>
		</div>;
	}
}
