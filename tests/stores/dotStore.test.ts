import { DotStore } from '../../src/stores/dotStore';
import { DotObservable } from '../../src/models/dotObservable';

describe('DotStore', () => {
  let dotStore: DotStore;
  let dot: DotObservable;

  beforeEach(() => {
    dotStore = new DotStore();
    dot = new DotObservable({
      name: 'test',
      coords: { x: 10, y: 20 },
      mass: 100
    });
    dotStore.setDot(dot);
  });

  test('should set dot', () => {
    expect(dotStore.dot).toBe(dot);
  });

  test('should update coords', () => {
    dotStore.updateCoords({ x: 30, y: 40 });
    expect(dotStore.dot?.coords).toEqual({ x: 30, y: 40 });
  });
});