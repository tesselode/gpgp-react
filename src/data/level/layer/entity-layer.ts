import Project from "../../project/project";

export interface EntityLayerItem {
	readonly x: number;
	readonly y: number;
	readonly entityName: string;
}

export interface EntityLayerData {
	readonly name: string;
	readonly visible: boolean;
	readonly items: EntityLayerItem[];
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

	public static Import(data: ExportedEntityLayerData): EntityLayer {
		return new EntityLayer(data);
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
		items.push({x, y, entityName});
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
		return {...this.data, type: 'Entity'};
	}
}
