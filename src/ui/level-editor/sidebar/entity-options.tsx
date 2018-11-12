import Octicon, { Trashcan } from '@githubprimer/octicons-react';
import React from 'react';
import { Button, Col, Form, FormGroup, Input, Label } from 'reactstrap';
import { isNumberEntityParameter } from '../../../data/entity';
import { EntityLayerItem } from '../../../data/layer/entity-layer';
import Project, { getProjectEntity } from '../../../data/project';
import SidebarSection from './sidebar-section';

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
};

export default EntityOptions;
