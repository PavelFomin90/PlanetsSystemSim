/**
 * Базовый класс для всех панелей UI.
 * Предоставляет общую функциональность: создание элемента, рендер, показ/скрытие.
 */
export class BasePanel {
  protected element: HTMLElement;

  constructor(tag: string = 'div', className: string = '') {
    this.element = document.createElement(tag);
    if (className) {
      this.element.className = className;
    }
  }

  /**
   * Вставляет панель в родительский элемент.
   */
  render(parent: HTMLElement): void {
    parent.appendChild(this.element);
  }

  /**
   * Показывает панель с анимацией.
   */
  show(): void {
    this.element.style.display = 'block';
    // Небольшая задержка для корректной работы transition
    requestAnimationFrame(() => {
      this.element.style.opacity = '1';
    });
  }

  /**
   * Скрывает панель с анимацией.
   */
  hide(): void {
    this.element.style.opacity = '0';
    // Скрываем элемент после завершения анимации
    setTimeout(() => {
      this.element.style.display = 'none';
    }, 300);
  }

  /**
   * Удаляет панель из DOM.
   */
  destroy(): void {
    this.element.remove();
  }
}
