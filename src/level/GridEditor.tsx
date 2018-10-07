import React from 'react';
import Level from '../data/Level';
import Grid from './Grid';

export interface Props {
	level: Level;
}

export default class GridEditor extends React.Component<Props> {
	render() {
		return <div>
			<Grid
				level={this.props.level}
			/>
		</div>;
	}
}
