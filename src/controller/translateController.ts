import { round } from "../utils/math";
import { throttle } from "../utils/throttle";

interface ITranslateController {
  scale: number;
  translate: { x: number; y: number };
}

interface ITranslateControllerProps {
  initialScale: number;
  initialTranslate: { x: number; y: number };
}

const INTERVAL_TIME = 20;

class TranslateController implements ITranslateController {
  scale = 0.2;
  translate = { x: 0, y: 0 };

  private static _instance: TranslateController;
  private interval: ReturnType<typeof setInterval> | undefined;

  constructor(props: ITranslateControllerProps) {
    if (TranslateController._instance) {
      return TranslateController._instance;
    }

    this.scale = props.initialScale;
    this.translate = props.initialTranslate;

    this.setListner();

    TranslateController._instance = this;
  }

  private scaleFunction = (scaleDelta: number) => {
    this.interval && clearInterval(this.interval);
    const initScale = this.scale;
    let intervalFunc;
    if (scaleDelta > 0) {
      intervalFunc = () => {
        this.scale += scaleDelta / 10;
        if (this.scale >= initScale + scaleDelta) {
          clearInterval(this.interval);
        }
      };
    } else {
      if (this.scale <= 0.05) {
        clearInterval(this.interval);
        return;
      }
      intervalFunc = () => {
        this.scale += scaleDelta / 10;
        if (this.scale <= initScale + scaleDelta) {
          clearInterval(this.interval);
        }
      };
    }

    this.interval = setInterval(intervalFunc, INTERVAL_TIME);
  };

  private scaleIn = () => {
    this.scaleFunction(0.01);
  };

  private scaleOut = () => {
    this.scaleFunction(-0.01);
  };

  private moveLeft = () => {
    this.interval && clearInterval(this.interval);
    const initialTranslateX = this.translate.x;

    this.interval = setInterval(() => {
      this.translate.x = round(this.translate.x - 2);
      if (this.translate.x <= initialTranslateX - 20) {
        clearInterval(this.interval);
      }
    }, INTERVAL_TIME);
  };

  private moveRight = () => {
    this.interval && clearInterval(this.interval);
    const initialTranslateX = this.translate.x;

    this.interval = setInterval(() => {
      this.translate.x = round(this.translate.x + 2);
      if (this.translate.x >= initialTranslateX + 20) {
        clearInterval(this.interval);
      }
    }, INTERVAL_TIME);
  };

  private moveTop = () => {
    this.interval && clearInterval(this.interval);
    const initialTranslateY = this.translate.y;

    this.interval = setInterval(() => {
      this.translate.y = round(this.translate.y + 2);
      if (this.translate.y >= initialTranslateY + 20) {
        clearInterval(this.interval);
      }
    }, 20);
  };

  private moveDown = () => {
    this.interval && clearInterval(this.interval);
    const initialTranslateY = this.translate.y;

    this.interval = setInterval(() => {
      this.translate.y = round(this.translate.y - 2);
      if (this.translate.y <= initialTranslateY - 20) {
        clearInterval(this.interval);
      }
    }, 20);
  };

  private scaleWithMouse = (deltaY: number) => {
    let scaleDelta;
    const invertDeltaY = deltaY * -1;

    if (deltaY > 0) {
      scaleDelta = Math.max(0.02, invertDeltaY / 20000);
    } else {
      scaleDelta = Math.min(-0.02, invertDeltaY / 20000);
    }

    this.scaleFunction(scaleDelta);
  };

  private setListner = () => {
    const throttledScale = throttle<number>((deltaY) => {
      deltaY && this.scaleWithMouse(deltaY);
    }, 200);

    document.addEventListener("wheel", (e) => {
      throttledScale(e.deltaY);
    });
    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 81:
          this.scaleOut();
          break;
        case 87:
          this.scaleIn();
          break;
        case 37:
          this.moveRight();
          break;
        case 38:
          this.moveTop();
          break;
        case 39:
          this.moveLeft();
          break;
        case 40:
          this.moveDown();
          break;
        default:
          clearInterval(this.interval);
          break;
      }
    });
  };
}

export { TranslateController };
