import React from 'react';
import GeometryLayer from '../../../data/level/layer/geometry-layer';
import Project from '../../../data/project/project';

interface Props {
    project: Project;
    layer: GeometryLayer;
    context?: CanvasRenderingContext2D;
}

export default class GeometryLayerDisplay extends React.Component<Props> {
    public render() {
        if (this.props.context) {
            const tileSize = this.props.project.data.tileSize;
            this.props.context.fillStyle = 'rgba(39, 187, 232, .33)';
            for (const item of this.props.layer.data.items) {
                this.props.context.fillRect(item.x * tileSize, item.y * tileSize, tileSize, tileSize);
            }
        }
        return null;
    }
}
