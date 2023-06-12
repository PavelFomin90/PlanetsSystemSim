import { TranslateController } from "../controller/translateController";
import { IDot } from "../models/dot";
import { round } from "../utils/math";

interface ITracker {
  readonly trackObject: IDot | null;
  track: (trackObject: IDot) => void;
  resetTracker: () => void;
}

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

  public track = (trackObject: IDot | null) => {
    if (trackObject) {
      this.setTrackObject(trackObject);
      this.trackPlanet();
    }
  };

  public resetTracker = () => {
    this.setTrackObject(null);
    this.trackerId && cancelAnimationFrame(this.trackerId);
    this.trackerId = null;
  };

  private setTrackObject = (trackObject: IDot | null) => {
    this.trackObject = trackObject;
  };

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
