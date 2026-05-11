import { SystemStore, UIStore, SimulationStore } from './stores';
import { Drawer } from './models/draw';

export class CanvasIntegration {
  private drawer: Drawer;
  private animationId: number | null = null;

  constructor(
    drawer: Drawer,
    _tracker: unknown,
    private systemStore: SystemStore,
    _uiStore: UIStore,
    private simulationStore: SimulationStore
  ) {
    this.drawer = drawer;
    void _tracker;
    void _uiStore;
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
      this.drawer.drawDot(planet as never, planet.color);
      this.drawer.drawOrbit(planet as never, planet.color);
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