import React from 'react';
import { Form, FormGroup, Input, InputGroup, InputGroupAddon, Label } from 'reactstrap';
import Level from '../../../data/level';
import SidebarSection from './sidebar-section';

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
						const width = Number(event.target.value);
						if (!isNaN(width) && width > 0)
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
						const height = Number(event.target.value);
						if (!isNaN(height) && height > 0)
							props.onChangeLevelHeight(height);
					}}
					onBlur={() => props.onBlur()}
				/>
				<InputGroupAddon addonType='append'>tiles</InputGroupAddon>
			</InputGroup>
		</FormGroup>
	</Form>
</SidebarSection>;
