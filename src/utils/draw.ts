import type { IDot } from '../models/dot';

const drawOrbit = (ctx: CanvasRenderingContext2D, object: IDot, color: string) => {
    ctx.beginPath();
    const prevCoords = object.prevCoords;
    const {x: currentX, y: currentY } = object.coords;
    prevCoords.forEach((prevCoord, i) => {
        const { x, y } = prevCoord;
        if (i > 0) {
            const prevX = prevCoords[i - 1].x;
            const prevY = prevCoords[i - 1].y

            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
        }
    });
    if (prevCoords[0]) {
        const gradient = ctx.createLinearGradient(object.coords.x, object.coords.y, prevCoords[0].x, prevCoords[0].y);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color);
        ctx.strokeStyle = gradient;
        ctx.stroke();
    }
    ctx.closePath();
    object.addPrevCoord({x: currentX, y: currentY});

    if (prevCoords.length > 150) {
        object.prevCoords.shift();
    }
}

const drawDot = (ctx: CanvasRenderingContext2D, object: IDot, color: string) => {
    const { x, y } = object.coords;

    ctx.beginPath();
    ctx.arc(x, y, object.radius, 0, 360);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

export { drawOrbit, drawDot };