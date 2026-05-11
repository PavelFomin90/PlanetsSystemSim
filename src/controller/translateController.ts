import { ICoords } from "../models/dot";
import { round } from "../utils/math";
import { throttle } from "../utils/throttle";

/**
 * Интерфейс для управления трансформацией (масштаб и смещение).
 * 
 * @interface ITranslateController
 * @property {number} scale - Текущий масштаб.
 * @property {ICoords} translate - Координаты смещения.
 * @method setTranslate - Устанавливает новые координаты смещения.
 * @method makeTrasform - Применяет трансформацию к Canvas.
 */
interface ITranslateController {
  scale: number;
  translate: ICoords;
  setTranslate: (coords: ICoords) => void;
  makeTrasform: () => void;
}

/**
 * Параметры для инициализации контроллера.
 * 
 * @interface ITranslateControllerProps
 * @property {CanvasRenderingContext2D | null} context - Контекст Canvas.
 * @property {number} initialScale - Начальный масштаб.
 * @property {ICoords} initialTranslate - Начальные координаты смещения.
 */
interface ITranslateControllerProps {
  context: CanvasRenderingContext2D | null;
  initialScale: number;
  initialTranslate: ICoords;
}

const INTERVAL_TIME = 20;

/**
 * Контроллер для управления трансформацией (масштабирование и перемещение) на Canvas.
 * Реализует паттерн Singleton для единого экземпляра управления трансформацией.
 * 
 * @class TranslateController
 * @implements {ITranslateController}
 * 
 * @property {number} scale - Текущий масштаб (от 0.05 до 1.0+).
 * @property {ICoords} translate - Текущие координаты смещения (x, y).
 * @property {CanvasRenderingContext2D | null} context - Контекст Canvas для применения трансформации.
 * 
 * @example
 * const controller = new TranslateController({
 *   context: canvas.getContext('2d'),
 *   initialScale: 0.5,
 *   initialTranslate: { x: 0, y: 0 }
 * });
 * controller.setTranslate({ x: 100, y: 50 });
 * controller.makeTrasform();
 */
class TranslateController implements ITranslateController {
  scale = 0.2;
  translate = { x: 0, y: 0 };
  private context: CanvasRenderingContext2D | null = null;
  private initialScale = 0.2;

  private static _instance: TranslateController;
  private interval: ReturnType<typeof setInterval> | undefined;

   /**
   * Создает экземпляр контроллера трансформации.
   * 
   * @param {ITranslateControllerProps} [props] - Опциональные свойства для инициализации.
   * @param {CanvasRenderingContext2D | null} props.context - Контекст Canvas.
   * @param {number} props.initialScale - Начальный масштаб.
   * @param {ICoords} props.initialTranslate - Начальные координаты смещения.
   * 
   * @throws {Error} Если props не предоставлены.
   */
  constructor(props?: ITranslateControllerProps) {
    if (TranslateController._instance) {
      if (props && props.context) {
        TranslateController._instance.context = props.context;
        TranslateController._instance.scale = props.initialScale;
        TranslateController._instance.initialScale = props.initialScale;
        TranslateController._instance.translate = props.initialTranslate;
      }
      return TranslateController._instance;
    }

    if (props) {
      this.context = props.context;
      this.scale = props.initialScale;
      this.initialScale = props.initialScale;
      this.translate = props.initialTranslate;
    }

    this.setListner();

    TranslateController._instance = this;
  }

  /**
   * Устанавливает новые координаты смещения.
   * 
   * @param {ICoords} coords - Новые координаты (x, y).
   */
  public setTranslate = (coords: ICoords) => {
    this.translate.x = coords.x;
    this.translate.y = coords.y;
  };


  /**
   * Применяет текущую трансформацию (масштаб и смещение) к контексту Canvas.
   * 
   * @example
   * controller.makeTrasform(); // Применяет трансформацию к canvas
   */
  public makeTrasform = () => {
    if (this.context) {
      this.context.setTransform(
        round(this.scale, 4),
        0,
        0,
        round(this.scale, 4),
        round(this.translate.x, 2),
        round(this.translate.y, 2)
      );
    }
  };

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

  /**
   * Увеличивает масштаб на 1% с анимацией.
   */
  private scaleIn = () => {
    this.scaleFunction(0.01);
  };

  /**
   * Уменьшает масштаб на 1% с анимацией.
   */
  private scaleOut = () => {
    this.scaleFunction(-0.01);
  };

  /**
   * Сбрасывает масштаб к начальному значению.
   */
  private resetScale = () => {
    this.scale = this.initialScale;
  };

  private moveX = (deltaX: number) => {
    this.interval && clearInterval(this.interval);
    const initialTranslateX = this.translate.x;

    if (deltaX > 0) {
      this.interval = setInterval(() => {
        this.translate.x = round(this.translate.x + deltaX / 10);

        if (this.translate.x >= initialTranslateX + deltaX) {
          clearInterval(this.interval);
        }
      }, INTERVAL_TIME);
    } else {
      this.interval = setInterval(() => {
        this.translate.x = round(this.translate.x + deltaX / 10);
        if (this.translate.x <= initialTranslateX + deltaX) {
          clearInterval(this.interval);
        }
      }, INTERVAL_TIME);
    }
  };

  private moveY = (deltaY: number) => {
    this.interval && clearInterval(this.interval);
    const initialTranslateY = this.translate.y;

    if (deltaY > 0) {
      this.interval = setInterval(() => {
        this.translate.y = round(this.translate.y + deltaY / 10);
        if (this.translate.y >= initialTranslateY + deltaY) {
          clearInterval(this.interval);
        }
      }, INTERVAL_TIME);
    } else {
      this.interval = setInterval(() => {
        this.translate.y = round(this.translate.y + deltaY / 10);
        if (this.translate.y <= initialTranslateY + deltaY) {
          clearInterval(this.interval);
        }
      }, INTERVAL_TIME);
    }
  };

  private moveLeft = () => {
    this.moveX(-20);
  };

  private moveRight = () => {
    this.moveX(20);
  };

  private moveTop = () => {
    this.moveY(20);
  };

  private moveDown = () => {
    this.moveY(-20);
  };

  private scaleWithMouse = (deltaScale: number) => {
    let scaleDelta;

    if (deltaScale > 0) {
      scaleDelta = Math.min(0.02, deltaScale / 10000);
    } else {
      scaleDelta = Math.max(-0.02, deltaScale / 10000);
    }

    this.scaleFunction(scaleDelta);
  };

  /**
   * Обрабатывает перемещение через мышь.
   * 
   * @param {number} deltaX - Изменение координаты X.
   * @param {number} deltaY - Изменение координаты Y.
   */
  private moveWithMouse = (deltaX: number, deltaY: number) => {
    let xDelta: number;
    let yDelta: number;

    if (deltaX > 0) {
      xDelta = Math.min(50, deltaX * 5);
    } else {
      xDelta = Math.max(-50, deltaX * 5);
    }

    if (deltaY > 0) {
      yDelta = Math.min(50, deltaY * 5);
    } else {
      yDelta = Math.max(-50, deltaY * 5);
    }

    this.translate.x = this.translate.x + xDelta;
    this.translate.y = this.translate.y + yDelta;
  };

  /**
   * Устанавливает обработчики событий для управления трансформацией.
   */
  private setListner = () => {
    let prevX: number | undefined;
    let prevY: number | undefined;
    let mouseMoveTimeout: ReturnType<typeof setTimeout>;

    const throttleMove = throttle<{ deltaX: number; deltaY: number }>(
      (args) => {
        if (!args) {
          return;
        }

        const { deltaX, deltaY } = args;

        this.moveWithMouse(deltaX, deltaY);
      },
      INTERVAL_TIME
    );

    const mouseMoveListner = (e: MouseEvent) => {
      if (!prevX || !prevY) {
        prevX = e.clientX;
        prevY = e.clientY;
        return;
      }

      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
      }

      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;

      prevX = e.clientX;
      prevY = e.clientY;

      throttleMove({ deltaX, deltaY });
    };

    const throttledScale = throttle<number>((deltaScale) => {
      deltaScale && this.scaleWithMouse(deltaScale);
    }, 20);

    document.addEventListener("mousedown", () => {
      document.addEventListener("mousemove", mouseMoveListner);
    });

    document.addEventListener("mouseup", () => {
      prevX = undefined;
      prevY = undefined;
      document.removeEventListener("mousemove", mouseMoveListner);
    });

    document.addEventListener("wheel", (e) => {
      throttledScale(e.deltaY);
    });
    document.addEventListener("keydown", (e) => {
      switch (e.which) {
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
        case 82:
          this.resetScale();
          break;
        default:
          clearInterval(this.interval);
          break;
      }
    });
  };
}

export { TranslateController };
