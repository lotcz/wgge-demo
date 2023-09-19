import SvgRenderer from "wgge/core/renderer/svg/SvgRenderer";
import ProgressVector3 from "wgge/core/animation/3d/ProgressVector3";
import Vector2 from "wgge/core/model/vector/Vector2";

export default class TankRenderer extends SvgRenderer {

	/**
	 * @type TankModel
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

		this.addAutoEvent(
			this.ocean.cornerCoordinates,
			'change',
			() => this.moveTank()
		);
	}

	activateInternal() {
		this.group = this.draw.group();

		this.drawTank();
	}

	deactivateInternal() {
		this.group.remove();
		this.group = null;
	}

	renderInternal() {
		if (this.model.capacity.isDirty) {
			this.updateFill();
		}
		if (this.model.absoluteCoordinates.isDirty) {
			this.moveTank();
		}
	}

	getScreenPosition() {
		return this.model.absoluteCoordinates.sub(this.ocean.cornerCoordinates);
	}

	moveTank() {
		if (!this.ellipse) return;
		const pos = this.getScreenPosition();
		this.ellipse.center(pos.x, pos.y);
		const pe = pos.add(new Vector2(0, this.model.size.y * -0.5));
		this.exhaust.center(pe.x, pe.y);
		this.moveFill();
	}

	getFillPosition() {
		const pos = this.getScreenPosition();
		return pos
			.sub(this.model.size.multiply(0.5))
			.add(new Vector2(0, this.model.size.y * (1 -  this.model.capacity.progress.get())));
	}

	moveFill() {
		if (!this.fill) return;
		const pf = this.getFillPosition();
		this.fill.move(pf.x, pf.y);

		if (!this.clippingEllipse) return;
		const pos = this.getScreenPosition();
		this.clippingEllipse.center(pos.x, pos.y);
	}

	drawTank() {
		if (this.ellipse) this.ellipse.remove();
		if (this.exhaust) this.exhaust.remove();

		let color = this.model.shape.color.asRgbColor();

		this.ellipse = this.drawEllipse(
			this.group,
			new Vector2(),
			this.model.size,
			{width: this.model.shape.strokeWidth.get(), color: this.model.shape.strokeColor.asRgbColor()},
			color
		).click(
			() => this.model.triggerEvent('click')
		);

		this.exhaust = this.drawEllipse(
			this.group,
			new Vector2(0, this.model.size.y * -0.5),
			this.model.size.multiply(0.3),
			{width: this.model.shape.strokeWidth.get(), color: this.model.shape.strokeColor.asRgbColor()},
			this.model.shape.color.asRgbColor()
		).click(
			() => this.model.triggerEvent('exhaust-click')
		);

		this.updateFill();

		this.moveTank();
	}

	updateFill() {
		if (this.fill) this.fill.remove();
		if (this.clip) this.clip.remove();

		if (this.model.content.isLiquid.get() && this.model.capacity.get() > 0) {
			const height = this.model.size.y * this.model.capacity.progress.get();
			this.fill = this.group.rect(this.model.size.x, height);
			this.fill.fill(this.model.content.color.asRgbColor());
			this.fill.click(
				() => this.model.triggerEvent('click')
			);

			this.clippingEllipse = this.drawEllipse(
				this.group,
				new Vector2(),
				this.model.size
			);

			this.clip = this.group.clip().add(this.clippingEllipse);
			this.fill.clipWith(this.clip);

			this.moveFill();
		} else {
			const colorProgress = new ProgressVector3(this.model.shape.color, this.model.content.color);
			const color = colorProgress.get(this.model.capacity.progress.get()).asRgbColor();
			this.ellipse.fill(color);
		}

	}

}
