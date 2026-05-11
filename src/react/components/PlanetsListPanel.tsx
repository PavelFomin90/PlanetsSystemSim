import { observer } from 'mobx-react-lite';
import { SystemStore, UIStore } from '../../stores';

interface PlanetsListPanelProps {
  systemStore: SystemStore;
  uiStore: UIStore;
}

const PlanetsListPanel = observer(({ systemStore, uiStore }: PlanetsListPanelProps) => {
  const planets = systemStore.getPlanets();
  const handlePlanetClick = (planet: any) => {
    uiStore.selectPlanet(planet);
    uiStore.setTracking(true);
  };

  return (
    <div className="planets-list-panel">
      <h3>Список планет</h3>
      <ul>
        {planets.map((planet) => (
          <li 
            key={planet.name}
            onClick={() => handlePlanetClick(planet)}
            className={uiStore.selectedPlanet?.name === planet.name ? 'selected' : ''}
          >
            {planet.name}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default PlanetsListPanel;