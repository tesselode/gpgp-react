import React from 'react';
import Project from '../data/Project';
import Level from '../data/Level';
import Grid from './Grid';
import GeometryLayer from '../data/layer/GeometryLayer';
import GeometryLayerDisplay from './layer/GeometryLayerDisplay';

export interface Props {
	project: Project,
	level: Level,
}

export default class Editor extends React.Component<Props> {
	render() {
		return <div>
			<Grid
				project={this.props.project}
				level={this.props.level}
			/>
			{this.props.level.layers.map(layer => {
				if (layer instanceof GeometryLayer) {
					return <GeometryLayerDisplay
						project={this.props.project}
						level={this.props.level}
						layer={layer}
					/>;
				}
			})}
		</div>;
	}
}
