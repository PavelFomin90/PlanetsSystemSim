import { IDot } from "./dot";

interface ISystem {
  planets: IDot[];
  addPlanet: (planet: IDot) => void;
}

/**
 * Класс, представляющий систему тел (планет, спутников и звёзд).
 * 
 * Управляет коллекцией объектов `Dot`, обеспечивая их хранение и добавление.
 * Используется как контейнер для физическо�� симуляции.
 * 
 * @class System
 * @implements {ISystem}
 */
class System implements ISystem {
  planets: IDot[];

  constructor() {
    this.planets = [];
  }

  /**
   * Добавляет тело в систему.
   * 
   * @param {IDot} planet - Тело (планета, спутник и т.д.), которое нужно добавить.
   */
  addPlanet(planet: IDot) {
    this.planets.push(planet);
  }
}

export { System };
