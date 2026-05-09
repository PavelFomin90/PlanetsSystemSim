import type { ICoords, IDot } from "./dot";

/**
 * Класс для отрисовки элементов симуляции на Canvas.
 * 
 * Отвечает за отрисовку тел, орбит, фона и звёзд.
 * Поддерживает работу с контекстом 2D и управлением состоянием отрисовки.
 * 
 * @class Drawer
 */
class Drawer {
  private ctx: CanvasRenderingContext2D | null;
  private starPositions: {x: number, y: number}[] = [];

  constructor(context: CanvasRenderingContext2D | null) {
    this.ctx = context;
  }

  /**
   * Рисует орбиту тела на основе его истории координат.
   * 
   * Также реализует эффект "привязки" орбиты к родительскому телу (если есть),
   * чтобы орбита вращалась вместе с родителем.
   * 
   * @param {IDot} object - Тело, орбиту которого нужно нарисовать.
   * @param {string} color - Цвет линии орбиты.
   */
  drawOrbit(object: IDot, color: string): void {
    if (!this.ctx) return;
    this.ctx.beginPath();
    const prevCoords = object.prevCoords;
    const parent = object.parent;
    const parentPrevCoords =
      parent && parent?.prevCoords?.length ? parent.prevCoords : [{ x: 0, y: 0 }];
    const { x: currentX, y: currentY } = object.coords;
    const newPrevCoord = [] as ICoords[];

  prevCoords.forEach((prevCoord, i) => {
    const { x, y } = prevCoord;

    if (i > 0) {
      const prevX = prevCoords[i - 1].x;
      const prevY = prevCoords[i - 1].y;

      this.ctx?.moveTo(prevX, prevY);
      this.ctx?.lineTo(x, y);
      }
    });
  if (prevCoords[0]) {
      const gradient = this.ctx.createLinearGradient(
      object.coords.x,
      object.coords.y,
      prevCoords[0].x,
      prevCoords[0].y
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color);
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
  }
  if (prevCoords.length && object.name !== "sun") {
    prevCoords.forEach((prevCoord, i) => {
      if (parent) {
          const { x: parentX, y: parentY } = parent.coords;
          const { x: ppX, y: ppY } = parentPrevCoords[parentPrevCoords.length - 2];
        newPrevCoord[i] = {
            x: prevCoord.x + (parentX - ppX),
            y: prevCoord.y + (parentY - ppY),
        };
      }
    });
    this.ctx.closePath();

  }

  if (newPrevCoord.length && object.name !== "sun") {
    object.setPrevCoords(newPrevCoord);
  }

  object.addPrevCoord({ x: currentX, y: currentY });

  if (prevCoords.length > 500) {
    object.prevCoords.shift();
  }
  }

  /**
   * Рисует тело как круг на холсте.
   * 
   * @param {IDot} object - Тело, которое нужно нарисовать.
   * @param {string} color - Цвет заливки.
   */
  drawDot(object: IDot, color: string): void {
    if (!this.ctx) return;
    const { x, y } = object.coords;

    this.ctx.beginPath();
    this.ctx.arc(x, y, object.radius, 0, 360);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  /**
   * Рисует фон из случайно расположенных звёзд.
   * 
   * При первом вызове генерирует 100 звёзд с фиксированными координатами,
   * чтобы они не «прыгали» при перерисовке.
   */
  drawStars():void {
    if (!this.ctx) return;
  
    const width = this.ctx.canvas.width;
    const height = this.ctx.canvas.height;
    if (this.starPositions.length === 0) {
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        this.starPositions.push({ x, y });
      }
    }

    for (const star of this.starPositions) {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = "#FFF";
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  /**
   * Рисует фон симуляции: чёрное небо и звёзды.
   * 
   * Вызывается каждый кадр перед отрисовкой тел.
   */
  drawBackground(): void {
    if (!this.ctx) return;

    const width = this.ctx.canvas.width;
    const height = this.ctx.canvas.height;

    // Рисуем темное небо
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, width, height);

    this.drawStars();
  }

  /**
   * Устанавливает контекст рисования.
   * 
   * Должен быть вызван перед началом отрисовки.
   * 
   * @param {CanvasRenderingContext2D} context - Контекст 2D холста.
   */
  setContext(context: CanvasRenderingContext2D) {
    this.ctx = context;
  }
}

export { Drawer };
