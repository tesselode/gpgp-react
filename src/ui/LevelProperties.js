import React from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import SidebarSection from './SidebarSection';

function validateLevelSize(value) {
	return !isNaN(value) && value > 0;
}

const LevelProperties = (props) =>
	<SidebarSection title='Properties'>
		<Form>
			<FormGroup>
				<Label>Level width</Label>
				<Input
					type='number'
					value={props.level.width}
					onChange={(event) => {
						if (validateLevelSize(event.target.value))
							props.onLevelWidthChanged(event.target.value)
					}}
				/>
			</FormGroup>
			<FormGroup>
				<Label>Level height</Label>
				<Input
					type='number'
					value={props.level.height}
					onChange={(event) => {
						if (validateLevelSize(event.target.value))
							props.onLevelHeightChanged(event.target.value)
					}}
				/>
			</FormGroup>
		</Form>
	</SidebarSection>

export default LevelProperties;
