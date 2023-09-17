import DemoGameModel from "./demo/DemoGameModel";
import DemoGameController from "./demo/DemoGameController";
import DemoGameRenderer from "./demo/DemoGameRenderer";
import Wgge from "wgge";

const DEBUG_ENABLED = true;

const game = new DemoGameModel(DEBUG_ENABLED);

const wgge = new Wgge(
	new DemoGameController(game),
	new DemoGameRenderer(game, window.document.body)
)

wgge.start();

