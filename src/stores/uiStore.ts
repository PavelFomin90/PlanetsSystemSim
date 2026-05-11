import { makeAutoObservable } from 'mobx';
import { IDot } from '../models/dot';
export class UIStore {
  selectedPlanet: IDot | null = null;
  isTracking: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }
  selectPlanet(planet: IDot | null) {
    this.selectedPlanet = planet;
  }
  setTracking(isTracking: boolean) {
    this.isTracking = isTracking;
  }
}