/**
 * Модальное окно для отображения детальной информации о планете.
 */
import { IDot } from "@models/dot";

export class PlanetInfoModal {
  private element: HTMLDivElement | null = null;
  private planet: IDot;
  private overlay: HTMLDivElement | null = null;
  private onCloseCallback: (() => void) | null = null;

  /**
   * Создает модальное окно с информацией о планете.
   * @param planet - Планета, о которой будет отображаться информация
   * @param onClose - Опциональный колбэк, вызываемый при закрытии окна
   */
  constructor(planet: IDot, onClose?: () => void) {
    this.planet = planet;
    this.onCloseCallback = onClose || null;
    this.init();
  }

  /**
   * Инициализирует элементы модального окна.
   */
  private init(): void {
    // Создание затемненного фона
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    
    // Создание основного элемента модального окна
    this.element = document.createElement('div');
    this.element.className = 'planet-info-modal';
    
    // Добавление содержимого
    if (this.element) {
      this.element.innerHTML = this.generateContent();
    }
    
    // Обработчик закрытия по клику вне окна
    if (this.overlay) {
      this.overlay.addEventListener('click', () => {
        this.destroy();
      });
    }
    
    // Обработчик закрытия по клавише Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.destroy();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
  }

  /**
   * Генерирует HTML-содержимое модального окна.
   * @returns HTML-строка с содержимым
   */
  private generateContent(): string {
    // Вычисление расстояния до центра системы
    const distanceToCenter = Math.sqrt(this.planet.coords.x ** 2 + this.planet.coords.y ** 2);
    
    // Определение родительского тела
    const parentName = this.planet.parent ? this.planet.parent.name : 'Нет';
    
    return `\n      <div class=\"modal-header\">\n        <h3>Информация о планете</h3>\n        <button class=\"close-button\">✕</button>\n      </div>\n      <div class=\"modal-content\">\n        <div class=\"planet-detail\">\n          <span class=\"label\">Имя:</span>\n          <span class=\"value\">${this.planet.name}</span>\n        </div>\n        <div class=\"planet-detail\">\n          <span class=\"label\">Масса:</span>\n          <span class=\"value\">${this.planet.mass.toFixed(2)}</span>\n        </div>\n        <div class=\"planet-detail\">\n          <span class=\"label\">Радиус:</span>\n          <span class=\"value\">${this.planet.radius} px</span>\n        </div>\n        <div class=\"planet-detail\">\n          <span class=\"label\">Цвет:</span>\n          <span class=\"value color-value\" style=\"background-color: ${this.planet.color}\"></span>\n        </div>\n        <div class=\"planet-detail\">\n          <span class=\"label\">Скорость:</span>\n          <span class=\"value\">${this.planet.velocity.length.toFixed(2)}</span>\n        </div>\n        <div class=\"planet-detail\">\n          <span class=\"label\">Ускорение:</span>\n          <span class=\"value\">${this.planet.acceleration.length.toFixed(2)}</span>\n        </div>\n        <div class=\"planet-detail\">\n          <span class=\"label\">Координаты:</span>\n          <span class=\"value\">(${this.planet.coords.x.toFixed(0)}, ${this.planet.coords.y.toFixed(0)})</span>\n        </div>\n        <div class=\"planet-detail\">\n          <span class=\"label\">Расстояние до центра:</span>\n          <span class=\"value\">${distanceToCenter.toFixed(0)}</span>\n        </div>\n        <div class=\"planet-detail\">\n          <span class=\"label\">Родительское тело:</span>\n          <span class=\"value\">${parentName}</span>\n        </div>\n      </div>\n    `;
  }

  /**
   * Отображает модальное окно в указанном родительском элементе.
   * @param parent - Родительский элемент, в который будет добавлено окно
   */
  render(parent: HTMLElement): void {
    if (this.overlay && this.element) {
      parent.appendChild(this.overlay);
      parent.appendChild(this.element);
      
      // Анимация появления
      requestAnimationFrame(() => {
        this.overlay!.style.opacity = '1';
        this.element!.style.opacity = '1';
        this.element!.style.transform = 'translate(-50%, -50%) scale(1)';
      });
      
      // Обработчик закрытия по кнопке
      const closeButton = this.element.querySelector('.close-button');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          this.destroy();
        });
      }
    }
  }

  /**
   * Удаляет модальное окно из DOM.
   */
  destroy(): void {
    if (this.overlay && this.element) {
      // Анимация исчезновения
      this.overlay.style.opacity = '0';
      this.element.style.opacity = '0';
      this.element.style.transform = 'translate(-50%, -50%) scale(0.8)';
      
      // Удаление элементов после анимации
      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
        }
        if (this.element && this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
        
        // Вызов колбэка при закрытии
        if (this.onCloseCallback) {
          this.onCloseCallback();
        }
      }, 300);
    }
  }
}
