import Octicon, { ArrowDown, ArrowUp, Trashcan } from '@githubprimer/octicons-react';
import React from 'react';
import { Button, ButtonGroup, Form, FormGroup, Input, Label, Navbar, UncontrolledTooltip } from 'reactstrap';
import Layer from '../../../data/layer/layer';
import SidebarSection from './sidebar-section';

export interface Props {
	layer: Layer;
	canMoveLayerUp: boolean;
	canMoveLayerDown: boolean;
	canDeleteLayer: boolean;
	onChangeLayerName: (name: string) => void;
	onMoveLayerUp: () => void;
	onMoveLayerDown: () => void;
	onDeleteLayer: () => void;
	onBlur: () => void;
}

export default (props: Props) => <SidebarSection
	name='Layer options'
>
	<Form>
		<FormGroup>
			<Label size='sm'>Layer name</Label>
			<Input
				bsSize='sm'
				value={props.layer.name}
				onChange={event => {props.onChangeLayerName(event.target.value); }}
				onBlur={() => props.onBlur()}
			/>
		</FormGroup>
	</Form>
	<Navbar style={{padding: 0}}>
		<ButtonGroup>
			<Button
				id='moveLayerUpButton'
				size='sm'
				disabled={!props.canMoveLayerUp}
				onClick={() => props.onMoveLayerUp()}
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
				disabled={!props.canMoveLayerDown}
				onClick={() => props.onMoveLayerDown()}
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
			disabled={!props.canDeleteLayer}
			onClick={() => props.onDeleteLayer()}
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
