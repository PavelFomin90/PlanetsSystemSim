import { makeAutoObservable } from 'mobx';

export class SimulationStore {
  isRunning: boolean = false;
  speed: number = 1;
  private intervalId: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  start() {
    this.isRunning = true;
    this.startSimulationLoop();
  }

  stop() {
    this.isRunning = false;
    this.stopSimulationLoop();
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  private startSimulationLoop() {
    this.intervalId = window.setInterval(() => {
      if (this.isRunning) {
        // здесь будет вызов обновления планет
      }
    }, 30 / this.speed);
  }

  private stopSimulationLoop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}