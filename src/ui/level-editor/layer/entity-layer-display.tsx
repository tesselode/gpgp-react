import Project from "../../../data/project/project";
import Image from "../../../data/image";
import EntityLayer from "../../../data/level/layer/entity-layer";

interface Props {
    project: Project;
    images: Map<string, Image>;
    layer: EntityLayer;
}

const EntityLayerDisplay = (props: Props) =>
    (context: CanvasRenderingContext2D) => {
        const tileSize = props.project.data.tileSize;
        context.imageSmoothingEnabled = false;
        props.layer.data.items.forEach(item => {
            const entity = props.project.getEntity(item.entityName);
            if (entity.data.imagePath) {
                const entityImage = props.images.get(entity.data.imagePath);
                if (entityImage && entityImage.element)
                    context.drawImage(entityImage.element,
                        item.x * tileSize, item.y * tileSize);
            } else {
                context.fillStyle = entity.data.color;
                context.fillRect(item.x * tileSize, item.y * tileSize,
                    entity.data.width * tileSize, entity.data.height * tileSize);
            }
        });
    };

export default EntityLayerDisplay;
