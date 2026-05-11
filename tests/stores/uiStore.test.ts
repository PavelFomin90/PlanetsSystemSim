import { UIStore } from '../../src/stores/uiStore';
import { DotObservable } from '../../src/models/dotObservable';

describe('UIStore', () => {
  let uiStore: UIStore;
  let planet: DotObservable;

  beforeEach(() => {
    uiStore = new UIStore();
    planet = new DotObservable({
      name: 'test',
      coords: { x: 10, y: 20 },
      mass: 100
    });
  });

  test('should select planet', () => {
    uiStore.selectPlanet(planet);
    expect(uiStore.selectedPlanet).toBe(planet);
  });

  test('should set tracking', () => {
    uiStore.setTracking(true);
    expect(uiStore.isTracking).toBe(true);
  });
});