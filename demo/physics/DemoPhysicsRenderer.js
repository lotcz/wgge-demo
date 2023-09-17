import RendererBase from "wgge/core/renderer/RendererBase";

export default class DemoPhysicsRenderer extends RendererBase {

	/**
	 * @type DemoPhysicsModel
	 */
	model;

	constructor(model, dom) {
		super(model, dom);

		this.model = model;

	}

}
