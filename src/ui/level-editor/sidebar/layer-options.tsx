import Octicon, { ArrowDown, ArrowUp, Trashcan } from '@githubprimer/octicons-react';
import React from 'react';
import { Button, ButtonGroup, Form, FormGroup, Input, Label, Navbar, UncontrolledTooltip } from 'reactstrap';
import Level from '../../../data/level';
import { shiftDown, shiftUp } from '../../../util';
import SidebarSection from './sidebar-section';

export interface Props {
	level: Level;
	selectedLayerIndex: number;
	modifyLevel: (f: (level: Level) => string | false, continuedAction?: boolean) => void;
	onBlur: () => void;
}

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
					})}
					onBlur={() => props.onBlur()}
				/>
			</FormGroup>
		</Form>
	</SidebarSection>;
};
