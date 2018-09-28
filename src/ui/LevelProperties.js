import React from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import SidebarSection from './SidebarSection';

function validateLevelSize(value) {
	return !isNaN(value) && value > 0;
}

const LevelProperties = (props) =>
	<SidebarSection title='Level properties'>
		<Form>
			<FormGroup>
				<Label size='sm'>Level width</Label>
				<Input
					size='sm'
					type='number'
					value={props.level.width}
					onChange={(event) => {
						if (validateLevelSize(event.target.value))
							props.onLevelWidthChanged(event.target.value)
					}}
					onBlur={(event) => props.onInputBlurred()}
				/>
			</FormGroup>
			<FormGroup>
				<Label size='sm'>Level height</Label>
				<Input
					size='sm'
					type='number'
					value={props.level.height}
					onChange={(event) => {
						if (validateLevelSize(event.target.value))
							props.onLevelHeightChanged(event.target.value)
					}}
					onBlur={(event) => props.onInputBlurred()}
				/>
			</FormGroup>
		</Form>
	</SidebarSection>

export default LevelProperties;
