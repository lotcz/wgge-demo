import ObjectModel from "wgge/core/model/ObjectModel";
import FloatValue from "wgge/core/model/value/FloatValue";
import OceanModel from "./ocean/OceanModel";
import SubModel from "./sub/SubModel";
import Vector2 from "wgge/core/model/vector/Vector2";

export default class DemoSubmergedModel extends ObjectModel {

	/**
	 * @type Vector2
	 */
	coordinates;

	/**
	 * @type FloatValue
	 */
	zoom;

	/**
	 * @type OceanModel
	 */
	ocean;


	/**
	 * @type SubModel
	 */
	sub;

	constructor() {
		super();

		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.zoom = this.addProperty('zoom', new FloatValue(1));

		this.ocean = this.addProperty('ocean', new OceanModel());
		this.sub = this.addProperty('sub', new SubModel());

	}

}
