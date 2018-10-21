import React from 'react';
import SidebarSection from './SidebarSection';
import Project from '../../data/Project';
import Grid from '../Grid';
import { TilesetImage } from '../../data/ProjectResources';

export interface Props {
	project: Project;
	tilesetImageData: TilesetImage;
}

export default (props: Props) => <SidebarSection
	name='Tile picker'
	startExpanded={true}
	flush
>
	{props.tilesetImageData.error ? props.tilesetImageData.error :
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
				onMouseMove={() => {}}
				onMouseEnter={() => {}}
				onMouseLeave={() => {}}
			/>
			<img src={props.tilesetImageData.data}/>
		</div>
	}
</SidebarSection>
