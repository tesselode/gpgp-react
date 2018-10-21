import React from 'react';
import SidebarSection from './SidebarSection';
import { Form, FormGroup, InputGroup, Label, Input, InputGroupAddon } from 'reactstrap';
import Level from '../../data/Level';

export interface Props {
	level: Level;
	onChangeLevelWidth: (width: number) => void;
	onChangeLevelHeight: (height: number) => void;
	onBlur: () => void;
}

export default (props: Props) => <SidebarSection
	name='Level options'
>
	<Form>
		<FormGroup>
			<Label size='sm'>Level width</Label>
			<InputGroup size='sm'>
				<Input
					type='number'
					value={props.level.width}
					onChange={event => {
						let width = Number(event.target.value);
						if (width !== NaN && width > 0)
							props.onChangeLevelWidth(width);
					}}
					onBlur={() => props.onBlur()}
				/>
				<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
			</InputGroup>
		</FormGroup>
		<FormGroup>
			<Label size='sm'>Level height</Label>
			<InputGroup size='sm'>
				<Input
					type='number'
					value={props.level.height}
					onChange={event => {
						let height = Number(event.target.value);
						if (height !== NaN && height > 0)
							props.onChangeLevelHeight(height);
					}}
					onBlur={() => props.onBlur()}
				/>
				<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
			</InputGroup>
		</FormGroup>
	</Form>
</SidebarSection>
