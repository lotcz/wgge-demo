import ControllerBase from "wgge/core/controller/ControllerBase";

export default class OceanController extends ControllerBase {

	/**
	 * @type OceanModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => this.model.viewBoxSize.set(this.game.viewBoxSize),
			true
		);
	}

	updateInternal(delta) {
		if (!this.model.isSurfaceVisible.get()) return;
		this.model.oceanSurfacePhase.increase(delta / 2500);
		if (this.model.oceanSurfacePhase.get() > 1) this.model.oceanSurfacePhase.set(0);
	}

}
