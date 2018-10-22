import React from 'react';
import SidebarSection from './SidebarSection';
import Project from '../../data/Project';
import Grid from '../Grid';
import { TilesetImage } from '../../data/ProjectResources';

export interface Props {
	project: Project;
	tilesetName: string;
	tilesetImageData?: TilesetImage;
	selectedTileX: number;
	selectedTileY: number;
	onSelectTile: (x: number, y: number) => void;
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
				tileSize={props.project.tileSize}
				width={Math.ceil(props.tilesetImageData.width / props.project.tileSize)}
				height={Math.ceil(props.tilesetImageData.height / props.project.tileSize)}
				startingZoom={1}
				onPlace={(x, y) => {
					props.onSelectTile(x, y)
				}}
			>
				<img src={props.tilesetImageData.data}/>
				<div style={{
					position: 'absolute',
					zIndex: 2,
					width: props.project.tileSize + 1 + 'px',
					height: props.project.tileSize + 1 + 'px',
					left: props.selectedTileX * props.project.tileSize + 'px',
					top: props.selectedTileY * props.project.tileSize + 'px',
					border: '1px solid red',
					pointerEvents: 'none',
				}}/>
			</Grid>
		</div>
	)}
</SidebarSection>
