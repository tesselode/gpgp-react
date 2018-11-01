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

interface TextParameterFormProps {
	parameter: TextEntityParameter;
	onChangeDefault: (defaultValue: string) => void;
}

const TextParameterForm = (props: TextParameterFormProps) => <div>
	<FormGroup row>
		<Label md={1} size='sm'>Default</Label>
		<Col md={11}>
			<Input
				bsSize='sm'
				value={props.parameter.default}
				onChange={event => props.onChangeDefault(event.target.value)}
			/>
		</Col>
	</FormGroup>
</div>;

interface NumberParameterFormProps {
	parameter: NumberEntityParameter;
	onToggleHasMin: () => void;
	onChangeMin: (min: number) => void;
	onToggleHasMax: () => void;
	onChangeMax: (max: number) => void;
	onToggleSlider: () => void;
	onChangeDefault: (defaultValue: number) => void;
}

const NumberParameterForm = (props: NumberParameterFormProps) => <div>
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
									checked={props.parameter.hasMin}
									onChange={() => props.onToggleHasMin()}
								/>
							</InputGroupText>
						</InputGroupAddon>
						<Input
							type='number'
							disabled={!props.parameter.hasMin}
							value={props.parameter.min}
							onChange={event => props.onChangeMin(Number(event.target.value))}
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
									checked={props.parameter.hasMax}
									onChange={() => props.onToggleHasMax()}
								/>
							</InputGroupText>
						</InputGroupAddon>
						<Input
							type='number'
							disabled={!props.parameter.hasMax}
							value={props.parameter.max}
							onChange={event => props.onChangeMax(Number(event.target.value))}
						/>
					</InputGroup>
				</Col>
			</FormGroup>
		</Col>
	</Row>
	{props.parameter.hasMin && props.parameter.hasMax && <FormGroup row>
		<Label md={1} size='sm'>Show slider</Label>
		<Col md={11}>
			<Input
				bsSize='sm'
				type='checkbox'
				checked={props.parameter.useSlider}
				onChange={() => props.onToggleSlider()}
			/>
		</Col>
	</FormGroup>}
	<FormGroup row>
		<Label md={1} size='sm'>Default</Label>
		<Col md={11}>
			<Input
				bsSize='sm'
				type='number'
				value={props.parameter.default}
				onChange={event => props.onChangeDefault(Number(event.target.value))}
			/>
		</Col>
	</FormGroup>
</div>;

interface SwitchParameterFormProps {
	parameter: SwitchEntityParameter;
	selectedParameter: boolean;
	onToggleDefault: () => void;
}

const SwitchParameterForm = (props: SwitchParameterFormProps) => <div>
	<ButtonGroup size='sm'>
		<Button
			outline
			color={props.selectedParameter ? 'light' : 'dark'}
			active={!props.parameter.default}
			onClick={() => {
				if (props.parameter.default) props.onToggleDefault();
			}}
		>
			Off by default
		</Button>
		<Button
			outline
			color={props.selectedParameter ? 'light' : 'dark'}
			active={props.parameter.default}
			onClick={() => {
				if (!props.parameter.default) props.onToggleDefault();
			}}
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
	onChangeDefaultText: (defaultValue: string) => void;
	onToggleHasMin: () => void;
	onChangeMin: (min: number) => void;
	onToggleHasMax: () => void;
	onChangeMax: (max: number) => void;
	onToggleSlider: () => void;
	onChangeDefaultNumber: (defaultValue: number) => void;
	onToggleDefaultSwitchValue: () => void;
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
		isTextEntityParameter(props.parameter) ? <TextParameterForm
			parameter={props.parameter}
			onChangeDefault={props.onChangeDefaultText}
		/>
		: isNumberEntityParameter(props.parameter) ? <NumberParameterForm
			parameter={props.parameter}
			onToggleHasMin={props.onToggleHasMin}
			onChangeMin={props.onChangeMin}
			onToggleHasMax={props.onToggleHasMax}
			onChangeMax={props.onChangeMax}
			onToggleSlider={props.onToggleSlider}
			onChangeDefault={props.onChangeDefaultNumber}
		/>
		: isSwitchEntityParameter(props.parameter) ? <SwitchParameterForm
			parameter={props.parameter}
			selectedParameter={props.selectedParameter}
			onToggleDefault={props.onToggleDefaultSwitchValue}
		/>
		: ''
	}
</Form>;

export default ParameterEditor;
