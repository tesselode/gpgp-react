/* import Octicon, { Trashcan } from '@githubprimer/octicons-react';
import React from 'react';
import { Button, Col, Form, FormGroup, Input, Label } from 'reactstrap';
import { isNumberEntityParameter, isSwitchEntityParameter, isTextEntityParameter } from '../../../data/entity';
import EntityLayer, { EntityLayerItem } from '../../../data/layer/entity-layer';
import Project, { getProjectEntity } from '../../../data/project';
import SidebarSection from './sidebar-section';
import { isNullOrUndefined } from 'util';

interface Props {
	project: Project;
	layer: EntityLayer;
	itemIndex: number;
	modifyLayer: (f: (layer: EntityLayer) => string | false, continuedAction?: boolean) => void;
	onBlur: () => void;
}

const EntityOptions = (props: Props) => {
	const item = props.layer.items[props.itemIndex];
	const entity = getProjectEntity(props.project, item.entityName);
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
				if (isTextEntityParameter(parameter))
					return <FormGroup row>
						<Label md={4} size='sm'>{parameter.name}</Label>
						<Col md={8}>
							<Input
								bsSize='sm'
								value={item.parameters[parameter.name] || parameter.default}
								onChange={event => props.modifyLayer(layer => {
									const item = layer.items[props.itemIndex];
									item.parameters[parameter.name] = event.target.value;
									return 'Change ' + parameter.name + ' to ' + event.target.value;
								}, true)}
								onBlur={() => props.onBlur()}
							/>
						</Col>
					</FormGroup>;
				if (isNumberEntityParameter(parameter))
					return <FormGroup row>
						<Label md={4} size='sm'>{parameter.name}</Label>
						<Col md={8}>
							<Input
								bsSize='sm'
								type='number'
								value={item.parameters[parameter.name] || parameter.default}
								onChange={event => props.modifyLayer(layer => {
									const item = layer.items[props.itemIndex];
									item.parameters[parameter.name] = Number(event.target.value);
									return 'Change ' + parameter.name + ' to ' + event.target.value;
								}, true)}
								onBlur={() => props.onBlur()}
							/>
						</Col>
					</FormGroup>;
				if (isSwitchEntityParameter(parameter))
					return <FormGroup check>
						<Label size='sm' check>
							<Input
								type='checkbox'
								checked={!isNullOrUndefined(item.parameters[parameter.name]) ?
									item.parameters[parameter.name] : parameter.default}
								onChange={event => props.modifyLayer(layer => {
									const item = layer.items[props.itemIndex];
									item.parameters[parameter.name] = item.parameters[parameter.name] ? false : true;
									return 'Toggle ' + parameter.name;
								})}
							/>
							{parameter.name}
						</Label>
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
*/
