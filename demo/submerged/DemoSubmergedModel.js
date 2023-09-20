import ObjectModel from "wgge/core/model/ObjectModel";
import FloatValue from "wgge/core/model/value/FloatValue";
import OceanModel from "./ocean/OceanModel";
import SubModel from "./sub/SubModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import Matter from "matter-js";

export default class DemoSubmergedModel extends ObjectModel {

	/**
	 * @type engine
	 */
	physicsEngine;

	/**
	 * @type SubModel
	 */
	sub;

	/**
	 * @type OceanModel
	 */
	ocean;

	/**
	 * @type Vector2
	 */
	coordinates;

	/**
	 * @type FloatValue
	 */
	zoom;

	constructor() {
		super();

		this.physicsEngine = Matter.Engine.create({
			enableSleeping: false,
			gravity: {x: 0, y: 0.2}
		});

		this.sub = this.addProperty('sub', new SubModel());
		this.ocean = this.addProperty('ocean', new OceanModel());

		this.coordinates = this.addProperty('coordinates', new Vector2(0, -100));
		this.zoom = this.addProperty('zoom', new FloatValue(1));
	}

}
