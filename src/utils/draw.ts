import type { ICoords, IDot } from "../models/dot";

const drawOrbit = (
  ctx: CanvasRenderingContext2D,
  object: IDot,
  color: string
) => {
  ctx.beginPath();
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

      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
    }
  });

  if (prevCoords[0]) {
    // const gradient = ctx.createLinearGradient(
    //   object.coords.x,
    //   object.coords.y,
    //   2 * prevCoords[0].x - parentPrevCoords[0].x,
    //   2 * prevCoords[0].y - parentPrevCoords[0].y
    // );
    // gradient.addColorStop(0, color);
    // gradient.addColorStop(1, color);
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  ctx.closePath();
  if (prevCoords.length && object.name !== "sun") {
    prevCoords.forEach((prevCoord, i) => {
      // const { x: parentX, y: parentY } = parentPrevCoords[i - 1] ?? {
      //   x: 0,
      //   y: 0,
      // };
      if (parent) {
        const { x, y } = prevCoord;
        const { x: parentX, y: parentY } = parent.coords;
        const { x: ppX, y: ppY } =
          parentPrevCoords[parentPrevCoords.length - 2];

        // if (object.name === "upiterMoon2") {
        //   console.log(parentX - ppX);
        // }
        newPrevCoord[i] = {
          x: x + (parentX - ppX),
          y: y + (parentY - ppY),
        };
      }
    });
  }

  if (newPrevCoord.length && object.name !== "sun") {
    object.setPrevCoords(newPrevCoord);
  }

  object.addPrevCoord({ x: currentX, y: currentY });

  if (prevCoords.length > 1500) {
    object.prevCoords.shift();
  }
};

const drawDot = (
  ctx: CanvasRenderingContext2D,
  object: IDot,
  color: string
) => {
  const { x, y } = object.coords;

  ctx.beginPath();
  ctx.arc(x, y, object.radius, 0, 360);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};

export { drawOrbit, drawDot };
