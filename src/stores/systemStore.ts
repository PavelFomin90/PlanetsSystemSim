import { makeAutoObservable } from 'mobx';
import { DotObservable } from '../models/dotObservable';
export class SystemStore {
  planets: DotObservable[] = [];
  constructor() {
    makeAutoObservable(this);
  }
  addPlanet(planet: DotObservable) {
    this.planets.push(planet);
  }
  getPlanets() {
    return [...this.planets];
  }
}