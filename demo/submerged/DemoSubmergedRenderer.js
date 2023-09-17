import SaveGameRenderer from "wgge/game/save/SaveGameRenderer";
import DOMHelper from "wgge/core/helper/DOMHelper";
import WaterRenderer from "./ocean/WaterRenderer";
import SurfaceRenderer from "./ocean/SurfaceRenderer";
import SubRenderer from "./sub/SubRenderer";
import {SVG} from "@svgdotjs/svg.js";

export default class DemoSubmergedRenderer extends SaveGameRenderer {

	/**
	 * @type DemoSubmergedModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => this.resize(),
			true
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'scene-container container container-host');

		const ocean = DOMHelper.createElement(this.container, 'div', 'canvas ocean container');
		this.oceanCanvas = DOMHelper.createElement(ocean, 'canvas');

		this.addChild(new WaterRenderer(this.game, this.model.ocean, this.oceanCanvas));

		const svg = DOMHelper.createElement(this.container, 'div', 'svg ocean container');
		this.draw = SVG().addTo(svg);

		this.addChild(new SurfaceRenderer(this.game, this.model.ocean, this.draw));
		this.addChild(new SubRenderer(this.game, this.model.sub, this.draw));
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
		this.container = null;
		this.draw = null;
	}

	resize() {
		this.oceanCanvas.width = this.game.viewBoxSize.x;
		this.oceanCanvas.height = this.game.viewBoxSize.y;

		this.draw.size(this.game.viewBoxSize.x, this.game.viewBoxSize.y);

	}
}
