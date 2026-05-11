import { BasePanel } from "../BasePanel";
import { IDot } from "../../../models/dot";

import './InfoPanel.css';

/**
 * Панель информации об отслеживаемом объекте.
 * Отображает имя, массу, радиус, цвет, скорость и расстояние до центра.
 */
export class InfoPanel extends BasePanel {
  private nameEl: HTMLElement;
  private massEl: HTMLElement;
  private radiusEl: HTMLElement;
  private colorEl: HTMLElement;
  private velocityEl: HTMLElement;

  constructor() {
    super('div', 'info-panel');

    // Создаём элементы панели
    this.nameEl = this.createRow('Имя:', 'info-name');
    this.massEl = this.createRow('Масса:', 'info-mass');
    this.radiusEl = this.createRow('Радиус:', 'info-radius');
    this.colorEl = this.createRow('Цвет:', 'info-color', 'color-box');
    this.velocityEl = this.createRow('Скорость:', 'info-velocity');

    // Скрываем по умолчанию
    this.hide();
  }

  /**
   * Создаёт строку с меткой и значением.
   */
  private createRow(label: string, valueId: string, valueClass: string = ''): HTMLElement {
    const row = document.createElement('div');
    row.className = 'info-row';

    const labelEl = document.createElement('strong');
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.id = valueId;
    if (valueClass) {
      valueEl.className = valueClass;
    }

    row.appendChild(labelEl);
    row.appendChild(valueEl);
    this.element.appendChild(row);

    return valueEl;
  }

  /**
   * Обновляет содержимое панели на основе планеты.
   * Если planet = null — скрывает панель.
   */
  update(planet: IDot | null): void {
    if (!planet) {
      this.hide();
      return;
    }


    this.nameEl.textContent = planet.name;
    this.massEl.textContent = planet.mass.toFixed(2);
    this.radiusEl.textContent = `${planet.radius} px`;
    (this.colorEl as HTMLElement).style.backgroundColor = planet.color;
    this.velocityEl.textContent = planet.velocity.length.toFixed(2);

    this.show();
  }
}
