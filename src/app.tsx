import React from 'react';
import Grid from './grid';
import GeometryLayerDisplay from './layer/geometry';

type LayerDisplay = GeometryLayerDisplay;

export default class App extends React.Component {
	private layerDisplays: LayerDisplay[] = [new GeometryLayerDisplay()];

	public render() {
		return <div>
			<Grid
				viewportWidth={window.innerWidth}
				viewportHeight={window.innerHeight - 64}
				width={32}
				height={18}
				content={this.layerDisplays}
			/>
		</div>;
	}
}
