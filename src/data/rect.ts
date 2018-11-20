export default class Rect {
	public readonly l: number;
	public readonly t: number;
	public readonly r: number;
	public readonly b: number;

	constructor(l: number, t: number, r?: number, b?: number) {
		this.l = l;
		this.t = t;
		this.r = r || l;
		this.b = b || t;
	}

	/** Creates a normalized rectangle from this rectangle in which the top-left corner is
	 * actually above and to the left of the bottom-right corner.
	 */
	public normalized(): Rect {
		return new Rect(
			Math.min(this.l, this.r),
			Math.min(this.t, this.b),
			Math.max(this.l, this.r),
			Math.max(this.t, this.b),
		);
	}
}
