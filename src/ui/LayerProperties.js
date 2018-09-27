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
						<Button>▲</Button>
						<Button>▼</Button>
					</ButtonGroup>
					<Button color='danger'>Delete</Button>
				</Navbar>
			</FormGroup>
		</Form>
	</SidebarSection>

export default LayerProperties;
