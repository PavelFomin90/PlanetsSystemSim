import { TranslateController } from "./controller/translateController";
import { planets } from "./initData";
import { SystemStore, UIStore, SimulationStore } from "./stores";
import { Drawer } from "./models/draw";
import { Tracker } from "./models/tracker";
import { CanvasIntegration } from "./canvasIntegration";
import React from 'react';
import ReactDOM from 'react-dom';
import App from "./react/App";
import { DotObservable } from "./models/dotObservable";

// Создание stores
const systemStore = new SystemStore();
const uiStore = new UIStore();
const simulationStore = new SimulationStore();

// Инициализация планет
planets.forEach((planet) => {
  const dotObservable = new DotObservable({
    name: planet.name,
    coords: planet.coords,
    velocity: planet.velocity,
    acceleration: planet.acceleration,
    mass: planet.mass,
    color: planet.color,
    radius: planet.radius,
  });
  dotObservable.setPrevCoords(planet.prevCoords);
  systemStore.addPlanet(dotObservable);
});

// Настройка Canvas
const canvas: HTMLCanvasElement | null = document.querySelector("#canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get the 2D context from the canvas.");
  const drawer = new Drawer(ctx);
  const tracker = new Tracker();
  const _translateInstance = new TranslateController({
    context: ctx,
    initialScale: 0.2,
    initialTranslate: { x: 0, y: 0 },
  });
  // Создание интеграции
  const _canvasIntegration = new CanvasIntegration(
    drawer,
    tracker,
    systemStore,
    uiStore,
    simulationStore
  );
  void _translateInstance;
  void _canvasIntegration;

  // Настройка размеров
  canvas.width = window.innerWidth - 4;
  canvas.height = window.innerHeight - 4;
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth - 4;
    canvas.height = window.innerHeight - 4;
  });
  // Запуск симуляции
  simulationStore.start();
  // Рендер React приложения
  const appElement = document.getElementById('app');
  if (appElement) {
    ReactDOM.render(
      <React.StrictMode>
        <App
          systemStore={systemStore}
          uiStore={uiStore}
          simulationStore={simulationStore}
        />
      </React.StrictMode>,
      appElement
    );
  }
}