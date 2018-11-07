import React from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import Level from '../../../data/level';
import SidebarSection from './sidebar-section';

export interface Props {
	/** The currently opened level. */
	level: Level;
	/** The number of the selected layer. */
	selectedLayerIndex: number;
	/** A function that is called when the level is modified. Returns the description of the action taken. */
	modifyLevel: (f: (level: Level) => string | false, continuedAction?: boolean) => void;
	/** A function that is called when an input is blurred. */
	onBlur: () => void;
}

/** A form for changing a layer's settings. */
export default (props: Props) => {
	const selectedLayer = props.level.layers[props.selectedLayerIndex];
	return <SidebarSection
		name='Layer options'
	>
		<Form>
			<FormGroup>
				<Label size='sm'>Layer name</Label>
				<Input
					bsSize='sm'
					value={selectedLayer.name}
					onChange={event => props.modifyLevel(level => {
						level.layers[props.selectedLayerIndex].name = event.target.value;
						return 'Rename layer to "' + event.target.value + '"';
					}, true)}
					onBlur={() => props.onBlur()}
				/>
			</FormGroup>
		</Form>
	</SidebarSection>;
};
