import ObjectModel from "wgge/core/model/ObjectModel";
import Vector3 from "wgge/core/model/vector/Vector3";
import StringValue from "wgge/core/model/value/StringValue";
import BoolValue from "wgge/core/model/value/BoolValue";
import FloatValue from "wgge/core/model/value/FloatValue";

export default class FluidModel extends ObjectModel {

	/**
	 * @type StringValue
	 */
	name;

	/**
	 * @type BoolValue
	 */
	isLiquid;

	/**
	 * @type Vector3
	 */
	color;

	/**
	 * @type FloatValue
	 */
	weight;

	constructor(
		name = 'H2O',
		liquid = true,
		color = new Vector3(10, 10, 100),
		weight = 1
	) {
		super();

		this.name = this.addProperty('name', new StringValue(name));
		this.isLiquid = this.addProperty('isLiquid', new BoolValue(liquid));
		this.color = this.addProperty('color', color);
		this.weight = this.addProperty('weight', new FloatValue(weight));
	}

}

export const FLUID_WATER = new FluidModel(
	'H2O',
	true,
	new Vector3(100, 150, 255),
	1
);

export const FLUID_OXYGEN = new FluidModel(
	'O2',
	false,
	new Vector3(255, 255, 255),
	0.032
);
