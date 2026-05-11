import { observable, action, computed } from 'mobx';
import { IDotStartProps } from './dot';
import { Vector } from './vector';

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
    this.velocity = velocity || new Vector(0, 0);
    this.acceleration = acceleration || new Vector(0, 0);
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

  @computed
  get x() {
    return this.coords.x;
  }

  @computed
  get y() {
    return this.coords.y;
  }
}
