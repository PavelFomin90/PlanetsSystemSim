import { toDegrees, toRadians } from "../utils/math";

import { IVector, Vector } from "./vector";

interface ICoords {
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
  prevCoords: ICoords[];
  addPrevCoord: (value: ICoords) => void;
  computeGravityForce: (planets: IDot[]) => Vector;
}

interface IDotStartProps {
  velocity?: IVector;
  acceleration?: IVector;
  coords?: ICoords;
  mass?: number;
  color?: string;
  radius?: number;
}

class Dot implements IDot {
  coords: ICoords;
  velocity: IVector;
  acceleration: IVector;
  mass: number;
  color: string;
  radius: number;
  prevCoords: ICoords[];

  constructor(props: IDotStartProps) {
    const { coords, velocity, acceleration, mass, color, radius } = props;

    this.coords = coords || { x: 0, y: 0 };
    this.velocity = velocity || new Vector(0, 0);
    this.acceleration = acceleration || new Vector(0, 0);
    this.mass = mass || 0;
    this.color = color || "green";
    this.radius = radius || 15;
    this.prevCoords = [];
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

  computeGravityForce(planets: IDot[]) {
    const GRAVCONST = 1;
    const { x, y } = this.coords;
    let tempVector = new Vector();
    planets.forEach((planet, _index) => {
      if (planet !== this) {
        const distance = Math.sqrt(
          Math.pow(x - planet.coords.x, 2) + Math.pow(y - planet.coords.y, 2)
        );
        const length = (GRAVCONST * planet.mass) / Math.pow(distance, 2);
        const angle = toDegrees(
          Math.atan2(planet.coords.y - y, planet.coords.x - x)
        );

        if (!tempVector) {
          tempVector = new Vector(length, angle);
        } else {
          tempVector.addVector(new Vector(length, angle));
        }
      }
    });

    return tempVector;
  }
}

export { Dot, IDot };
