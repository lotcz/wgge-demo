import SaveGameRenderer from "wgge/game/save/SaveGameRenderer";
import DOMHelper from "wgge/core/helper/DOMHelper";
import WaterRenderer from "./ocean/WaterRenderer";
import SurfaceRenderer from "./ocean/SurfaceRenderer";
import SubRenderer from "./sub/SubRenderer";
import {SVG} from "@svgdotjs/svg.js";
import Vector2Renderer from "wgge/core/renderer/dom/Vector2Renderer";
import NumberHelper from "wgge/core/helper/NumberHelper";
import DirtyValueRenderer from "wgge/core/renderer/dom/DirtyValueRenderer";
import Matter from "matter-js";

export default class DemoSubmergedRenderer extends SaveGameRenderer {

	/**
	 * @type DemoSubmergedModel
	 */
	model;

	/**
	 * @type {render}
	 */
	physicsRenderer;

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

		const physicsOverlay = DOMHelper.createElement(this.container, 'div', 'physics-overlay');
		
		this.addChild(new WaterRenderer(this.game, this.model.ocean, this.oceanCanvas));

		const svg = DOMHelper.createElement(this.container, 'div', 'svg ocean container');
		this.draw = SVG().addTo(svg);

		this.addChild(new SurfaceRenderer(this.game, this.model.ocean, this.draw));
		this.addChild(new SubRenderer(this.game, this.model.sub, this.draw, this.model.ocean));

		const info = DOMHelper.createElement(this.container, 'div', 'info-float');
		const depth = DOMHelper.createElement(info, 'div');
		this.addChild(new Vector2Renderer(this.game, this.model.coordinates, depth, (c) => `${NumberHelper.round(-c.y / 30, 1)}m`));
		const weight = DOMHelper.createElement(info, 'div');
		this.addChild(new DirtyValueRenderer(this.game, this.model.sub.subWeight, weight, (w) => `${NumberHelper.round(w, 1)}kg`));
		const submerged = DOMHelper.createElement(info, 'div');
		this.addChild(new DirtyValueRenderer(this.game, this.model.sub.submerged, submerged, (s) => `${Math.round(s * 100)}%`));
		const buoyancy = DOMHelper.createElement(info, 'div');
		this.addChild(new DirtyValueRenderer(this.game, this.model.sub.subVolume, buoyancy, (b) => `${NumberHelper.round(b, 1)}kg`));

		if (this.game.isInDebugMode.get()) {
			this.physicsRenderer = Matter.Render.create({
				element: physicsOverlay,
				engine: this.model.physicsEngine,
				options: {
					width: this.game.viewBoxSize.x,
					height: this.game.viewBoxSize.y,
					showVelocity: true,
					wireframeBackground: 'rgba(0, 0, 0 ,0)'
				}
			});
			Matter.Render.run(this.physicsRenderer);
			this.physicsRenderer.canvas.style.position = "absolute";
		}

	}

	deactivateInternal() {
		this.resetChildren();
		if (this.physicsRenderer) {
			Matter.Render.stop(this.physicsRenderer);
			DOMHelper.destroyElement(this.physicsRenderer.canvas);
			this.physicsRenderer = null;
		}
		this.removeElement(this.container);
		this.container = null;
		this.draw = null;
	}

	renderInternal() {
		if (this.physicsRenderer) {
			const corner = this.model.ocean.cornerCoordinates;
			const end = corner.add(this.game.viewBoxSize);

			Matter.Render.lookAt(this.physicsRenderer, {
				min: {x: corner.x, y: corner.y},
				max: {x: end.x, y: end.y}
			});
		}
	}

	resize() {
		this.oceanCanvas.width = this.game.viewBoxSize.x;
		this.oceanCanvas.height = this.game.viewBoxSize.y;

		this.draw.size(this.game.viewBoxSize.x, this.game.viewBoxSize.y);

		if (this.physicsRenderer) {
			this.physicsRenderer.options.width = this.game.viewBoxSize.x;
			this.physicsRenderer.options.height = this.game.viewBoxSize.y;
			this.physicsRenderer.canvas.width = this.game.viewBoxSize.x;
			this.physicsRenderer.canvas.height = this.game.viewBoxSize.y;
		}
	}
}
