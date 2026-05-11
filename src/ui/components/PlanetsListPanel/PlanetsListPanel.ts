/**
 * Панель, отображающая список всех планет в системе.
 * Позволяет пользователю просматривать все тела и получать детальную информацию о каждом.
 */
import { BasePanel } from "@components/BasePanel";
import { System } from "@models/system";
import { IDot } from "@models/dot";
import { PlanetInfoModal } from "./PlanetInfoModal";

import './PlanetsListPanel.css'

export class PlanetsListPanel extends BasePanel {
  private system: System;
  private planets: IDot[] = [];
  private searchInput: HTMLInputElement | null = null;
  private sortButton: HTMLButtonElement | null = null;
  private collapseButton: HTMLButtonElement | null = null;
  private planetItems: Map<string, HTMLElement> = new Map();
  private sortMode: 'name' | 'mass' | 'distance' = 'name';
  private sortDirection: 'asc' | 'desc' = 'asc';

  /**
   * Создает панель списка планет.
   * @param system - Система планет, из которой будет браться список тел
   */
  constructor(system: System) {
    super('div', 'planets-list-panel');
    this.system = system;
    this.init();
    this.renderList();
  }

  /**
   * Инициализирует компонент: создает элементы интерфейса и настраивает обработчики событий.
   */
  private init(): void {
    // Создание элементов интерфейса
    this.createHeader();
    this.createSearchInput();
    this.createSortControls();
    this.createCollapseButton();
    
    // Настройка обновления списка
    this.setupAutoUpdate();
  }

  /**
   * Создает заголовок панели.
   */
  private createHeader(): void {
    if (this.element) {
      const header = document.createElement('div');
      header.className = 'panel-header';
      header.textContent = 'Список планет';
      this.element.appendChild(header);
    }
  }

  /**
   * Создает поле поиска.
   */
  private createSearchInput(): void {
    if (this.element) {
      this.searchInput = document.createElement('input');
      this.searchInput.type = 'text';
      this.searchInput.placeholder = 'Поиск по имени...';
      this.searchInput.className = 'search-input';
      
      this.searchInput.addEventListener('input', () => {
        this.filterAndRenderList();
      });
      
      this.element.appendChild(this.searchInput);
    }
  }

  /**
   * Создает элементы управления сортировкой.
   */
  private createSortControls(): void {
    if (this.element) {
      const sortContainer = document.createElement('div');
      sortContainer.className = 'sort-controls';
      
      this.sortButton = document.createElement('button');
      this.sortButton.textContent = 'Сортировка: Имя ▲';
      this.sortButton.addEventListener('click', () => {
        this.toggleSortOrder();
      });
      
      sortContainer.appendChild(this.sortButton);
      this.element.appendChild(sortContainer);
    }
  }

  /**
   * Создает кнопку сворачивания/разворачивания панели.
   */
  private createCollapseButton(): void {
    if (this.element) {
      this.collapseButton = document.createElement('button');
      this.collapseButton.className = 'collapse-button';
      this.collapseButton.innerHTML = '◀';
      this.collapseButton.title = 'Свернуть панель';
      
      this.collapseButton.addEventListener('click', () => {
        this.toggleCollapse();
      });
      
      this.element.appendChild(this.collapseButton);
    }
  }

  /**
   * Настраивает автоматическое обновление списка планет.
   * Проверка изменений происходит каждую секунду.
   */
  private setupAutoUpdate(): void {
    // Установка интервала для периодической проверки изменений
    setInterval(() => {
      this.updatePlanetsList();
    }, 1000);
  }

  /**
   * Обновляет список планет, если были изменения в системе.
   */
  private updatePlanetsList(): void {
    const currentPlanets = this.system.getPlanets();
    
    // Проверка на изменения
    if (this.havePlanetsChanged(currentPlanets)) {
      this.planets = currentPlanets;
      this.filterAndRenderList();
    }
  }

  /**
   * Проверяет, изменился ли список планет.
   * @param newPlanets - Новый список планет
   * @returns true, если список изменился
   */
  private havePlanetsChanged(newPlanets: IDot[]): boolean {
    if (this.planets.length !== newPlanets.length) return true;
    
    for (let i = 0; i < newPlanets.length; i++) {
      if (newPlanets[i].name !== this.planets[i].name) return true;
      if (newPlanets[i].mass !== this.planets[i].mass) return true;
      if (newPlanets[i].color !== this.planets[i].color) return true;
    }
    
    return false;
  }

  /**
   * Фильтрует и отображает список планет.
   * @param planets - Список планет для отображения (опционально)
   */
  private filterAndRenderList(planets?: IDot[]): void {
    const filterText = this.searchInput?.value.toLowerCase() || '';
    let filteredPlanets = planets || this.planets;
    
    // Фильтрация по имени
    if (filterText) {
      filteredPlanets = filteredPlanets.filter(planet => 
        planet.name.toLowerCase().includes(filterText)
      );
    }
    
    // Сортировка
    filteredPlanets = this.sortPlanets(filteredPlanets);
    
    this.renderList(filteredPlanets);
  }

  /**
   * Сортирует планеты по выбранному режиму.
   * @param planets - Список планет для сортировки
   * @returns Отсортированный список планет
   */
  private sortPlanets(planets: IDot[]): IDot[] {
    const sorted = [...planets];
    
    switch (this.sortMode) {
      case 'name':
        sorted.sort((a, b) => {
          const comparison = a.name.localeCompare(b.name);
          return this.sortDirection === 'asc' ? comparison : -comparison;
        });
        break;
      case 'mass':
        sorted.sort((a, b) => {
          const comparison = a.mass - b.mass;
          return this.sortDirection === 'asc' ? comparison : -comparison;
        });
        break;
      case 'distance':
        // Сортировка по расстоянию до центра координат
        sorted.sort((a, b) => {
          const distanceA = Math.sqrt(a.coords.x ** 2 + a.coords.y ** 2);
          const distanceB = Math.sqrt(b.coords.x ** 2 + b.coords.y ** 2);
          const comparison = distanceA - distanceB;
          return this.sortDirection === 'asc' ? comparison : -comparison;
        });
        break;
    }
    
    return sorted;
  }

  /**
   * Переключает режим сортировки и направление.
   */
  private toggleSortOrder(): void {
    const modes: Array<'name' | 'mass' | 'distance'> = ['name', 'mass', 'distance'];
    const currentIndex = modes.indexOf(this.sortMode);
    
    if (currentIndex < modes.length - 1) {
      this.sortMode = modes[currentIndex + 1];
      this.sortDirection = 'asc';
    } else {
      // Вернуться к первому режиму и изменить направление
      this.sortMode = 'name';
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    // Обновить текст кнопки
    const directionSymbol = this.sortDirection === 'asc' ? '▲' : '▼';
    let modeText = 'Имя';
    
    switch (this.sortMode) {
      case 'mass':
        modeText = 'Массе';
        break;
      case 'distance':
        modeText = 'Расстоянию';
        break;
    }
    
    if (this.sortButton) this.sortButton.textContent = `Сортировка: ${modeText} ${directionSymbol}`;
    
    // Перерисовать список с новой сортировкой
    this.filterAndRenderList();
  }

  /**
   * Отрисовывает список планет.
   * @param planets - Список планет для отображения
   */
  private renderList(planets: IDot[] = this.planets): void {
    // Очистка существующих элементов (кроме заголовка и управления)
    const itemsContainer = this.element.querySelector('.planets-list') || this.createItemsContainer();
    
    // Очистка старых элементов
    while (itemsContainer.firstChild) {
      itemsContainer.removeChild(itemsContainer.firstChild);
    }
    
    // Создание новых элементов списка
    planets.forEach(planet => {
      const item = this.createPlanetItem(planet);
      itemsContainer.appendChild(item);
      this.planetItems.set(planet.name, item);
    });
    
    this.element.appendChild(itemsContainer);
  }

  /**
   * Создает контейнер для элементов списка.
   * @returns Элемент контейнера
   */
  private createItemsContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'planets-list';
    return container;
  }

  /**
   * Создает элемент списка для планеты.
   * @param planet - Планета для отображения
   * @returns Элемент списка
   */
  private createPlanetItem(planet: IDot): HTMLDivElement {
    const item = document.createElement('div');
    item.className = 'planet-item';
    item.dataset.planetName = planet.name;
    
    // Цветовой индикатор
    const colorIndicator = document.createElement('span');
    colorIndicator.className = 'color-indicator';
    colorIndicator.style.backgroundColor = planet.color;
    
    // Информация о планете
    const info = document.createElement('div');
    info.className = 'planet-info';
    info.innerHTML = `\n      <div class=\"planet-name\">${planet.name}</div>\n      <div class=\"planet-mass\">Масса: ${planet.mass.toFixed(2)}</div>\n    `;
    
    item.appendChild(colorIndicator);
    item.appendChild(info);
    
    // Обработчик клика
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handlePlanetClick(planet);
    });
    
    return item;
  }

  /**
   * Обрабатывает клик по элементу планеты.
   * @param planet - Выбранная планета
   */
  private handlePlanetClick(planet: IDot): void {
    // Показ детальной информации
    const modal = new PlanetInfoModal(planet);
    modal.render(document.body);
    
    // Фокусировка камеры на планете
    this.focusOnPlanet(planet);
    
    // Подсветка выбранного элемента
    this.highlightSelectedItem(planet.name);
  }

  /**
   * Фокусирует камеру на выбранной планете.
   * @param planet - Планета для фокусировки
   */
  private focusOnPlanet(planet: IDot): void {
    // Плавное перемещение камеры к планете
    // Использование существующего TranslateController
    const controller = (window as any).translateInstance;
    
    if (!controller) {
      console.error('TranslateController instance not found');
      return;
    }
    
    // Вычисление целевой позиции
    const targetX = window.innerWidth / 2 - planet.coords.x;
    const targetY = window.innerHeight / 2 - planet.coords.y;
    
    // Плавное перемещение
    this.animateCameraMovement(controller, targetX, targetY);
  }

  /**
   * Анимирует плавное перемещение камеры.
   * @param controller - Экземпляр TranslateController
   * @param targetX - Целевая позиция по X
   * @param targetY - Целевая позиция по Y
   */
  private animateCameraMovement(controller: any, targetX: number, targetY: number): void {
    const startX = controller.translate.x;
    const startY = controller.translate.y;
    const duration = 500; // мс
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Плавная анимация с easing функцией
      const easeProgress = this.easeOutCubic(progress);
      
      const currentX = startX + (targetX - startX) * easeProgress;
      const currentY = startY + (targetY - startY) * easeProgress;
      
      controller.setTranslate({ x: currentX, y: currentY });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  /**
   * Easing функция для плавной анимации.
   * @param t - Прогресс анимации (0-1)
   * @returns Плавное значение прогресса
   */
  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Подсвечивает выбранный элемент списка.
   * @param planetName - Имя выбранной планеты
   */
  private highlightSelectedItem(planetName: string): void {
    // Сброс подсветки всех элементов
    this.planetItems.forEach((item) => {
      item.classList.remove('selected');
    });
    
    // Подсветка выбранного элемента
    const selectedItem = this.planetItems.get(planetName);
    if (selectedItem) {
      selectedItem.classList.add('selected');
    }
  }

  /**
   * Переключает состояние свернутости панели.
   */
  private toggleCollapse(): void {
    this.element.classList.toggle('collapsed');
    this.collapseButton!.innerHTML = this.element.classList.contains('collapsed') ? '▶' : '◀';
    this.collapseButton!.title = this.element.classList.contains('collapsed') ? 'Развернуть панель' : 'Свернуть панель';
  }

  /**
   * Показывает панель.
   */
  override show(): void {
    super.show();
    this.element.classList.remove('collapsed');
    if (this.collapseButton) {
      this.collapseButton.innerHTML = '◀';
      this.collapseButton.title = 'Свернуть панель';
    }
  }

  /**
   * Скрывает панель.
   */
  override hide(): void {
    super.hide();
    this.element.classList.add('collapsed');
    if (this.collapseButton) {
      this.collapseButton.innerHTML = '▶';
      this.collapseButton.title = 'Развернуть панель';
    }
  }
}
