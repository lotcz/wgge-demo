import DemoPhysicsModel from "./physics/DemoPhysicsModel";
import DemoPhysicsController from "./physics/DemoPhysicsController";
import DemoPhysicsRenderer from "./physics/DemoPhysicsRenderer";
import DemoCanvasModel from "./canvas/DemoCanvasModel";
import DemoCanvasController from "./canvas/DemoCanvasController";
import DemoCanvasRenderer from "./canvas/DemoCanvasRenderer";
import DemoSubmergedModel from "./submerged/DemoSubmergedModel";
import DemoSubmergedController from "./submerged/DemoSubmergedController";
import DemoSubmergedRenderer from "./submerged/DemoSubmergedRenderer";

export const DEMO_FACTORY_CONTAINER = {
	'canvas': {
		Model: DemoCanvasModel,
		Controller: DemoCanvasController,
		Renderer: DemoCanvasRenderer
	},
	'physics': {
		Model: DemoPhysicsModel,
		Controller: DemoPhysicsController,
		Renderer: DemoPhysicsRenderer
	},
	'submerged': {
		Model: DemoSubmergedModel,
		Controller: DemoSubmergedController,
		Renderer: DemoSubmergedRenderer
	}
}
