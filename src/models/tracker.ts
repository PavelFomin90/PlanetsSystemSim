import { TranslateController } from "../controller/translateController";
import { IDot } from "../models/dot";
import { round } from "../utils/math";

interface ITracker {
  readonly trackObject: IDot | null;
  track: (trackObject: IDot) => void;
  resetTracker: () => void;
}

/**
 * Класс для отслеживания тела в симуляции.
 * 
 * Реализует паттерн Singleton и автоматически центрирует камеру на выбранном теле.
 * Использует `TranslateController` для управления трансформацией.
 * 
 * @class Tracker
 * @implements {ITracker}
 */
class Tracker implements ITracker {
  private trackerId: number | null = null;
  trackObject: IDot | null = null;
  private translateInstance = new TranslateController();

  private static _instance: Tracker;

  constructor() {
    if (Tracker._instance) {
      return Tracker._instance;
    }

    Tracker._instance = this;
  }

  /**
   * Начинает отслеживание тела.
   * 
   * Если тело задано, устанавливает его как `trackObject` и запускает анимацию центрирования.
   * 
   * @param {IDot | null} trackObject - Тело для отслеживания или `null` для остановки.
   */
  public track = (trackObject: IDot | null) => {
    if (trackObject) {
      this.setTrackObject(trackObject);
      this.trackPlanet();
    }
  };

  /**
   * Останавливает отслеживание и сбрасывает текущее тело.
   * 
   * Отменяет анимацию центрирования.
   */
  public resetTracker = () => {
    this.setTrackObject(null);
    this.trackerId && cancelAnimationFrame(this.trackerId);
    this.trackerId = null;
  };

  private setTrackObject = (trackObject: IDot | null) => {
    this.trackObject = trackObject;
  };

  /**
   * Центрирует камеру на текущем отслеживаемом теле.
   * 
   * Запускается через `requestAnimationFrame` и выполняется постоянно, пока `trackObject` не будет сброшен.
   * Использует `TranslateController.setTranslate` для перемещения вида.
   */
  private trackPlanet = () => {
    if (!this.trackObject) {
      return;
    }
    const xTranslate = round(
      -this.trackObject.coords.x * this.translateInstance.scale +
        window.innerWidth / 2,
      0
    );
    const yTranslate = round(
      -this.trackObject.coords.y * this.translateInstance.scale +
        window.innerHeight / 2,
      0
    );

    this.translateInstance.setTranslate({
      x: xTranslate,
      y: yTranslate,
    });

    this.trackerId = requestAnimationFrame(() => {
      this.trackPlanet();
    });
  };
}

export { Tracker };
