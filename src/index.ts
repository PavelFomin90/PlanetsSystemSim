import { Vector } from './models/vector';
import { Dot } from './models/dot';
import { System } from './models/system';
import { drawDot, drawOrbit } from './utils/draw';
import { translateController } from './controller/translateController';

// Начальные координаты, масса, вектор скорости и вектор ускорения
const earth = new Dot({ coords: {x: 1240, y: 1400 }, mass: 90, velocity: new Vector(6, 180), acceleration: new Vector(0, 0), color: 'green'});
const moon = new Dot({ coords: {x: 1220, y: 1900 }, mass: 10, velocity: new Vector(8, 180), acceleration: new Vector(0, 0), color: 'grey'});
const sun = new Dot({ coords: {x: 1250, y: 2550 }, mass: 32550, velocity: new Vector(0, 0), acceleration: new Vector(0, 0), color: 'orange', radius: 100});
const upiter = new Dot({ coords: {x: 1250, y: -100 }, mass: 1000, velocity: new Vector(3.5, 180), acceleration: new Vector(0, 0), color: 'brown', radius: 60});
const upiterMoon = new Dot({ coords: {x: 1270, y: 100 }, mass: 1, velocity: new Vector(5.5, 180), acceleration: new Vector(0, 0), color: 'grey'});
const upiterMoon2 = new Dot({ coords: {x: 1270, y: -200 }, mass: 1, velocity: new Vector(6.5, 180), acceleration: new Vector(0, 0), color: 'red'});

const system = new System();

system.addPlanet(sun);
system.addPlanet(earth);
system.addPlanet(moon);
system.addPlanet(upiter);
system.addPlanet(upiterMoon);
system.addPlanet(upiterMoon2);



const canvas: HTMLCanvasElement = document.querySelector("#canvas");
canvas.width = window.innerWidth - 4;
canvas.height = window.innerHeight - 4;

const ctx = canvas.getContext('2d');

const translateInstance = new translateController({ initialScale: 0.2, initialTranslate: {x: 0, y: 0} });

const draw = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.setTransform(translateInstance.scale, 0, 0, translateInstance.scale, translateInstance.translate.x, translateInstance.translate.y);

    system.planets.forEach((planet) => {
        drawDot(ctx, planet, planet.color);
        drawOrbit(ctx, planet, planet.color);
    });

    requestAnimationFrame(draw);
}

// let step = 0;
setInterval(() => {
    system.planets.forEach((planet) => {
        planet.move();
        planet.acceleration = planet.computeGravityForce(system.planets);
        planet.accelerate();
    });
}, 30);


requestAnimationFrame(draw);

