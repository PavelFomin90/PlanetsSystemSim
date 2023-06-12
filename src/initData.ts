import { Dot, IDot, IDotStartProps } from "./models/dot";
import { Vector } from "./models/vector";

const planets = [] as IDot[];
const dotProps: IDotStartProps[] = [
  {
    coords: { x: 1240, y: 1400 },
    mass: 90,
    velocity: new Vector(6, 180),
    acceleration: new Vector(0, 0),
    color: "green",
    name: "earth",
  },
  {
    coords: { x: 1220, y: 1900 },
    mass: 10,
    velocity: new Vector(8, 180),
    acceleration: new Vector(0, 0),
    color: "grey",
    name: "moon",
  },
  {
    coords: { x: 1250, y: 2550 },
    mass: 32550,
    color: "orange",
    radius: 100,
    name: "sun",
  },
  {
    coords: { x: 1250, y: -100 },
    mass: 1000,
    velocity: new Vector(3.5, 180),
    acceleration: new Vector(0, 0),
    color: "brown",
    radius: 60,
    name: "upiter",
  },
  {
    coords: { x: 1270, y: 130 },
    mass: 1,
    velocity: new Vector(5.5, 180),
    acceleration: new Vector(0, 0),
    color: "grey",
    name: "upiterMoon1",
  },
  {
    coords: { x: 1270, y: -200 },
    mass: 1,
    velocity: new Vector(6.8, 180),
    acceleration: new Vector(0, 0),
    color: "red",
    name: "upiterMoon2",
  },
];

const createPlanet = (dotParams: IDotStartProps) => {
  planets.push(new Dot(dotParams));
};

// Начальные координаты, масса, вектор скорости и вектор ускорения
dotProps.forEach((dotProp) => {
  createPlanet(dotProp);
});

export { planets };
