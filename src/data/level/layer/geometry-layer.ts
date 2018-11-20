import { Rect } from "../../../util";

export interface GeometryLayerItem {
	readonly x: number;
	readonly y: number;
}

export interface GeometryLayerData {
	readonly name: string;
	readonly visible: boolean;
	readonly items: GeometryLayerItem[];
}

export interface ExportedGeometryLayerData {
	name: string;
	type: 'Geometry';
	visible: boolean;
	items: GeometryLayerItem[];
}

export default class GeometryLayer {
	public readonly data: GeometryLayerData = {
		name: 'New geometry layer',
		visible: true,
		items: [],
	};

	public static New(): GeometryLayer {
		return new GeometryLayer();
	}

	public static Import(data: ExportedGeometryLayerData): GeometryLayer {
		return new GeometryLayer(data);
	}

	private constructor(data?: Partial<GeometryLayerData>) {
		this.data = {...this.data, ...data};
	}

	public setName(name: string): GeometryLayer {
		return new GeometryLayer({...this.data, name});
	}

	public toggleVisibility(): GeometryLayer {
		return new GeometryLayer({...this.data, visible: !this.data.visible});
	}

	public remove(rect: Rect): GeometryLayer {
		return new GeometryLayer({...this.data,
			items: this.data.items.filter(item =>
				item.x < rect.l || item.x > rect.r || item.y < rect.t || item.y > rect.b),
		});
	}

	public place(rect: Rect): GeometryLayer {
		const items = this.data.items.filter(item =>
			item.x < rect.l || item.x > rect.r || item.y < rect.t || item.y > rect.b);
		for (let x = rect.l; x <= rect.r; x++) {
			for (let y = rect.t; y <= rect.b; y++) {
				items.push({x, y});
			}
		}
		return new GeometryLayer({...this.data, items});
	}

	public export(): ExportedGeometryLayerData {
		return {...this.data, type: 'Geometry'};
	}
}
