import React from 'react';
import ReactDOM from 'react-dom';
import { SystemStore, UIStore, SimulationStore } from '../stores';
import App from './App';
import { DotObservable } from '../models/dotObservable';

const systemStore = new SystemStore();
const uiStore = new UIStore();
const simulationStore = new SimulationStore();

import { planets } from '../initData';
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