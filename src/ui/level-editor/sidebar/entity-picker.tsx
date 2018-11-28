import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Image from '../../../data/image';
import Project from '../../../data/project/project';
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
	maxHeight='20em'
	flush
	startExpanded
>
	<ListGroup flush>
		{props.project.data.entities.map((entity, i) =>
			<ListGroupItem
				key={i}
				active={props.selectedEntityIndex === i}
				onClick={() => props.onSelectEntity(i)}
				className='compact-list-group-item'
			>
				{
					entity.data.imagePath && props.images.get(entity.data.imagePath) ?
						<img
							src={props.images.get(entity.data.imagePath).data}
							style={{
								width: 'auto',
								height: '1em',
							}}
						/>
						: ColorDisplay(entity.data.color)
				}
				&nbsp;&nbsp;
				{entity.data.name}
			</ListGroupItem>,
		)}
	</ListGroup>
</SidebarSection>;

export default EntityPicker;
