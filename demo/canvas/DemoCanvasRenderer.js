import DOMHelper from "wgge/core/helper/DOMHelper";
import CanvasTestRenderer from "./CanvasTestRenderer";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";

export default class DemoCanvasRenderer extends DomRenderer {

	/**
	 * @type DemoCanvasModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => {
				this.canvas.width = this.game.viewBoxSize.x;
				this.canvas.height = this.game.viewBoxSize.y;
			},
			true
		)
	}

	activateInternal() {
		this.canvas = DOMHelper.createElement(this.dom, 'canvas');
		this.addChild(new CanvasTestRenderer(this.game, this.model, this.canvas));
	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.canvas);
		this.canvas = null;
	}

}
