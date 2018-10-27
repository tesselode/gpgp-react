import React from 'react';
import Project from '../../../data/project';
import { TilesetImage } from '../../../data/project-resources';
import { Rect } from '../../../util';
import Grid, { GridTool } from '../../grid';
import SidebarSection from './sidebar-section';

export interface Props {
	project: Project;
	tilesetName: string;
	tilesetImageData?: TilesetImage;
	selection?: Rect;
	onSelectTiles: (rect: Rect) => void;
}

export default (props: Props) => <SidebarSection
	name={'Tiles - ' + props.tilesetName}
	startExpanded={true}
	flush
>
	{props.tilesetImageData && (props.tilesetImageData.error ? props.tilesetImageData.error :
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
				tool={GridTool.Rectangle}
				tileSize={props.project.tileSize}
				width={Math.ceil(props.tilesetImageData.width / props.project.tileSize)}
				height={Math.ceil(props.tilesetImageData.height / props.project.tileSize)}
				startingZoom={1}
				onPlace={(rect) => {props.onSelectTiles(rect); }}
			>
				<img src={props.tilesetImageData.data}/>
				{props.selection && <div
					style={{
						position: 'absolute',
						zIndex: 2,
						left: props.selection.l * props.project.tileSize + 'px',
						top: props.selection.t * props.project.tileSize + 'px',
						width: props.project.tileSize * (props.selection.r - props.selection.l + 1) + 1 + 'px',
						height: props.project.tileSize * (props.selection.b - props.selection.t + 1) + 1 + 'px',
						border: '1px solid red',
						pointerEvents: 'none',
					}}
				/>}
			</Grid>
		</div>
	)}
</SidebarSection>;
