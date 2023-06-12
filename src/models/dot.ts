import { toDegrees, toRadians } from "../utils/math";

import { IVector, Vector } from "./vector";

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

interface IDotStartProps {
  velocity?: IVector;
  acceleration?: IVector;
  coords?: ICoords;
  mass?: number;
  color?: string;
  radius?: number;
  name: string;
}

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

  move() {
    const velocity = this.velocity;
    const coords = this.coords;
    this.coords.x =
      coords.x + velocity.length * Math.cos(toRadians(velocity.angle));
    this.coords.y =
      coords.y + velocity.length * Math.sin(toRadians(velocity.angle));
  }

  accelerate() {
    this.velocity.addVector(this.acceleration);
  }

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
