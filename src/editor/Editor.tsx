import React from 'react';
import Project from '../data/Project';
import Level from '../data/Level';
import Grid from './Grid';

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
		</div>;
	}
}
