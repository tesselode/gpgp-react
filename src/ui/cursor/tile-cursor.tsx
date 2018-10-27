import React from 'react';
import GenericCursor, { CursorProps } from './generic-cursor';
import { TilesetImage } from '../../data/project-resources';
import { Rect } from '../../util';
import { GridTool } from '../grid';

export interface TileCursorProps {
	tool: GridTool;
	tilesetImage: TilesetImage;
	tilesetSelection?: Rect;
}

const renderCroppedTilesetImage = (tileSize: number, imageData: string, x: number, y: number, region: Rect, key?: number) =>
	<div
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
	</div>

const pencil = (tileCursorProps: TileCursorProps, props: CursorProps) =>
	tileCursorProps.tilesetSelection && renderCroppedTilesetImage(
		props.tileSize,
		tileCursorProps.tilesetImage.data,
		props.cursor.l,
		props.cursor.t,
		tileCursorProps.tilesetSelection
	)

const rectangle = (tileCursorProps: TileCursorProps, props: CursorProps) => {
	let cursor = props.cursor;
	let tiles = tileCursorProps.tilesetSelection;
	let elements = [];
	let key = 0;
	for (let x = cursor.l; x <= cursor.r; x += (tiles.r - tiles.l + 1)) {
		for (let y = cursor.t; y <= cursor.b; y += (tiles.b - tiles.t + 1)) {
			key++;
			elements.push(renderCroppedTilesetImage(
				props.tileSize,
				tileCursorProps.tilesetImage.data,
				x - cursor.l,
				y - cursor.t,
				tileCursorProps.tilesetSelection,
				key,
			));
		}
	}
	return <div
		style={{
			position: 'absolute',
			left: props.tileSize * cursor.l + 'px',
			top: props.tileSize * cursor.t + 'px',
			width: props.tileSize * (cursor.r - cursor.l + 1) + 'px',
			height: props.tileSize * (cursor.b - cursor.t + 1) + 'px',
			pointerEvents: 'none',
			overflow: 'hidden',
		}}
	>
		{elements}
	</div>
}

export default (tileCursorProps: TileCursorProps) =>
	(props: CursorProps) => <div>
		{GenericCursor(props)}
		{!props.removing &&
			tileCursorProps.tilesetSelection &&
			tileCursorProps.tilesetImage &&
			tileCursorProps.tilesetImage.data &&
			<div
				style={{
					opacity: props.enabled ? .67 : 0,
				}}
			>
				{tileCursorProps.tool === GridTool.Pencil ? pencil(tileCursorProps, props)
					: tileCursorProps.tool === GridTool.Rectangle ? rectangle(tileCursorProps, props)
					: ''
				}
			</div>
		}
	</div>
