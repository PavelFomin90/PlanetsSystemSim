import { observer } from 'mobx-react-lite';
import { SystemStore, UIStore, SimulationStore } from '../stores';
import InfoPanel from './components/InfoPanel';
import PlanetsListPanel from './components/PlanetsListPanel';

interface AppProps {
  systemStore: SystemStore;
  uiStore: UIStore;
  simulationStore: SimulationStore;
}

const App = observer(({ systemStore, uiStore, simulationStore }: AppProps) => {
  return (
    <div className="app">
      <div className="controls">
        <button onClick={() => simulationStore.isRunning ? simulationStore.stop() : simulationStore.start()}>
          {simulationStore.isRunning ? 'Стоп' : 'Старт'}
        </button>
        <button onClick={() => simulationStore.setSpeed(simulationStore.speed + 0.5)}>
          Ускорить
        </button>
        <button onClick={() => simulationStore.setSpeed(Math.max(0.5, simulationStore.speed - 0.5))}>
          Замедлить
        </button>
      </div>
      
      <InfoPanel uiStore={uiStore} />
      <PlanetsListPanel systemStore={systemStore} uiStore={uiStore} />
      
      <canvas id="canvas" width={window.innerWidth - 4} height={window.innerHeight - 4} />
    </div>
  );
});

export default App;