import React from 'react';
import { Form, FormGroup, Label, Input, ButtonGroup, Button, Navbar } from 'reactstrap';
import SidebarSection from './SidebarSection';

const LayerProperties = (props) =>
	<SidebarSection title='Layer properties'>
		<Form>
			<FormGroup>
				<Label>Layer name</Label>
				<Input
					value={props.layer.name}
					onChange={(event) => {
						props.onLayerNameChanged(event.target.value);
					}}
				/>
			</FormGroup>
			<FormGroup>
				<Navbar style={{padding: 0}}>
					<ButtonGroup>
						<Button
							disabled={!props.allowMovingUp}
							onClick={() => props.onLayerMovedUp()}
						>
							▲
						</Button>
						<Button
							disabled={!props.allowMovingDown}
							onClick={() => props.onLayerMovedDown()}
						>
							▼
						</Button>
					</ButtonGroup>
					<Button
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
