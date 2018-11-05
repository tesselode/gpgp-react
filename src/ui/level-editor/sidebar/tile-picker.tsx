import React from 'react';
import Image from '../../../data/image-data';
import Project from '../../../data/project';
import { Rect } from '../../../util';
import Grid from '../../grid';
import SidebarSection from './sidebar-section';

interface Props {
	project: Project;
	tilesetName: string;
	tilesetImageData?: Image;
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
			selection: {
				l: this.state.cursorX,
				t: this.state.cursorY,
				r: this.state.cursorX,
				b: this.state.cursorY,
			},
		});
	}

	private onRelease() {
		if (this.state.selection) {
			this.setState({mouseDown: false});
			this.props.onSelectTiles(this.state.selection);
		}
	}

	private onMove(x: number, y: number) {
		this.setState({cursorX: x, cursorY: y});
		if (this.state.mouseDown) {
			this.setState({selection: {
				l: this.state.selection.l,
				t: this.state.selection.t,
				r: x,
				b: y,
			}});
		}
	}

	public render() {
		return <SidebarSection
			name={'Tiles - ' + this.props.tilesetName}
			startExpanded={true}
			flush
		>
			{this.props.tilesetImageData && (this.props.tilesetImageData.error ? this.props.tilesetImageData.error :
				<div
					style={{
						width: '100%',
						height: '15em',
						overflow: 'auto',
						transformOrigin: '0% 0%',
						transform: 'scale(' + 1 + ')',
						imageRendering: 'pixelated',
						transition: '.15s',
					}}
				>
					<Grid
						tileSize={this.props.project.tileSize}
						width={Math.ceil(this.props.tilesetImageData.width / this.props.project.tileSize)}
						height={Math.ceil(this.props.tilesetImageData.height / this.props.project.tileSize)}
						startingZoom={1}
						onClick={this.onClick.bind(this)}
						onRelease={this.onRelease.bind(this)}
						onMove={this.onMove.bind(this)}
					>
						<img src={this.props.tilesetImageData.data}/>
						{this.state.selection && <div
							style={{
								position: 'absolute',
								zIndex: 2,
								left: this.state.selection.l * this.props.project.tileSize + 'px',
								top: this.state.selection.t * this.props.project.tileSize + 'px',
								width: this.props.project.tileSize * (this.state.selection.r - this.state.selection.l + 1) + 1 + 'px',
								height: this.props.project.tileSize * (this.state.selection.b - this.state.selection.t + 1) + 1 + 'px',
								border: '1px solid red',
								pointerEvents: 'none',
							}}
						/>}
					</Grid>
				</div>
			)}
		</SidebarSection>;
	}
}
