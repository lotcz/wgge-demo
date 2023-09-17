import CanvasRenderer from "wgge/core/renderer/canvas/CanvasRenderer";
import Vector2 from "wgge/core/model/vector/Vector2";

export default class CanvasTestRenderer extends CanvasRenderer {

	/**
	 * @type DemoCanvasModel
	 */
	model;

	constructor(game, model, canvas) {
		super(game, model, canvas);

		this.model = model;

	}

	renderInternal() {
		this.drawRect(
			new Vector2(),
			this.game.viewBoxSize,
			'black'
		);
		const center = this.game.viewBoxSize.multiply(0.5);
		const radius = center.y / 2;

		const x = Math.sin(this.model.phase.get());
		const y = Math.cos(this.model.phase.get());

		this.drawCircle(
			new Vector2(x, y).multiply(radius).add(center),
			10,
			'white',
			null
		);
	}

}
