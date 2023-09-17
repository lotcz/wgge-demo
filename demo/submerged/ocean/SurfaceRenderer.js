import SvgRenderer from "wgge/core/renderer/svg/SvgRenderer";
import Vector2 from "wgge/core/model/vector/Vector2";

export default class SurfaceRenderer extends SvgRenderer {

	/**
	 * @type OceanModel
	 */
	model;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.model = model;

	}

	activateInternal() {
		this.group = this.draw.group();
		this.group.addClass('surface-group');
	}

	deactivateInternal() {
		this.group.remove();
		this.group = null;
		this.line = null;
	}

	drawSurface() {
		if (this.line) this.line.remove();

		if (!this.model.isSurfaceVisible.get()) return;

		const WAVE_LENGTH = 50;
		const WAVE_HEIGHT = 10;
		const start = this.model.surfaceStart;
		const phase = Math.sin(this.model.oceanSurfacePhase.get() * 2 * Math.PI);
		const wave = new Vector2(WAVE_LENGTH / 4, WAVE_HEIGHT * phase);

		const pathStart = `M${start.x},${start.y} Q${start.x + wave.x},${start.y + wave.y} ${start.x + (wave.x * 2)},${start.y} `;

		let pathTail = '';
		for (let x = start.x + WAVE_LENGTH, max = this.game.viewBoxSize.x + wave.x; x < max; x += wave.x * 2) {
			pathTail += `T${x},${start.y} `;
		}

		this.line = this.group
			.path(pathStart + pathTail)
			.stroke({width: 1, color: 'rgb(220, 220, 255)'})
			.fill('rgb(100, 150, 255)');
	}

	renderInternal() {
		this.drawSurface();
	}
}
