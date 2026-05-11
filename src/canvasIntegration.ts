import { SystemStore, UIStore, SimulationStore } from './stores';
import { Drawer } from './models/draw';
import { Tracker } from './models/tracker';

export class CanvasIntegration {
  private drawer: Drawer;
  private tracker: Tracker;
  private animationId: number | null = null;

  constructor(
    drawer: Drawer,
    tracker: Tracker,
    private systemStore: SystemStore,
    private uiStore: UIStore,
    private simulationStore: SimulationStore
  ) {
    this.drawer = drawer;
    this.tracker = tracker;
  }

  startRenderLoop() {
    const render = () => {
      if (this.simulationStore.isRunning) {
        this.render();
      }
      this.animationId = requestAnimationFrame(render);
    };
    render();
  }

  stopRenderLoop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private render() {
    const planets = this.systemStore.getPlanets();
    planets.forEach((planet) => {
      this.drawer.drawDot(planet, planet.color);
      this.drawer.drawOrbit(planet, planet.color);
    });
  }

  updatePlanets() {
    const planets = this.systemStore.getPlanets();
    planets.forEach((planet) => {
      planet.move();
      planet.acceleration = planet.computeGravityForcesVector(planets);
      planet.accelerate();
    });
  }
}