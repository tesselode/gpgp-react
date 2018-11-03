import Octicon, { FileDirectory, Paintcan } from '@githubprimer/octicons-react';
import { remote } from 'electron';
import React from 'react';
import { SketchPicker } from 'react-color';
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

export default ParameterEditor;
