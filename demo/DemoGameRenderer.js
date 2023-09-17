import GameRenderer from "wgge/game/GameRenderer";
import {DEMO_FACTORY_CONTAINER} from "./DemoFactory";
import NullableNodeRenderer from "wgge/core/renderer/generic/NullableNodeRenderer";

export default class DemoGameRenderer extends GameRenderer {

	/**
	 * @type DemoGameModel
	 */
	model;

	constructor(model, dom) {
		super(model, dom);

		this.model = model;

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.demoModel,
				(m) => new DEMO_FACTORY_CONTAINER[this.model.demoType.get()].Renderer(this.game, m, this.saveGameLayer)
			)
		);

	}

}
