import { SystemStore } from '../../src/stores/systemStore';
import { DotObservable } from '../../src/models/dotObservable';

describe('SystemStore', () => {
  let systemStore: SystemStore;
  let planet: DotObservable;

  beforeEach(() => {
    systemStore = new SystemStore();
    planet = new DotObservable({
      name: 'earth',
      coords: { x: 100, y: 200 },
      mass: 100
    });
  });

  test('should add planet', () => {
    systemStore.addPlanet(planet);
    expect(systemStore.planets).toHaveLength(1);
    expect(systemStore.planets[0]).toBe(planet);
  });

  test('should get planets copy', () => {
    systemStore.addPlanet(planet);
    const planets = systemStore.getPlanets();
    expect(planets).toHaveLength(1);
    expect(planets).not.toBe(systemStore.planets);
  });
});