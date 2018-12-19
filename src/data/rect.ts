export default class Rect {
	public left: number;
	public top: number;
	public right: number;
	public bottom: number;

	constructor(left: number, top: number, right: number, bottom: number) {
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	}

	public containsPoint(x: number, y: number) {
		return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
	}
}
