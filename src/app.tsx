import React from 'react';
import GeometryLayer from './data/layer/geometry-layer';
import Level from './data/level';
import Rect from './data/rect';
import Grid from './ui/grid';
import GeometryLayerDisplay from './ui/layer-display/geometry-layer-display';

type LayerDisplay = GeometryLayerDisplay;

interface State {
	level: Level;
	selectedLayerIndex: number;
}

export default class App extends React.Component<{}, State> {
	private layerDisplays: LayerDisplay[] = [];

	constructor(props: {}) {
		super(props);
		this.state = {
			level: Level.New(),
			selectedLayerIndex: 0,
		};
		this.state.level.data.layers.forEach(layer => {
			if (layer instanceof GeometryLayer)
				this.layerDisplays.push(new GeometryLayerDisplay(layer));
		});

		this.onClick = this.onClick.bind(this);
	}

	private place(rect: Rect) {
		const layer = this.state.level.data.layers[this.state.selectedLayerIndex].place(rect);
		this.setState({
			level: this.state.level.setLayer(this.state.selectedLayerIndex, layer),
		});
		this.layerDisplays[this.state.selectedLayerIndex].update(layer);
	}

	private onClick(cursorX: number, cursorY: number) {
		this.place(new Rect(cursorX, cursorY, cursorX, cursorY));
	}

	public render() {
		return <div>
			<Grid
				viewportWidth={window.innerWidth}
				viewportHeight={window.innerHeight}
				width={32}
				height={18}
				content={this.layerDisplays}
				onClick={this.onClick}
			/>
		</div>;
	}
}
