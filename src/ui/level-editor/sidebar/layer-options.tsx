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
		<Navbar style={{padding: 0}}>
			<ButtonGroup>
				<Button
					id='moveLayerUpButton'
					size='sm'
					disabled={props.selectedLayerIndex === 0}
					onClick={() => props.modifyLevel(level => {
						const layer = level.layers[props.selectedLayerIndex];
						shiftUp(level.layers, props.selectedLayerIndex);
						return 'Move layer "' + layer.name + '" up';
					})}
				>
					<Octicon icon={ArrowUp} />
				</Button>
				<UncontrolledTooltip
					delay={{show: 500, hide: 0}}
					target='moveLayerUpButton'
				>
					Move layer up
				</UncontrolledTooltip>
				<Button
					id='moveLayerDownButton'
					size='sm'
					disabled={props.selectedLayerIndex === props.level.layers.length - 1}
					onClick={() => props.modifyLevel(level => {
						const layer = level.layers[props.selectedLayerIndex];
						shiftDown(level.layers, props.selectedLayerIndex);
						return 'Move layer "' + layer.name + '" down';
					})}
				>
					<Octicon icon={ArrowDown} />
				</Button>
				<UncontrolledTooltip
					delay={{show: 500, hide: 0}}
					target='moveLayerDownButton'
				>
					Move layer down
				</UncontrolledTooltip>
			</ButtonGroup>
			<Button
				id='deleteLayerButton'
				size='sm'
				color='danger'
				disabled={props.level.layers.length < 2}
				onClick={() => props.modifyLevel(level => {
					const layer = level.layers[props.selectedLayerIndex];
					level.layers.splice(props.selectedLayerIndex, 1);
					return 'Delete layer "' + layer.name + '"';
				})}
			>
				<Octicon icon={Trashcan} />
			</Button>
			<UncontrolledTooltip
				delay={{show: 500, hide: 0}}
				target='deleteLayerButton'
			>
				Delete layer
			</UncontrolledTooltip>
		</Navbar>
	</SidebarSection>;
};
