import React from 'react';
import Image from '../../data/image-data';
import { Rect } from '../../util';
import { EditTool } from '../level-editor/edit-tool';
import GenericCursor from './generic-cursor';

interface Props {
	tileSize: number;
	cursor: Rect;
	removing?: boolean;
	tool: EditTool;
	tilesetImage: Image;
	tilesetSelection?: Rect;
}

export default class TileCursor extends React.Component<Props> {
	private renderCroppedTilesetImage(
		tileSize: number,
		imageData: string,
		x: number,
		y: number,
		region: Rect,
		key?: number,
	): JSX.Element {
		return <div
			key={key}
			style={{
				position: 'absolute',
				left: x * tileSize + 1 + 'px',
				top: y * tileSize + 1 + 'px',
				width: tileSize * (region.r - region.l + 1) + 'px',
				height: tileSize * (region.b - region.t + 1) + 'px',
				pointerEvents: 'none',
				overflow: 'hidden',
			}}
		>
			<img
				src={imageData}
				alt=''
				style={{
					position: 'absolute',
					left: -region.l * tileSize - 1 + 'px',
					top: -region.t * tileSize - 1 + 'px',
					pointerEvents: 'none',
					imageRendering: 'pixelated',
				}}
			/>
		</div>;
	}

	private pencil(): JSX.Element | string {
		return this.props.tilesetSelection ? this.renderCroppedTilesetImage(
			this.props.tileSize,
			this.props.tilesetImage.data,
			this.props.cursor.l,
			this.props.cursor.t,
			this.props.tilesetSelection,
		) : '';
	}

	private rectangle(): JSX.Element {
		const cursor = this.props.cursor;
		const tiles = this.props.tilesetSelection;
		const elements = [];
		let key = 0;
		for (let x = cursor.l; x <= cursor.r; x += (tiles.r - tiles.l + 1)) {
			for (let y = cursor.t; y <= cursor.b; y += (tiles.b - tiles.t + 1)) {
				key++;
				elements.push(this.renderCroppedTilesetImage(
					this.props.tileSize,
					this.props.tilesetImage.data,
					x - cursor.l,
					y - cursor.t,
					this.props.tilesetSelection,
					key,
				));
			}
		}
		return <div
			style={{
				position: 'absolute',
				left: this.props.tileSize * cursor.l + 'px',
				top: this.props.tileSize * cursor.t + 'px',
				width: this.props.tileSize * (cursor.r - cursor.l + 1) + 'px',
				height: this.props.tileSize * (cursor.b - cursor.t + 1) + 'px',
				pointerEvents: 'none',
				overflow: 'hidden',
			}}
		>
			{elements}
		</div>;
	}

	public render() {
		return <div>
			<GenericCursor
				tileSize={this.props.tileSize}
				cursor={this.props.cursor}
				removing={this.props.removing}
			/>
			{!this.props.removing &&
				this.props.tilesetSelection &&
				this.props.tilesetImage &&
				this.props.tilesetImage.data &&
				<div>
					{this.props.tool === EditTool.Pencil ? this.pencil()
						: this.props.tool === EditTool.Rectangle ? this.rectangle()
						: ''
					}
				</div>
			}
		</div>;
	}
}
