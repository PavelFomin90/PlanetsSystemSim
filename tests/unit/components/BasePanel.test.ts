import { BasePanel } from '../../../src/ui/components/BasePanel/BasePanel';

/**
 * Тесты для компонента BasePanel
 * 
 * Проверяем базовую функциональность панели:
 * - Создание элемента
 * - Показ и скрытие с анимацией
 * - Управление видимостью
 */

describe('BasePanel', () => {
  let container: HTMLElement;
  
  beforeEach(() => {
    // Создаем контейнер для тестов
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });
  
  afterEach(() => {
    // Очищаем DOM после каждого теста
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    
    // Удаляем все дочерние элементы из body
    document.body.innerHTML = '';
  });
  
  test('должен создать базовую панель', () => {
    // Создаем панель без параметров
    const panel = new BasePanel();
    
    // Проверяем, что элемент создан
    expect(panel["element"]).toBeDefined();
    
    // Проверяем, что элемент существует
    expect(panel["element"]).toBeDefined();
    
    // Проверяем класс элемента
    expect(panel["element"].className).toBe('');
  });
  
  test('должен создать панель с указанными параметрами', () => {
    // Создаем панель с параметрами
    const panel = new BasePanel('section', 'test-panel');
    
    // Проверяем тег элемента
    expect(panel["element"].tagName).toBe('SECTION');
    
    // Проверяем класс элемента
    expect(panel["element"].className).toBe('test-panel');
  });
  
  test('должен рендерить панель в контейнер', () => {
    // Создаем панель
    const panel = new BasePanel();
    
    // Рендерим панель
    panel.render(container);
    
    // Проверяем, что панель добавлена в контейнер
    expect(container.contains(panel["element"])).toBe(true);
  });
  
  test('должен показывать панель', () => {
    // Создаем панель
    const panel = new BasePanel();
    
    // Рендерим панель
    panel.render(container);
    
    // Скрываем панель
    panel.hide();
    
    // Проверяем начальное состояние
    expect(panel["element"].style.display).toBe('none');
    
    // Показываем панель
    panel.show();
    
    // Проверяем, что панель видима
    expect(panel["element"].style.display).toBe('block');
  });
  
  test('должен скрывать панель с анимацией', () => {
    // Создаем панель
    const panel = new BasePanel();
    
    // Рендерим панель
    panel.render(container);
    
    // Показываем панель
    panel.show();
    
    // Проверяем, что панель видима
    expect(panel["element"].style.display).toBe('block');
    
    // Скрываем панель
    panel.hide();
    
    // Проверяем, что opacity установлен в 0
    expect(panel["element"].style.opacity).toBe('0');
    
    // Проверяем, что display еще block (ожидаем анимацию)
    expect(panel["element"].style.display).toBe('block');
    
    // Ждем завершения анимации
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(panel["element"].style.display).toBe('none');
        resolve(undefined);
      }, 310);
    });
  });
  
  test('должен удалять панель из DOM', () => {
    // Создаем панель
    const panel = new BasePanel();
    
    // Рендерим панель
    panel.render(container);
    
    // Проверяем, что панель в DOM
    expect(container.contains(panel["element"])).toBe(true);
    
    // Удаляем панель
    panel.destroy();
    
    // Проверяем, что панель удалена
    expect(container.contains(panel["element"])).toBe(false);
  });
});