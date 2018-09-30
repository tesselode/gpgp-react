import React from 'react';
import { Form, FormGroup, Label, Input, ButtonGroup, Button, Navbar } from 'reactstrap';
import SidebarSection from './SidebarSection';
import Octicon, { ChevronUp, ChevronDown, Trashcan } from '@githubprimer/octicons-react';

const LayerProperties = (props) =>
	<SidebarSection title='Layer properties'>
		<Form>
			<FormGroup>
				<Label size='sm'>Layer name</Label>
				<Input
					bsSize='sm'
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
							<Octicon icon={ChevronUp} ariaLabel='Move layer up' />
						</Button>
						<Button
							size='sm'
							disabled={!props.allowMovingDown}
							onClick={() => props.onLayerMovedDown()}
						>
							<Octicon icon={ChevronDown} ariaLabel='Move layer down' />
						</Button>
					</ButtonGroup>
					<Button
						size='sm'
						color='danger'
						disabled={!props.allowDeleting}
						onClick={() => props.onLayerDeleted()}
					>
						<Octicon icon={Trashcan} ariaLabel='Delete layer' />
					</Button>
				</Navbar>
			</FormGroup>
		</Form>
	</SidebarSection>

export default LayerProperties;
