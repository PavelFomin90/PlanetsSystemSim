import { IDot } from "./dot";

interface ISystem {
  planets: IDot[];
  addPlanet: (planet: IDot) => void;
}

class System implements ISystem {
  planets: IDot[];

  constructor() {
    this.planets = [];
  }

  addPlanet(planet: IDot) {
    this.planets.push(planet);
  }
}

export { System };
