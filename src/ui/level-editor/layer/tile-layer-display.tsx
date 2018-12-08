import React from 'react';
import Image from "../../../data/image";
import TileLayer from "../../../data/level/layer/tile-layer";
import Project from "../../../data/project/project";
import { Container, Sprite } from "@inlet/react-pixi";
import * as PIXI from 'pixi.js';

interface Props {
    project: Project;
    images: Map<string, Image>;
    layer: TileLayer;
}

const TileLayerDisplay = (props: Props) => {
    const tileSize = props.project.data.tileSize;
    const tileset = props.project.getTileset(props.layer.data.tilesetName);
    const tilesetImage = props.images.get(tileset.data.imagePath);
    if (!tilesetImage || !tilesetImage.element) return null;
    return <div>
        {
            props.layer.data.items.map((item, i) => <Container
                key={i}
                position={[item.x * tileSize, item.y * tileSize]}
                width={tileSize}
                height={tileSize}
            >
                <Sprite
                    texture={new PIXI.Texture(new PIXI.BaseTexture(tilesetImage.element))}
                />
            </Container>)
        }
    </div>;
};

export default TileLayerDisplay;
