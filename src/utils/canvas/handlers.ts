import { round } from "../math";

const getCanvasClickCoors = (e: MouseEvent) => {
  const clickCoords = { x: 0, y: 0 };
  const canvas = document.querySelector("canvas");
  const canvasTransform = canvas?.getContext("2d")?.getTransform();
  const canvasRect = canvas?.getBoundingClientRect();

  if (!canvas || !canvasRect || !canvasTransform) {
    console.error("canvas was not found");
    return;
  }
  const pageClickCoords = {
    x: e.offsetX,
    y: e.offsetY,
  };

  const canvasClickCoords = {
    x: canvasRect?.x,
    y: canvasRect?.y,
  };

  clickCoords.x = round(
    (pageClickCoords.x - canvasClickCoords.x - canvasTransform.e) /
      canvasTransform.a,
    0
  );
  clickCoords.y = round(
    (pageClickCoords.y - canvasClickCoords.y - canvasTransform.f) /
      canvasTransform.d,
    0
  );

  return clickCoords;
};

export { getCanvasClickCoors };
