import React from 'react';
import ReactDOM from 'react-dom';
import { SystemStore, UIStore, SimulationStore } from '../stores';
import App from './App';

const systemStore = new SystemStore();
const uiStore = new UIStore();
const simulationStore = new SimulationStore();

import { planets } from '../initData';
planets.forEach((planet) => {
  systemStore.addPlanet(planet);
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