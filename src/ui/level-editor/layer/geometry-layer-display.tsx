import * as PIXI from 'pixi.js';
import GeometryLayer from "../../../data/level/layer/geometry-layer";

export default class GeometryLayerDisplay {
    private layer: GeometryLayer;
    private tileSize: number;
    private masterTile = new PIXI.Graphics();
    public container = new PIXI.Container();

    private renderMasterTile() {
        this.masterTile.beginFill(0x27BBE8);
        this.masterTile.drawRect(0, 0, this.tileSize, this.tileSize);
        this.masterTile.endFill();
    }

    constructor(layer: GeometryLayer, tileSize: number) {
        this.layer = layer;
        this.tileSize = tileSize;
        this.renderMasterTile();
        layer.data.items.forEach(item => {
            const tile = this.masterTile.clone();
            tile.x = item.x * tileSize;
            tile.y = item.y * tileSize;
            this.container.addChild(tile);
        });
    }

    public update(layer: GeometryLayer) {
        // remove tiles
        this.layer.data.items.forEach(item => {
            if (!layer.hasItemAt(item.x, item.y)) {
                this.container.children.forEach(child => {
                    if (child.x === item.x * this.tileSize && child.y === item.y * this.tileSize)
                        this.container.removeChild(child);
                });
            }
        });

        // place tiles
        layer.data.items.forEach(item => {
            if (!this.layer.hasItemAt(item.x, item.y)) {
                const tile = this.masterTile.clone();
                tile.x = item.x * this.tileSize;
                tile.y = item.y * this.tileSize;
                this.container.addChild(tile);
            }
        });
    }
}
