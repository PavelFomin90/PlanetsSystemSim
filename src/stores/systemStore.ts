import { makeAutoObservable } from 'mobx';
import { IDot } from '../models/dot';
export class SystemStore {
  planets: IDot[] = [];
  constructor() {
    makeAutoObservable(this);
  }
  addPlanet(planet: IDot) {
    this.planets.push(planet);
  }
  getPlanets() {
    return [...this.planets];
  }
}