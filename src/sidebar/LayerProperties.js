import React from 'react';
import { Form, FormGroup, Label, Input, ButtonGroup, Button, Navbar } from 'reactstrap';
import SidebarSection from './SidebarSection';

const LayerProperties = (props) =>
	<SidebarSection title='Layer properties'>
		<Form>
			<FormGroup>
				<Label size='sm'>Layer name</Label>
				<Input
					size='sm'
					value={props.layer.name}
					onChange={(event) => {
						props.onLayerNameChanged(event.target.value);
					}}
					onBlur={(event) => props.onInputBlurred()}
				/>
			</FormGroup>
			<FormGroup>
				<Navbar style={{padding: 0}}>
					<ButtonGroup>
						<Button
							size='sm'
							disabled={!props.allowMovingUp}
							onClick={() => props.onLayerMovedUp()}
						>
							▲
						</Button>
						<Button
							size='sm'
							disabled={!props.allowMovingDown}
							onClick={() => props.onLayerMovedDown()}
						>
							▼
						</Button>
					</ButtonGroup>
					<Button
						size='sm'
						color='danger'
						disabled={!props.allowDeleting}
						onClick={() => props.onLayerDeleted()}
					>
						Delete
					</Button>
				</Navbar>
			</FormGroup>
		</Form>
	</SidebarSection>

export default LayerProperties;
