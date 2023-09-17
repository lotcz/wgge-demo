import ControllerBase from "wgge/core/controller/ControllerBase";


export default class DemoCanvasController extends ControllerBase {

	/**
	 * @type DemoCanvasModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

	}

	updateInternal(delta) {
		const circle = Math.PI * 2;
		this.model.phase.increase((delta / 1000) * circle);
		if (this.model.phase.get() > circle) this.model.phase.increase(-circle);
	}
}
