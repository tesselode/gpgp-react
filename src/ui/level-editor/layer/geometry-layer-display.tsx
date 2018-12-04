import GeometryLayer from '../../../data/level/layer/geometry-layer';
import Project from '../../../data/project/project';

interface Props {
    project: Project;
    layer: GeometryLayer;
}

const GeometryLayerDisplay = (props: Props) =>
    (context: CanvasRenderingContext2D) => {
        const tileSize = props.project.data.tileSize;
        context.fillStyle = 'rgba(39, 187, 232, .33)';
        for (const item of props.layer.data.items) {
            context.fillRect(item.x * tileSize, item.y * tileSize, tileSize, tileSize);
        }
    };

export default GeometryLayerDisplay;
