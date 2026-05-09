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
   * Показывает панель.
   */
  show(): void {
    this.element.style.display = 'block';
  }

  /**
   * Скрывает панель.
   */
  hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Удаляет панель из DOM.
   */
  destroy(): void {
    this.element.remove();
  }
}
