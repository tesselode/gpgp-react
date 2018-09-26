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
				mapWidth={props.tileset.imageWidth / props.tileset.tileSize}
				mapHeight={props.tileset.imageHeight / props.tileset.tileSize}
				project={props.project}
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
			/>
		</div>
	</SidebarSection>

export default TilePicker;
