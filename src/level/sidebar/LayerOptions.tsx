import React from 'react';
import SidebarSection from './SidebarSection';
import { Form, FormGroup, Label, Input, Navbar, ButtonGroup, Button } from 'reactstrap';
import Layer from '../../data/layer/Layer';
import Octicon, { ArrowUp, ArrowDown, Trashcan } from '@githubprimer/octicons-react';

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
			<Label>Layer name</Label>
			<Input
				value={props.layer.name}
				onChange={event => {props.onChangeLayerName(event.target.value)}}
				onBlur={() => props.onBlur()}
			/>
		</FormGroup>
	</Form>
	<Navbar style={{padding: 0}}>
		<ButtonGroup>
			<Button
				size='sm'
				disabled={!props.canMoveLayerUp}
				onClick={() => props.onMoveLayerUp()}
			>
				<Octicon icon={ArrowUp} />
			</Button>
			<Button
				size='sm'
				disabled={!props.canMoveLayerDown}
				onClick={() => props.onMoveLayerDown()}
			>
				<Octicon icon={ArrowDown} />
			</Button>
		</ButtonGroup>
		<Button
			size='sm'
			color='danger'
			disabled={!props.canDeleteLayer}
			onClick={() => props.onDeleteLayer()}
		>
			<Octicon icon={Trashcan} />
		</Button>
	</Navbar>
</SidebarSection>
