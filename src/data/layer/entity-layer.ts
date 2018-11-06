import Layer, { LayerType } from "./layer";

export interface EntityLayerItem {
	entityName: string;
	x: number;
	y: number;
	parameters: {};
}

export default interface EntityLayer extends Layer {
	items: EntityLayerItem[];
}

export function newEntityLayer(): EntityLayer {
	return {
		name: 'New entity layer',
		type: LayerType.Entity,
		visible: true,
		items: [],
	};
}

export function isEntityLayer(layer: Layer): layer is EntityLayer {
	return layer.type === LayerType.Entity;
}

export function placeEntity(layer: EntityLayer, entityName: string, x: number, y: number) {
	layer.items.push({entityName, x, y, parameters: {}});
}

export function removeEntity(layer: EntityLayer, entity: EntityLayerItem) {
	const entityIndex = layer.items.findIndex(e => e === entity);
	if (entityIndex !== -1)
		layer.items.splice(entityIndex, 1);
}
