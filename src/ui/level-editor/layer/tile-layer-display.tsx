import React from 'react';
import Image from "../../../data/image";
import TileLayer from "../../../data/level/layer/tile-layer";
import Project from "../../../data/project/project";
import { Container, Sprite, Graphics } from "@inlet/react-pixi";
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
    if (!tilesetImage || !tilesetImage.texture) return null;
    return <Container>
        {
            props.layer.data.items.map((item, i) => <Sprite
                key={i}
                texture={tilesetImage.texture}
                position={new PIXI.Point(item.x * tileSize, item.y * tileSize)}
                width={tileSize}
                height={tileSize}
                scale={new PIXI.Point(1, 1)}
            />)
        }
    </Container>;
};

export default TileLayerDisplay;
