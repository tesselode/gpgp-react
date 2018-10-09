import React from 'react';
import {
	Col,
	FormGroup,
	Label,
	InputGroup,
	InputGroupAddon,
	Input,
	FormFeedback,
} from 'reactstrap';
import { InputType } from 'reactstrap/lib/Input';

export interface Props {
	label: string;
	type?: InputType;
	value: any;
	isValid: (value: any) => boolean;
	onChange: (value: any) => void;
	units?: string;
	errorMessage: string;
}

export default (props: Props) => <FormGroup row>
	<Label md={2}>{props.label}</Label>
	<Col md={10}>
		<InputGroup>
			<Input
				type={props.type}
				value={props.value}
				invalid={!props.isValid(props.value)}
				onChange={(event) => props.onChange(event.target.value)}
			/>
			{props.units && <InputGroupAddon addonType='append'>
				{props.units}
			</InputGroupAddon>}
			<FormFeedback tooltip>
				{props.errorMessage}
			</FormFeedback>
		</InputGroup>
	</Col>
</FormGroup>
