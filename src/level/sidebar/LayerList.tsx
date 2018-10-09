import React from 'react';
import Level from '../../data/Level';
import { ListGroup, ListGroupItem } from 'reactstrap';
import GeometryLayer from '../../data/layer/GeometryLayer';
import SidebarSection from './SidebarSection';

export interface Props {
	level: Level,
	selectedLayerIndex: number,
	onSelectLayer: (layerIndex: number) => void,
}

export default (props: Props) =>
	<SidebarSection
		name='Layers'
		flush
		startExpanded
	>
		<ListGroup flush>
			{props.level.layers.map((layer, i) =>
				<ListGroupItem
					active={props.selectedLayerIndex === i}
					onClick={() => props.onSelectLayer(i)}
				>
					{layer.name + ' (' + layer.type + ')'}
				</ListGroupItem>
			)}
		</ListGroup>
	</SidebarSection>
