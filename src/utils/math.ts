const toRadians = (angle: number): number => {
    return angle * (Math.PI / 180);
};

const toDegrees = (rad: number) => {
    return rad / (Math.PI / 180);
}

const round = (num: number, fractionDigits = 4) => {
    return Number(num.toFixed(fractionDigits));
}

export { toRadians, toDegrees, round };
