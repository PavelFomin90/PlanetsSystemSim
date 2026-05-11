import { observer } from 'mobx-react-lite';
import { UIStore } from '../../stores';
import { useEffect } from 'react';

interface InfoPanelProps {
  uiStore: UIStore;
}

const InfoPanel = observer(({ uiStore }: InfoPanelProps) => {
  const selectedPlanet = uiStore.selectedPlanet;
  useEffect(() => {
    // Эффект для отслеживания изменений
  }, [selectedPlanet]);
  return (
    <div className="info-panel">
      <h3>Информация о планете</h3>
      {selectedPlanet ? (
        <div>
          <p>Имя: {selectedPlanet.name}</p>
          <p>Масса: {selectedPlanet.mass}</p>
          <p>Координаты: ({selectedPlanet.x.toFixed(2)}, {selectedPlanet.y.toFixed(2)})</p>
          <p>Радиус: {selectedPlanet.radius}</p>
          <p>Цвет: {selectedPlanet.color}</p>
        </div>
      ) : (
        <p>Нет выбранной планеты</p>
      )}
    </div>
  );
});

export default InfoPanel;