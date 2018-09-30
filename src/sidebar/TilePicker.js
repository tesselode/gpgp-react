import React from 'react';
import SidebarSection from './SidebarSection';
import Editor from '../editor/Editor';

const TilePicker = (props) =>
	<SidebarSection
		title={'Tiles (' + props.tilesetName + ')'}
		flush
	>
		<div
			style={{
				maxHeight: '20em',
				overflow: 'auto',
			}}
		>
			<Editor
				startingZoom={.5}
				gridMode={props.gridMode}
				project={props.project}
				mapWidth={props.tileset.imageWidth / props.project.tileSize}
				mapHeight={props.tileset.imageHeight / props.project.tileSize}
				layers={[
					{
						name: 'Tileset',
						type: 'tilePreview',
						tileset: props.tileset,
						selectedTileX: props.selectedTileX,
						selectedTileY: props.selectedTileY,
					},
				]}
				onPlace={(x, y) => props.onTileSelected(x, y)}
				onRemove={() => {}}
				onMouseUp={() => {}}
			/>
		</div>
	</SidebarSection>

export default TilePicker;
