import Image from "../../../data/image";
import TileLayer from "../../../data/level/layer/tile-layer";
import Project from "../../../data/project/project";

interface Props {
    project: Project;
    images: Map<string, Image>;
    layer: TileLayer;
}

const TileLayerDisplay = (props: Props) =>
    (context: CanvasRenderingContext2D) => {
        const tileSize = props.project.data.tileSize;
        const tileset = props.project.getTileset(props.layer.data.tilesetName);
        const tilesetImage = props.images.get(tileset.data.imagePath);
        if (!tilesetImage || !tilesetImage.element) return;
        context.imageSmoothingEnabled = false;
        props.layer.data.items.forEach(item => {
            context.drawImage(tilesetImage.element,
                item.tileX * tileSize, item.tileY * tileSize,
                tileSize, tileSize,
                item.x * tileSize, item.y * tileSize,
                tileSize, tileSize);
        });
    };

export default TileLayerDisplay;
