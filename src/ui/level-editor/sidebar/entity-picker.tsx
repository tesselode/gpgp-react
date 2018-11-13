/*import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Image from '../../../data/image-data';
import Project from '../../../data/project';
import ColorDisplay from '../../common/color-display';
import SidebarSection from './sidebar-section';

interface Props {
	project: Project;
	images: Map<string, Image>;
	selectedEntityIndex: number;
	onSelectEntity: (entityIndex: number) => void;
}

const EntityPicker = (props: Props) => <SidebarSection
	name='Entities'
	flush
	startExpanded
>
	<ListGroup flush>
		{props.project.entities.map((entity, i) =>
			<ListGroupItem
				key={i}
				active={props.selectedEntityIndex === i}
				onClick={() => props.onSelectEntity(i)}
				className='compact-list-group-item'
			>
				{entity.imagePath && props.images.get(entity.imagePath) ?
					<img
						src={props.images.get(entity.imagePath).data}
						style={{
							width: 'auto',
							height: '1em',
						}}
					/>
					: ColorDisplay(entity.color)
				}
				&nbsp;&nbsp;
				{entity.name}
			</ListGroupItem>,
		)}
	</ListGroup>
</SidebarSection>;

export default EntityPicker;
*/
