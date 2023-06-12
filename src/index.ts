import { TranslateController } from "./controller/translateController";
import { planets } from "./initData";
import { ICoords, IDot } from "./models/dot";
import { System } from "./models/system";
import { Tracker } from "./models/tracker";
import { drawDot, drawOrbit } from "./utils/canvas/draw";
import { getCanvasClickCoors } from "./utils/canvas/handlers";

const system = new System();

planets.forEach((planet) => {
  system.addPlanet(planet);
});

const canvas: HTMLCanvasElement | null = document.querySelector("#canvas");

if (canvas) {
  canvas.width = window.innerWidth - 4;
  canvas.height = window.innerHeight - 4;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth - 4;
    canvas.height = window.innerHeight - 4;
  });

  const ctx = canvas.getContext("2d");

  canvas.addEventListener("click", (e) => {
    getCanvasClickCoors(e);
  });

  const translateInstance = new TranslateController({
    context: ctx,
    initialScale: 0.2,
    initialTranslate: { x: 0, y: 0 },
  });

  const trackerInstance = new Tracker();

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
      } else {
        if (trackerInstance.trackObject === planet) {
          trackerInstance.resetTracker();
        }
      }
    });
  });

  const draw = () => {
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      translateInstance.makeTrasform();

      system.planets.forEach((planet) => {
        drawDot(ctx, planet, planet.color);
        drawOrbit(ctx, planet, planet.color);
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
