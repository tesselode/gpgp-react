import ParameterType from "./parameter-type";

/** The data used by the BooleanParameter class. */
export interface BooleanParameterData {
	/** The name of the parameter. */
	name: string;
	/** The type of the parameter. */
	type: ParameterType.Boolean;
	/** Whether the parameter is set to true by default. */
	default?: boolean;
}

/** The data used to define boolean parameters in a project file. */
export interface ExportedBooleanParameterData {
	/** The name of the parameter. */
	name: string;
	/** The type of the parameter. */
	type: ParameterType.Boolean;
	/** Whether the parameter is set to true by default. */
	default?: boolean;
}

/** The settings for a boolean entity parameter. */
export default class BooleanParameter {
	public readonly data: BooleanParameterData = {
		name: 'New boolean parameter',
		type: ParameterType.Boolean,
	};

	public static New(): BooleanParameter {
		return new BooleanParameter();
	}

	public static Import(data: ExportedBooleanParameterData): BooleanParameter {
		return new BooleanParameter({
			name: data.name,
			default: data.default,
		});
	}

	private constructor(data?: Partial<BooleanParameterData>) {
		this.data = {...this.data, ...data};
	}

	public setName(name: string): BooleanParameter {
		return new BooleanParameter({...this.data, name});
	}

	public toggleDefault(): BooleanParameter {
		return new BooleanParameter({
			...this.data,
			default: !this.data.default,
		});
	}

	public export(): ExportedBooleanParameterData {
		return {...this.data, type: ParameterType.Boolean};
	}
}
