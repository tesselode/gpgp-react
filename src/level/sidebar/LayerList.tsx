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
	>
		<ListGroup flush>
			{props.level.layers.map((layer, i) => {
				let layerType = layer instanceof GeometryLayer && 'Geometry';
				return <ListGroupItem
					active={props.selectedLayerIndex === i}
					onClick={() => props.onSelectLayer(i)}
				>
					{layer.name + ' (' + layerType + ')'}
				</ListGroupItem>;
			})}
		</ListGroup>
	</SidebarSection>
