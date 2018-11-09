import React from 'react';
import Project, { getProjectEntity } from '../../../data/project';
import { EntityLayerItem } from '../../../data/layer/entity-layer';
import SidebarSection from './sidebar-section';
import { Form, FormGroup, Label, Input, Col, Button } from 'reactstrap';
import Octicon, { Trashcan } from '@githubprimer/octicons-react';
import { isNumberEntityParameter } from '../../../data/entity';

interface Props {
	project: Project;
	item: EntityLayerItem;
}

const EntityOptions = (props: Props) => {
	const entity = getProjectEntity(props.project, props.item.entityName);
	return <SidebarSection
		name='Entity options'
		startExpanded
	>
		<Form>
			<FormGroup>
				<Label size='sm'>
					Entity type: <strong>{entity ? entity.name : 'Undefined'}</strong>
				</Label>
			</FormGroup>
			{entity && entity.parameters.map((parameter, i) => {
				if (isNumberEntityParameter(parameter))
					return <FormGroup row>
						<Label md={4} size='sm'>{parameter.name}</Label>
						<Col md={8}>
							<Input bsSize='sm' type='number' />
						</Col>
					</FormGroup>;
			})}
		</Form>
		<Button
			size='sm'
			color='danger'
		>
			<Octicon icon={Trashcan} />
		</Button>
	</SidebarSection>;
}

export default EntityOptions;
