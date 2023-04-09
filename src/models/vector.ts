import { toRadians, toDegrees, round } from '../utils/math';

interface IVector {
    length: number;
    angle: number;
    addVector(vector: IVector): void;
}

interface IDecartVector {
    x: number;
    y: number;
}

class Vector implements IVector {
    length: number;
    angle: number;

    public constructor(length = 0, angle = 0) {
        this.length = round(length);
        this.angle = round(angle);
    };

    private toDecartCoords = (vector: IVector) => {
        const { length, angle } = vector;

        return {
            x: length*Math.cos(toRadians(angle)),
            y: length*Math.sin(toRadians(angle))
        }
    };

    private toPolarCoords = (decartVector: IDecartVector) => {
        const { x, y } = decartVector;
        return {
            length: Math.sqrt(x**2 + y**2),
            angle: toDegrees(Math.atan2(y, x)),
        }
    };

    public addVector(vector: IVector) {
        const thisDecart = this.toDecartCoords(this);
        const anotherDecart = this.toDecartCoords(vector);

        const resultDecart = {
            x: thisDecart.x + anotherDecart.x,
            y: thisDecart.y + anotherDecart.y
        };

        const resultPolar = this.toPolarCoords(resultDecart);

        this.length = round(resultPolar.length);
        this.angle = round(resultPolar.angle);
    };
}

export { Vector, IVector };