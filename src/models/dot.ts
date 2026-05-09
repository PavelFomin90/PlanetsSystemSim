import { toDegrees, toRadians } from "../utils/math";

import { IVector, Vector } from "./vector";

/**
 * Интерфейс для координат на плоскости.
 * 
 * @interface ICoords
 * @property {number} x - Координата по горизонтали.
 * @property {number} y - Координата по вертикали.
 */
export interface ICoords {
  x: number;
  y: number;
}

interface IDot {
  velocity: IVector;
  acceleration: IVector;
  coords: ICoords;
  mass: number;
  color: string;
  radius: number;
  move: () => void;
  accelerate: () => void;
  name: string;
  prevCoords: ICoords[];
  parent: IDot | null;
  addPrevCoord: (value: ICoords) => void;
  setPrevCoords: (value: ICoords[]) => void;
  setParent: (parent: IDot) => void;
  computeGravityForce: (planet: IDot) => Vector;
  computeGravityForcesVector: (planets: IDot[]) => Vector;
}

/**
 * Интерфейс для начальных параметров создания тела.
 * 
 * @interface IDotStartProps
 * @property {IVector} [velocity] - Начальная скорость.
 * @property {IVector} [acceleration] - Начальное ускорение.
 * @property {ICoords} [coords] - Начальные координаты.
 * @property {number} [mass] - Масса тела.
 * @property {string} [color] - Цвет отрисовки.
 * @property {number} [radius] - Радиус отрисовки.
 * @property {string} name - Имя тела (обязательно).
 */
interface IDotStartProps {
  velocity?: IVector;
  acceleration?: IVector;
  coords?: ICoords;
  mass?: number;
  color?: string;
  radius?: number;
  name: string;
}

/**
 * Класс, представляющий физическое тело в симуляции (планету, спутник и т.д.).
 * 
 * Реализует модель движения под действием гравитационных сил.
 * Поддерживает отслеживание траектории и определение "родительского" тела (например, спутник привязывается к планете).
 * 
 * @class Dot
 * @implements {IDot}
 */
class Dot implements IDot {
  coords: ICoords;
  velocity: IVector;
  acceleration: IVector;
  mass: number;
  color: string;
  radius: number;
  prevCoords: ICoords[];
  parent: IDot | null;
  name: string;

  /**
   * Создаёт экземпляр тела с заданными параметрами.
   * 
   * @param {IDotStartProps} props - Начальные параметры тела.
   * @param {ICoords} [props.coords={x:0,y:0}] - Начальные координаты.
   * @param {IVector} [props.velocity=new Vector(0,0)] - Начальная скорость.
   * @param {IVector} [props.acceleration=new Vector(0,0)] - Начальное ускорение.
   * @param {number} [props.mass=0] - Масса тела.
   * @param {string} [props.color="green"] - Цвет отрисовки.
   * @param {number} [props.radius=15] - Радиус отрисовки.
   * @param {string} props.name - Имя тела (обязательно).
   */
  constructor(props: IDotStartProps) {
    const { coords, velocity, acceleration, mass, color, radius, name } = props;

    this.coords = coords || { x: 0, y: 0 };
    this.velocity = velocity || new Vector(0, 0);
    this.acceleration = acceleration || new Vector(0, 0);
    this.mass = mass || 0;
    this.color = color || "green";
    this.radius = radius || 15;
    this.prevCoords = [];
    this.parent = null;
    this.name = name;
  }

  get x() {
    return this.coords.x;
  }

  get y() {
    return this.coords.y;
  }

  addPrevCoord(value: ICoords) {
    this.prevCoords.push(value);
  }

  setPrevCoords(value: ICoords[]) {
    this.prevCoords = value;
  }

  setParent(parent: IDot) {
    this.parent = parent;
  }

  /**
   * Перемещает тело на один шаг по текущей скорости.
   * 
   * Использует полярные координаты скорости (длина и угол) для вычисления нового положения.
   * Модифицирует свойство `coords`.
   */
  move() {
    const velocity = this.velocity;
    const coords = this.coords;
    this.coords.x =
      coords.x + velocity.length * Math.cos(toRadians(velocity.angle));
    this.coords.y =
      coords.y + velocity.length * Math.sin(toRadians(velocity.angle));
  }

  /**
   * Применяет текущее ускорение к скорости тела.
   * 
   * Модифицирует вектор `velocity`, добавляя к нему вектор `acceleration`.
   * Вызывается каждый шаг симуляции.
   */
  accelerate() {
    this.velocity.addVector(this.acceleration);
  }

  /**
   * Вычисляет вектор гравитационной силы, действующей на это тело со стороны другого.
   * 
   * Использует закон всемирного тяготения: F = G * (m1 * m2) / r².
   * В данном случае `GRAVCONST = 1`, масса текущего тела не учитывается (упрощённая модель).
   * 
   * @param {IDot} planet - Другое тело, создающее гравитационное поле.
   * @returns {Vector} Вектор силы притяжения (по модулю и направлению).
   */
  computeGravityForce(planet: IDot) {
    const GRAVCONST = 1;
    const { x, y } = this.coords;

    const distance = Math.sqrt(
      Math.pow(x - planet.coords.x, 2) + Math.pow(y - planet.coords.y, 2)
    );
    const length = (GRAVCONST * planet.mass) / Math.pow(distance, 2);
    const angle = toDegrees(
      Math.atan2(planet.coords.y - y, planet.coords.x - x)
    );

    return new Vector(length, angle);
  }

  /**
   * Вычисляет суммарный вектор гравитационных сил от всех других тел.
   * 
   * Также определяет, какое тело оказывает наибольшее влияние (максимальная сила),
   * и устанавливает его как `parent` через `setParent()`, что используется для отслеживания орбит.
   * 
   * @param {IDot[]} planets - Массив всех тел в системе (включая текущее).
   * @returns {Vector} Суммарный вектор всех гравитационных сил, действующих на тело.
   */
  computeGravityForcesVector(planets: IDot[]) {
    const gravityForcesSumVector = new Vector();
    let maxVector = new Vector();

    planets.forEach((planet, _index) => {
      if (planet !== this) {
        const gravityVector = this.computeGravityForce(planet);
        if (gravityVector.length > maxVector.length) {
          this.setParent(planet);
          maxVector = gravityVector;
        }
        gravityForcesSumVector.addVector(gravityVector);
      }
    });

    return gravityForcesSumVector;
  }
}

export { Dot, IDot, IDotStartProps };
