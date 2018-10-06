export default abstract class Layer {
	name: string = 'New layer';
	tiles: Array<object> = [];
	abstract place(x: number, y: number, tiles?: object): void;
	abstract remove(x: number, y: number): void;
}
