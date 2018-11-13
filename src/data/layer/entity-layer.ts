/* import Project, { getProjectEntity } from "../project";
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

export function getItemAt(project: Project, layer: EntityLayer, x: number, y: number): number {
	return layer.items.findIndex(item => {
		const entity = getProjectEntity(project, item.entityName);
		if (!entity) return false;
		const l = item.x;
		const t = item.y;
		const r = l + entity.width - 1;
		const b = t + entity.height - 1;
		return x >= l && x <= r && y >= t && y <= b;
	});
}
*/
