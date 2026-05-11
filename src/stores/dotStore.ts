import { makeAutoObservable } from 'mobx';
import { DotObservable } from '../models/dotObservable';

export class DotStore {
  dot: DotObservable | null = null;
  constructor() {
    makeAutoObservable(this);
  }
  setDot(dot: DotObservable) {
    this.dot = dot;
  }
  updateCoords(coords: { x: number; y: number }) {
    if (this.dot) {
      this.dot.setCoords(coords);
    }
  }
}
