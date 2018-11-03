import React from 'react';
import { ButtonGroup, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import Col from 'reactstrap/lib/Col';
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import {
	EntityParameter,
	EntityParameterType,
	isNumberEntityParameter,
	isSwitchEntityParameter,
	isTextEntityParameter,
	NumberEntityParameter,
	SwitchEntityParameter,
	TextEntityParameter,
} from '../../data/entity';

const TextParameterForm = (
	parameter: TextEntityParameter,
	modifyParameter: (f: (parameter: TextEntityParameter) => void) => void,
) => <div>
	<FormGroup row>
		<Label md={1} size='sm'>Default</Label>
		<Col md={11}>
			<Input
				bsSize='sm'
				value={parameter.default}
				onChange={event => modifyParameter(parameter => {
					parameter.default = event.target.value;
				})}
			/>
		</Col>
	</FormGroup>
</div>;

const NumberParameterForm = (
	parameter: NumberEntityParameter,
	modifyParameter: (f: (parameter: NumberEntityParameter) => void) => void,
) => <div>
	<Row>
		<Col md={6}>
			<FormGroup row>
				<Label md={2} size='sm'>Min</Label>
				<Col md={10}>
					<InputGroup size='sm'>
						<InputGroupAddon addonType='prepend'>
							<InputGroupText>
								<Input
									addon
									type='checkbox'
									checked={parameter.hasMin}
									onChange={() => modifyParameter(parameter => {
										parameter.hasMin = !parameter.hasMin;
									})}
								/>
							</InputGroupText>
						</InputGroupAddon>
						<Input
							type='number'
							disabled={!parameter.hasMin}
							value={parameter.min}
							onChange={event => modifyParameter(parameter => {
								parameter.min = Number(event.target.value);
							})}
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
								<Input
									addon
									type='checkbox'
									checked={parameter.hasMax}
									onChange={() => modifyParameter(parameter => {
										parameter.hasMax = !parameter.hasMax;
									})}
								/>
							</InputGroupText>
						</InputGroupAddon>
						<Input
							type='number'
							disabled={!parameter.hasMax}
							value={parameter.max}
							onChange={event => modifyParameter(parameter => {
								parameter.max = Number(event.target.value);
							})}
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
				onChange={() => modifyParameter(parameter => {
					parameter.useSlider = !parameter.useSlider;
				})}
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
				onChange={event => modifyParameter(parameter => {
					parameter.default = Number(event.target.value);
				})}
			/>
		</Col>
	</FormGroup>
</div>;

const SwitchParameterForm = (
	parameter: SwitchEntityParameter,
	selectedParameter: boolean,
	modifyParameter: (f: (parameter: SwitchEntityParameter) => void) => void,
) => <div>
	<ButtonGroup size='sm'>
		<Button
			outline
			color={selectedParameter ? 'light' : 'dark'}
			active={!parameter.default}
			onClick={() => modifyParameter(parameter => {
				parameter.default = false;
			})}
		>
			Off by default
		</Button>
		<Button
			outline
			color={selectedParameter ? 'light' : 'dark'}
			active={parameter.default}
			onClick={() => modifyParameter(parameter => {
				parameter.default = true;
			})}
		>
			On by default
		</Button>
	</ButtonGroup>
</div>;

interface ParameterEditorProps {
	parameter: EntityParameter;
	selectedParameter: boolean;
	modifyParameter: (f: (parameter: EntityParameter) => void) => void;
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
						onChange={event => props.modifyParameter(parameter => {parameter.name = event.target.value; })}
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
						onChange={event => props.modifyParameter(parameter => {
							parameter.type = event.target.value as EntityParameterType;
						})}
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
		isTextEntityParameter(props.parameter) ? TextParameterForm(
			props.parameter,
			props.modifyParameter,
		)
		: isNumberEntityParameter(props.parameter) ? NumberParameterForm(
			props.parameter,
			props.modifyParameter,
		)
		: isSwitchEntityParameter(props.parameter) ? SwitchParameterForm(
			props.parameter,
			props.selectedParameter,
			props.modifyParameter,
		)
		: ''
	}
</Form>;

export default ParameterEditor;
