import React from 'react';
import { Label } from 'reactstrap';
import Image from '../../../data/image';
import TileLayer from '../../../data/level/layer/tile-layer';
import { Layer } from '../../../data/level/level';
import Project from '../../../data/project/project';
import Rect from '../../../data/rect';
import GridEditor from '../../common/grid-editor';
import SidebarSection from './sidebar-section';

interface Props {
	project: Project;
	images: Map<string, Image>;
	layer: Layer;
	sidebarWidth: number;
	onSelectTiles: (rect: Rect) => void;
}

interface State {
	cursorX: number;
	cursorY: number;
	selection?: Rect;
	mouseDown: boolean;
}

export default class TilePicker extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			cursorX: 0,
			cursorY: 0,
			mouseDown: false,
		};
	}

	private onClick() {
		this.setState({
			mouseDown: true,
			selection: new Rect(this.state.cursorX, this.state.cursorY),
		});
	}

	private onRelease() {
		if (this.state.selection) {
			this.setState({mouseDown: false});
			this.props.onSelectTiles(this.state.selection.normalized());
		}
	}

	private onMove(x: number, y: number) {
		this.setState({cursorX: x, cursorY: y});
		if (this.state.mouseDown) {
			this.setState({selection: new Rect(
				this.state.selection.l,
				this.state.selection.t,
				x,
				y,
			)});
		}
	}

	public render() {
		if (!(this.props.layer instanceof TileLayer)) return <SidebarSection
			name='Tiles'
			height='350px'
		>
			<Label size='sm' className='text-muted'>No tile layer selected</Label>
		</SidebarSection>;

		const tileset = this.props.project.getTileset(this.props.layer.data.tilesetName);
		const imageData = this.props.images.get(tileset.data.imagePath);
		if (!imageData || !imageData.element || imageData.error) return <SidebarSection
			name={'Tiles - ' + this.props.layer.data.tilesetName}
			height='350px'
		>
			<Label size='sm'>Error loading tileset image data</Label>
		</SidebarSection>;

		const normalizedSelection = this.state.selection && this.state.selection.normalized();
		const tileSize = this.props.project.data.tileSize;
		return <SidebarSection
			name={'Tiles - ' + this.props.layer.data.tilesetName}
			height='350px'
			startExpanded
			flush
		>
			{/* <GridEditor
				viewportWidth={this.props.sidebarWidth - 40}
				viewportHeight={320}
				tileSize={this.props.project.data.tileSize}
				width={Math.ceil(imageData.width / this.props.project.data.tileSize)}
				height={Math.ceil(imageData.height / this.props.project.data.tileSize)}
				onMoveCursor={this.onMove.bind(this)}
				onClick={this.onClick.bind(this)}
				onRelease={this.onRelease.bind(this)}
				layers={[
					(context: CanvasRenderingContext2D) => {
						context.imageSmoothingEnabled = false;
						context.drawImage(imageData.element, 0, 0);
						if (!normalizedSelection) return;
						context.strokeStyle = 'rgba(255, 0, 0, 1)';
						context.strokeRect(normalizedSelection.l * tileSize,
							normalizedSelection.t * tileSize,
							(normalizedSelection.r - normalizedSelection.l + 1) * tileSize,
							(normalizedSelection.b - normalizedSelection.t + 1) * tileSize);
					},
				]}
			/> */}
		</SidebarSection>;
	}
}
