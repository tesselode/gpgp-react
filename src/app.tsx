import React from 'react';
import Grid from './grid';
import GeometryLayerDisplay from './layer/geometry';

export default class App extends React.Component {
	private geometryLayerDisplayRef = React.createRef<GeometryLayerDisplay>();

	public render() {
		return <div>
			<GeometryLayerDisplay
				ref={this.geometryLayerDisplayRef}
			/>
			<Grid
				viewportWidth={window.innerWidth}
				viewportHeight={window.innerHeight}
				width={32}
				height={18}
				layers={[this.geometryLayerDisplayRef]}
			/>
		</div>;
	}
}
