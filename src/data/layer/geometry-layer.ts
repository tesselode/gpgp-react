import Rect from "../rect";

interface GeometryLayerItem {
	x: number;
	y: number;
}

interface GeometryLayerData {
	name: string;
	items: GeometryLayerItem[];
}

export default class GeometryLayer {
	public readonly data: GeometryLayerData;

	public static New() {
		return new GeometryLayer({
			name: 'New geometry layer',
			items: [],
		});
	}

	private constructor(data: GeometryLayerData) {
		this.data = data;
	}

	public setName(name: string) {
		return new GeometryLayer({...this.data, name});
	}

	public place(rect: Rect) {
		let items = this.data.items.slice(0, this.data.items.length);
		items = items.filter(item => !rect.containsPoint(item.x, item.y));
		for (let x = rect.left; x <= rect.right; x++) {
			for (let y = rect.top; y <= rect.bottom; y++) {
				items.push({x, y});
			}
		}
		return new GeometryLayer({...this.data, items});
	}

	public remove(rect: Rect) {
		let items = this.data.items.slice(0, this.data.items.length);
		items = items.filter(item => !rect.containsPoint(item.x, item.y));
		return new GeometryLayer({...this.data, items});
	}
}
