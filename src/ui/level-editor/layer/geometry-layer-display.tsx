import React from 'react';
import GeometryLayer from '../../../data/level/layer/geometry-layer';
import Project from '../../../data/project/project';
import { Graphics } from '@inlet/react-pixi';

interface Props {
    project: Project;
    layer: GeometryLayer;
}

const GeometryLayerDisplay = (props: Props) => <Graphics
    draw={g => {
        const tileSize = props.project.data.tileSize;
        g.clear();
        for (const item of props.layer.data.items) {
            g.beginFill(0x27BBE8, .33);
            g.drawRect(item.x * tileSize, item.y * tileSize, tileSize, tileSize);
            g.endFill();
        }
    }}
/>;

export default GeometryLayerDisplay;
