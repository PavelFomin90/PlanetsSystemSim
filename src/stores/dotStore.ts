import { makeAutoObservable } from 'mobx';
import { IDot, IDotStartProps } from '../models/dot';
export class DotStore {
  dot: IDot | null = null;
  constructor() {
    makeAutoObservable(this);
  }
  setDot(dot: IDot) {
    this.dot = dot;
  }
  updateCoords(coords: { x: number; y: number }) {
    if (this.dot) {
      this.dot.coords = coords;
    }
  }
}