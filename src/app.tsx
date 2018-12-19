import React from 'react';
import Grid from './ui/grid';
import GeometryLayerDisplay from './ui/layer-display/geometry-layer-display';

type LayerDisplay = GeometryLayerDisplay;

export default class App extends React.Component {
	private layerDisplays: LayerDisplay[] = [new GeometryLayerDisplay()];

	public render() {
		return <div>
			<Grid
				viewportWidth={window.innerWidth}
				viewportHeight={window.innerHeight}
				width={32}
				height={18}
				content={this.layerDisplays}
			/>
		</div>;
	}
}
