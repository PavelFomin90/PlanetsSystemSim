import { TranslateController } from "./controller/translateController";
import { planets } from "./initData";
import { ICoords, IDot } from "./models/dot";
import { System } from "./models/system";
import { Tracker } from "./models/tracker";
import { Drawer } from "./models/draw";
import { getCanvasClickCoors } from "./utils/canvas/handlers";
import { InfoPanel } from "./ui/components/InfoPanel/";
import { PlanetsListPanel } from "./ui/components/PlanetsListPanel/";

const system = new System();
const drawer = new Drawer(null); // Создаем экземпляр Drawer с контекстом холста, который будет установлен позже

planets.forEach((planet) => {
  system.addPlanet(planet);
});

const canvas: HTMLCanvasElement | null = document.querySelector("#canvas");

if (canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get the 2D context from the canvas.");

  drawer.setContext(ctx);

  canvas.width = window.innerWidth - 4;
  canvas.height = window.innerHeight - 4;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth - 4;
    canvas.height = window.innerHeight - 4;
  });

  canvas.addEventListener("click", (e) => {
    getCanvasClickCoors(e);
  });

  const translateInstance = new TranslateController({
    context: ctx,
    initialScale: 0.2,
    initialTranslate: { x: 0, y: 0 },
  });

  const trackerInstance = new Tracker();
  const infoPanel = new InfoPanel();
  infoPanel.render(document.body);

  // Создание панели списка планет
  const planetsListPanel = new PlanetsListPanel(system);
  planetsListPanel.render(document.body);

  const checkPlanetClick = (planet: IDot, clickCoords: ICoords) => {
    const planetCoord = planet.coords;
    const planetRadius = planet.radius;

    if (
      clickCoords.x <= planetCoord.x + planetRadius &&
      clickCoords.x >= planetCoord.x - planetRadius &&
      clickCoords.y <= planetCoord.y + planetRadius &&
      clickCoords.y >= planetCoord.y - planetRadius
    ) {
      return true;
    }

    return false;
  };

  canvas.addEventListener("mousedown", (e: MouseEvent) => {
    const coords = getCanvasClickCoors(e);
    if (!coords) return;

    system.planets.forEach((planet) => {
      if (checkPlanetClick(planet, coords)) {
        trackerInstance.track(planet);
        infoPanel.update(planet);
      } else {
        if (trackerInstance.trackObject === planet) {
          trackerInstance.resetTracker();
          infoPanel.update(null);
        }
      }
    });
  });

  const draw = () => {
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawer.drawBackground();
      translateInstance.makeTrasform();

      system.planets.forEach((planet) => {
        drawer.drawDot(planet, planet.color);
        drawer.drawOrbit(planet, planet.color);
      });
    }

    requestAnimationFrame(draw);
  };

  // let step = 0;
  setInterval(() => {
    system.planets.forEach((planet) => {
      planet.move();
      planet.acceleration = planet.computeGravityForcesVector(system.planets);
      planet.accelerate();
    });
  }, 30);

  requestAnimationFrame(draw);
} else {
  const app = document.querySelector("#app");
  if (app) {
    app.innerHTML = "Canvas was not found";
  }
}