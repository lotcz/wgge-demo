import FloatValue from "wgge/core/model/value/FloatValue";
import ObjectModel from "wgge/core/model/ObjectModel";

export default class DemoCanvasModel extends ObjectModel {

	phase;

	constructor() {
		super();

		this.phase = this.addProperty('phase', new FloatValue(0));

	}

}
