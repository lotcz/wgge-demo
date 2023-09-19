import TankRenderer from "./tank/TankRenderer";
import SvgRenderer from "wgge/core/renderer/svg/SvgRenderer";
import CollectionRenderer from "wgge/core/renderer/generic/CollectionRenderer";

export default class SubRenderer extends SvgRenderer {

	/**
	 * @type SubModel
	 */
	model;

	/**
	 * @type OceanModel
	 */
	ocean;

	constructor(game, model, draw, ocean) {
		super(game, model, draw);

		this.model = model;
		this.ocean = ocean;

	}

	activateInternal() {
		super.activateInternal();
		this.group = this.draw.group();
		this.group.addClass('sub-group');
		this.hull = this.group.group();
		this.tanks = this.group.group();

		this.addChild(new TankRenderer(this.game, this.model, this.hull, this.ocean));

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.oxygenTanks,
				(m) => new TankRenderer(this.game, m, this.tanks, this.ocean)
			)
		);

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.waterTanks,
				(m) => new TankRenderer(this.game, m, this.tanks, this.ocean)
			)
		);

	}

	deactivateInternal() {
		this.resetChildren();
		this.group.remove();
		this.hull = null;
		this.tanks = null;
		this.group = null;
		super.deactivateInternal();
	}

}
