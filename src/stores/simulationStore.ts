import { makeAutoObservable } from 'mobx';
export class SimulationStore {
  isRunning: boolean = false;
  speed: number = 1;
  constructor() {
    makeAutoObservable(this);
  }
  start() {
    this.isRunning = true;
  }
  stop() {
    this.isRunning = false;
  }
  setSpeed(speed: number) {
    this.speed = speed;
  }
}