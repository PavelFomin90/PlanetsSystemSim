import { InfoPanel } from '../../../src/ui/components/InfoPanel/InfoPanel';
import { Dot } from '../../../src/models/dot';

/**
 * Тесты для компонента InfoPanel
 * 
 * Проверяем функциональность панели информации:
 * - Создание элементов при инициализации
 * - Обновление данных о планете
 * - Показ и скрытие панели
 */

describe('InfoPanel', () => {
  let container: HTMLElement;
  let infoPanel: InfoPanel;
  let planet: Dot;
  
  beforeEach(() => {
    // Создаем контейнер для тестов
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Создаем панель
    infoPanel = new InfoPanel();
    
    // Создаем тестовую планету
    planet = new Dot({
      name: 'Test Planet',
      mass: 500.25,
      radius: 15,
      color: '#ff0000',
      velocity: { length: 3.4, angle: 0, addVector: jest.fn() }
    });
  });
  
  afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.removeChild(container);
  });
  
  test('должен создать панель с правильной структурой', () => {
    // Проверяем, что панель создана
    expect(infoPanel).toBeDefined();
    expect(infoPanel["element"]).toBeDefined();
    
    // Проверяем класс
    expect(infoPanel["element"].className).toBe('info-panel');
    
    // Проверяем, что все элементы созданы
    expect(infoPanel["nameEl"]).toBeDefined();
    expect(infoPanel["massEl"]).toBeDefined();
    expect(infoPanel["radiusEl"]).toBeDefined();
    expect(infoPanel["colorEl"]).toBeDefined();
    expect(infoPanel["velocityEl"]).toBeDefined();
  });
  
  test('должен рендерить панель в документ', () => {
    // Рендерим панель
    infoPanel.render(container);
    
    // Проверяем, что панель добавлена в контейнер
    expect(container.contains(infoPanel["element"])).toBe(true);
  });
  
  test('должен обновлять содержимое с информацией о планете', () => {
    // Рендерим панель
    infoPanel.render(container);
    
    // Обновляем панель с планетой
    infoPanel.update(planet);
    
    // Проверяем, что панель показана
    expect(infoPanel["element"].style.display).toBe('block');
    
    // Проверяем содержимое элементов
    expect(infoPanel["nameEl"].textContent).toBe('Test Planet');
    expect(infoPanel["massEl"].textContent).toBe('500.25');
    expect(infoPanel["radiusEl"].textContent).toBe('15 px');
    expect(infoPanel["velocityEl"].textContent).toBe('3.40');
    
    // Проверяем цвет
    expect(infoPanel["colorEl"].style.backgroundColor).toBe('rgb(255, 0, 0)');
  });
  
  test('должен скрывать панель при update(null)', () => {
    // Рендерим панель
    infoPanel.render(container);
    
    // Обновляем с планетой (показываем)
    infoPanel.update(planet);
    
    // Проверяем, что панель видима
    expect(infoPanel["element"].style.display).toBe('block');
    
    // Обновляем с null (скрываем)
    infoPanel.update(null);
    
    // Ждем завершения анимации
    setTimeout(() => {
      expect(infoPanel["element"].style.display).toBe('none');
    }, 310);
  });
});