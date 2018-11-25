import BooleanParameter from "../../project/entity/parameter/boolean-parameter";
import Project from "../../project/project";

export interface EntityLayerItem {
	readonly x: number;
	readonly y: number;
	readonly entityName: string;
	readonly parameters: object;
}

export interface EntityLayerData {
	readonly name: string;
	readonly visible: boolean;
	readonly items: EntityLayerItem[];
	readonly warnings?: string[];
}

export interface ExportedEntityLayerData {
	readonly name: string;
	type: 'Entity';
	readonly visible: boolean;
	readonly items: EntityLayerItem[];
}

export default class EntityLayer {
	public readonly data: EntityLayerData = {
		name: 'New entity layer',
		visible: true,
		items: [],
	};

	public static New(): EntityLayer {
		return new EntityLayer();
	}

	public static Import(data: ExportedEntityLayerData, project: Project): EntityLayer {
		const warnings = [];
		const items = [];
		for (const item of data.items) {
			const entity = project.getEntity(item.entityName);
			if (!entity) {
				warnings.push('Entity type "' + item.entityName + '" does not exist in the project file. Entities of this type in the level will be discarded.');
				continue;
			}
			const parameters = {};
			for (const parameter of entity.data.parameters) {
				if (parameter instanceof BooleanParameter) {
					if (typeof(item.parameters[parameter.data.name]) === 'boolean')
						parameters[parameter.data.name] = item.parameters[parameter.data.name];
					else
						parameters[parameter.data.name] = parameter.data.default;
				}
			}
			for (const parameterName in item.parameters) {
				if (entity.data.parameters.findIndex(parameter => parameter.data.name === parameterName) === -1)
					warnings.push('Parameter "' + parameterName + '" of entity "' + entity.data.name + '" does not exist in the project file and will be discarded.');
			}
			items.push({
				x: item.x,
				y: item.y,
				entityName: item.entityName,
				parameters,
			});
		}
		return new EntityLayer({
			name: data.name,
			visible: data.visible,
			items,
			warnings,
		});
	}

	private constructor(data?: Partial<EntityLayerData>) {
		this.data = {...this.data, ...data};
	}

	public setName(name: string): EntityLayer {
		return new EntityLayer({...this.data, name});
	}

	public toggleVisibility(): EntityLayer {
		return new EntityLayer({...this.data, visible: !this.data.visible});
	}

	public getItemAt(project: Project, x: number, y: number): number {
		return this.data.items.findIndex(item => {
			const entity = project.getEntity(item.entityName);
			if (!entity) return false;
			const l = item.x;
			const t = item.y;
			const r = l + entity.data.width - 1;
			const b = t + entity.data.height - 1;
			return x >= l && x <= r && y >= t && y <= b;
		});
	}

	public place(x: number, y: number, entityName: string): EntityLayer {
		const items = this.data.items.slice(0, this.data.items.length);
		items.push({x, y, entityName, parameters: {}});
		return new EntityLayer({...this.data, items});
	}

	public remove(itemIndex: number): EntityLayer {
		const items = this.data.items.slice(0, this.data.items.length);
		items.splice(itemIndex, 1);
		return new EntityLayer({...this.data, items});
	}

	public move(itemIndex: number, deltaX: number, deltaY: number): EntityLayer {
		const items = this.data.items.slice(0, this.data.items.length);
		const item = {...items[itemIndex]};
		item.x += deltaX;
		item.y += deltaY;
		items[itemIndex] = item;
		return new EntityLayer({...this.data, items});
	}

	public export(): ExportedEntityLayerData {
		return {
			name: this.data.name,
			type: 'Entity',
			visible: this.data.visible,
			items: this.data.items,
		};
	}
}
