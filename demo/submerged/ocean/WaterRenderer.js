import CanvasRenderer from "wgge/core/renderer/canvas/CanvasRenderer";
import Vector3 from "wgge/core/model/vector/Vector3";
import ProgressVector3 from "wgge/core/animation/3d/ProgressVector3";
import Vector2 from "wgge/core/model/vector/Vector2";

export default class WaterRenderer extends CanvasRenderer {

	/**
	 * @type OceanModel
	 */
	model;

	constructor(game, model, canvas) {
		super(game, model, canvas);

		this.model = model;

		const skyStartColor = new Vector3(20, 20, 85);
		const skyEndColor = new Vector3(200, 200, 255);
		this.skyColorProgress = new ProgressVector3(skyStartColor, skyEndColor);

		const oceanStartColor = new Vector3(100, 150, 255);
		const oceanEndColor = new Vector3(0, 0, 30);
		this.oceanColorProgress = new ProgressVector3(oceanStartColor, oceanEndColor);
	}

	drawWater() {
		if (this.model.isSkyVisible.get()) {
			const skySize = new Vector2(this.model.viewBoxSize.x, this.model.isOceanVisible.get() ? this.model.surfaceStart.y : this.model.viewBoxSize.y);

			const skyProgressTop = 1 - (-this.model.cornerCoordinates.y / this.model.oceanSize.y);
			const skyProgressBottom = 1 - (-(this.model.cornerCoordinates.y + skySize.y) / this.model.oceanSize.y);
			const skyGradientColorStart = this.skyColorProgress.get(skyProgressTop).asRgbColor();
			const skyGradientColorEnd = this.skyColorProgress.get(skyProgressBottom).asRgbColor();

			this.drawGradient(
				new Vector2(),
				skySize,
				new Vector2(),
				new Vector2(0, skySize.y),
				[
					[0, skyGradientColorStart],
					[1, skyGradientColorEnd]
				]
			);
		}

		if (this.model.isOceanVisible.get()) {
			const oceanStart = new Vector2(0, this.model.isSurfaceVisible.get() ? this.model.surfaceStart.y : 0);
			const oceanSize = new Vector2(this.model.viewBoxSize.x, this.model.isBottomVisible.get() ? this.model.bottomStart.y : this.model.viewBoxSize.y);

			const oceanProgressTop = (this.model.cornerCoordinates.y + oceanStart.y) / this.model.oceanSize.y;
			const oceanProgressBottom = (this.model.cornerCoordinates.y + oceanSize.y) / this.model.oceanSize.y;
			const gradientColorStart = this.oceanColorProgress.get(oceanProgressTop).asRgbColor();
			const gradientColorEnd = this.oceanColorProgress.get(oceanProgressBottom).asRgbColor();

			this.drawGradient(
				oceanStart,
				oceanSize,
				oceanStart,
				new Vector2(0, oceanSize.y),
				[
					[0, gradientColorStart],
					[1, gradientColorEnd]
				]
			);
		}

		if (this.model.isBottomVisible.get()) {
			const bottomColor = new Vector3(50, 50, 50);

			this.drawRect(
				this.model.bottomStart,
				this.model.viewBoxSize.sub(new Vector2(0, this.model.bottomStart.y)),
				bottomColor.asRgbColor()
			);
		}
	}

	renderInternal() {
		this.drawWater();
	}
}
