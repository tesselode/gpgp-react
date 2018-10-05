export default abstract class Layer {
	name: string = 'New layer';
	data: Array<object> = [];
	abstract place(x: number, y: number, data?: object);
	abstract remove(x: number, y: number);
}
