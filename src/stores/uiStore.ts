import { makeAutoObservable } from 'mobx';
import { DotObservable } from '../models/dotObservable';
export class UIStore {
  selectedPlanet: DotObservable | null = null;
  isTracking: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }
  selectPlanet(planet: DotObservable | null) {
    this.selectedPlanet = planet;
  }
  setTracking(isTracking: boolean) {
    this.isTracking = isTracking;
  }
}