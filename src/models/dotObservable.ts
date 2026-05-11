import { observable, action, computed } from 'mobx';
import { IDotStartProps } from './dot';
import { Vector } from './vector';
import { toDegrees, toRadians } from '../utils/math';

export class DotObservable {
  @observable coords = { x: 0, y: 0 };
  @observable velocity: Vector;
  @observable acceleration: Vector;
  @observable mass = 0;
  @observable color = "green";
  @observable radius = 15;
  @observable prevCoords: { x: number; y: number }[] = [];
  @observable parent: DotObservable | null = null;
  name: string;

  constructor(props: IDotStartProps) {
    const { coords, velocity, acceleration, mass, color, radius, name } = props;
    this.coords = coords || { x: 0, y: 0 };
    this.velocity = (velocity as Vector) || new Vector(0, 0);
    this.acceleration = (acceleration as Vector) || new Vector(0, 0);
    this.mass = mass || 0;
    this.color = color || "green";
    this.radius = radius || 15;
    this.prevCoords = [];
    this.parent = null;
    this.name = name;
  }

  @action
  setCoords(coords: { x: number; y: number }) {
    this.coords = coords;
  }

  @action
  addPrevCoord(coords: { x: number; y: number }) {
    this.prevCoords.push(coords);
    if (this.prevCoords.length > 500) {
      this.prevCoords.shift();
    }
  }

  @action
  setPrevCoords(coords: { x: number; y: number }[]) {
    this.prevCoords = coords;
  }

  @action
  setParent(parent: DotObservable) {
    this.parent = parent;
  }

  @computed
  get x() {
    return this.coords.x;
  }

  @computed
  get y() {
    return this.coords.y;
  }

  @action
  move() {
    const velocity = this.velocity;
    const coords = this.coords;
    this.coords.x =
      coords.x + velocity.length * Math.cos(toRadians(velocity.angle));
    this.coords.y =
      coords.y + velocity.length * Math.sin(toRadians(velocity.angle));
  }

  @action
  accelerate() {
    this.velocity.addVector(this.acceleration);
  }

  computeGravityForce(planet: DotObservable): Vector {
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

  computeGravityForcesVector(planets: DotObservable[]): Vector {
    const gravityForcesSumVector = new Vector();
    let maxVector = new Vector();

    planets.forEach((_planet, _index) => {
      if (_planet !== this) {
        const gravityVector = this.computeGravityForce(_planet);
        if (gravityVector.length > maxVector.length) {
          this.setParent(_planet);
          maxVector = gravityVector;
        }
        gravityForcesSumVector.addVector(gravityVector);
      }
    });

    return gravityForcesSumVector;
  }
}
