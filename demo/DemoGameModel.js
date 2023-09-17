import GameModel from "wgge/game/GameModel";
import StringValue from "wgge/core/model/value/StringValue";
import NullableNode from "wgge/core/model/value/NullableNode";

export default class DemoGameModel extends GameModel {

	/**
	 * @type StringValue
	 */
	demoType;

	/**
	 * @type NullableNode
	 */
	demoModel;

	constructor(debugModeEnabled = true) {
		super(debugModeEnabled);

		this.demoType = this.addProperty('demoType', new StringValue());
		this.demoModel = this.addProperty('demoModel', new NullableNode());

	}

}
